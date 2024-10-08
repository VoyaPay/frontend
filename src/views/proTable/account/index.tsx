import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space } from "antd";
import { Select } from "antd";
import { NavLink } from "react-router-dom";
import "./index.less";
import { UserTransfersApi } from "@/api/modules/ledger";
import { GetBalanceApi, LedgerCSVApi } from "@/api/modules/ledger";
import { AccountApi } from "@/api/modules/user";

interface FormattedTransaction {
	key: string;
	transactionType: string;
	dynamicAccountType: string;
	amount: string;
	currency: string;
	time: string;
	transactionDetail: string;
}

const Account = () => {
	const { RangePicker } = DatePicker;
	const [dataSource, setDataSource] = useState<FormattedTransaction[]>([]);
	const [filteredDataSource, setFilteredDataSource] = useState<FormattedTransaction[]>([]);
	const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
	const [selectedTimeRange, setSelectedTimeRange] = useState<any[]>([]);
	const [accountBalance, setAccountBalance] = useState(0);

	useEffect(() => {
		// Fetch initial data for balance and transactions
		const fetchData = async () => {
			await userInformation();
			await getBalance();
			await fetchTransactions();
		};
		fetchData();
	}, []);

	const getBalance = async () => {
		try {
			const response = await GetBalanceApi();
			const balance = response.currentBalance ? parseFloat(parseFloat(response.currentBalance).toFixed(2))  : 0;
			setAccountBalance(balance);
		} catch (error) {
			console.log("Cannot get balance of the account:", error);
		}
	};

	const fetchTransactions = async () => {
		try {
			const response = await UserTransfersApi();
			if (Array.isArray(response)) {
				const formattedData = response.map(transaction => ({
					
					key: transaction.id,
					transactionType:
						transaction.type === "cardPurchase"
							? "购卡"
							: transaction.type === "cardTopup"
							? "卡充值"
							: transaction.type === "deposit"
							? "账户充值"
							: transaction.type === "fee"
							? "手续费"
							: transaction.type === "closeCardRefund"
							? "销卡返还"
							: "其他",
					dynamicAccountType: transaction.origin || "N/A",
					amount: "$" + String(Math.abs(parseFloat(transaction.amount)).toFixed(2)),
					currency: "USD",
					time: formatDate(transaction.createdAt),
					transactionDetail:
						transaction.type === "cardPurchase"
							? "“沃易卡账户”转出至“预充卡”"
							: transaction.type === "cardTopup"
							? "“沃易卡账户”转出至“预充卡”"
							: transaction.type === "deposit"
							? "您的资金转入至“沃易卡账户”"
							: transaction.type === "closeCardRefund"
							? "“预充卡”转入至 “沃易卡账户”"
							: transaction.type === "fee"
							? "手续费"
							: "其他"
				}));

				setDataSource(formattedData);
				setFilteredDataSource(formattedData); // Default to show all data initially
			}
		} catch (error) {
			console.error("Error fetching transactions:", error);
		}
	};

	const getCSV = async (): Promise<void> => {
		try {
			const response = await LedgerCSVApi();
			console.log(response);
		} catch (e: any) {
			console.log(e);
		}
	};

	const columns: any[] = [
		{ title: "交易类型", dataIndex: "transactionType", key: "transactionType", align: "center", width: "200px" },
		{
			title: "金额",
			dataIndex: "amount",
			key: "amount",
			align: "center",
			width: "300px",
			sorter: (a: any, b: any) => {
				const amountA = parseFloat(a.amount.replace('$', '').replace(',', ''));
				const amountB = parseFloat(b.amount.replace('$', '').replace(',', ''));
				return amountA - amountB;
			}
		},
		{ title: "币种", dataIndex: "currency", key: "currency", align: "center", width: "200px" },
		{
			title: "时间",
			dataIndex: "time",
			key: "time",
			align: "center",
			defaultSortOrder: "descend",
			sorter: (a: any, b: any) => {
				const dateA = new Date(a.time).getTime();
				const dateB = new Date(b.time).getTime();
				return dateA - dateB;
			},
			width: "400px"
		},
		{ title: "交易明细", dataIndex: "transactionDetail", key: "transactionDetail", align: "center", width: "400px" }
	];

	// Update selected transaction types
	const handleTransactionTypeChange = (selectedTypes: string[]) => {
		setSelectedTransactionTypes(selectedTypes);
	};

	// Update selected date range
	const handleTimeChange = (dates: any) => {
		setSelectedTimeRange(dates ? [dates[0].valueOf(), dates[1].valueOf()] : []);
	};

	// Apply filters based on transaction type and date range when the user clicks "查询"
	const applyFilters = () => {
		let filteredData = dataSource; // 初始为所有数据

		// 只根据 selectedTransactionTypes 进行筛选
		if (selectedTransactionTypes.length > 0) {
			filteredData = filteredData.filter(transaction => selectedTransactionTypes.includes(transaction.transactionType));
		}

		if (selectedTimeRange.length > 0) {
			const [start, end] = selectedTimeRange;
			const adjustedStart = new Date(start).setHours(0, 0, 0, 0);

			// Set end time to 23:59:59 for the end date
			const adjustedEnd = new Date(end).setHours(23, 59, 59, 999);

			filteredData = filteredData.filter(transaction => {
				const cardDate = new Date(transaction.time).getTime();
				return cardDate >= adjustedStart && cardDate <= adjustedEnd;
			});
		}

		setFilteredDataSource(filteredData);
	};

	return (
		<div className="card content-box accountWrap">
			<div className="accountInfo">
				<div className="accountBlanceWrap">
					<span className="pre">沃易卡账户余额</span>
					<span className="amount">$ {accountBalance}</span>
				</div>
				<Button>
					<NavLink to="/recharge/index">充值</NavLink>
				</Button>
			</div>
			<div className="actionWrap">
				<div>
					<span className="title">动账明细</span>
					<Space>
						<RangePicker onChange={handleTimeChange} />
						<Select
							placeholder="请选择交易类型"
							mode="multiple"
							allowClear
							style={{ width: 200 }}
							onChange={handleTransactionTypeChange}
							options={[
								{ value: "转入", label: "转入" },
								{ value: "转出", label: "转出" },
								{ value: "充值", label: "充值" },
								{ value: "手续费", label: "手续费" },
								{ value: "其他", label: "其他" }
							]}
							className="transactionType"
						/>
						<Button type="primary" onClick={applyFilters}>
							查询
						</Button>
					</Space>
				</div>
				<Button type="primary" onClick={getCSV}>
					导出账单明细
				</Button>
			</div>
			<Table
				bordered={true}
				dataSource={filteredDataSource}
				columns={columns}
				pagination={{ pageSize: 10, showSizeChanger: false }}
			/>
		</div>
	);
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	// 返回格式为 yyyy-MM-dd hh:mm:ss
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const userInformation = async () => {
	try {
		const response = await AccountApi();
		console.log(response.userConfig.maximumCardsAllowed);
		const formattedData = {
			id: response.id || 0,
			fullName: response.fullName || "N/A",
			email: response.email || "N/A",
			companyName: response.companyName || "N/A",
			cardCreationFee: response.userConfig.cardCreationFee || "N/A",
			maximumCardsAllowed: response.userConfig.maximumCardsAllowed || 0
		};
		localStorage.setItem("userid", String(formattedData.id));
		localStorage.setItem("username", formattedData.fullName);
		localStorage.setItem("useremail", formattedData.email);
		localStorage.setItem("companyName", formattedData.companyName);
		localStorage.setItem("cardfee", formattedData.cardCreationFee);
		localStorage.setItem("cardsallowed", String(response.userConfig.maximumCardsAllowed));
	} catch (error) {
		console.log("Error fetching user information: " + error);
	}
};

export default Account;
