import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space } from "antd";
import { Select } from "antd";
import { NavLink } from "react-router-dom";
import "./index.less";
import { UserTransfersApi } from "@/api/modules/ledger";
import { GetBalanceApi } from "@/api/modules/ledger";
import { AccountApi } from "@/api/modules/user";
interface UserData {
	id: number;
	fullName: string;
	email: string;
	companyName: string;
  }

const userInformation = async () => {
try {
	const response = await AccountApi(); // Fetch user data from API
	console.log(response);

	// Format the response data and set it to the state
	const formattedData: UserData = {
	id: response.id || 0,  // Default to 0 if undefined
	fullName: response.fullName || "N/A",  // Default to "N/A" if undefined
	email: response.email || "N/A",  // Default to "N/A" if undefined
	companyName: response.companyName || "N/A",  // Default to "N/A" if undefined
	};
	console.log(JSON.stringify(formattedData))
	localStorage.setItem("userid", String(formattedData.id));
	localStorage.setItem("username", formattedData.fullName);
	localStorage.setItem("useremail", formattedData.email);
	localStorage.setItem("companyName", formattedData.companyName);

} catch (error) {
	console.log("Error fetching user information: " + error);
}
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

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
	const [selectedDateRange, setSelectedDateRange] = useState<[string, string] | null>(null);
	const [accountBalance, setAccountBalance] = useState(0);

	useEffect(() => {
		userInformation()
		const getBalance = async () => {
			try {
				const response = await GetBalanceApi();
				console.log(response);
				console.log("Full response:", response.currentBalance);
				const balance = response.currentBalance ? parseFloat(response.currentBalance) : 0;
				setAccountBalance(balance);
			} catch (error) {
				console.log("Cannot get balance of the account:", error);
			}
		};

		getBalance();
		const fetchData = async () => {
			try {
				const response = await UserTransfersApi();
				if (Array.isArray(response)) {
					// 格式化每个交易
					const formattedData = response.map(transaction => ({
						key: transaction.id,
						transactionType: transaction.type === "cardPurchase" 
							? "转出" 
							: transaction.type === "cardTopup"
							? "充值" 
							: transaction.type === "deposit"
							? "转入"
							: transaction.type === "fee"
							? "手续费"
							: transaction.type === "other"
							? "其他"
							: transaction.type,
						dynamicAccountType: transaction.origin || "N/A",
						amount: String(Math.abs(parseFloat(transaction.amount))),
						currency: "USD",
						time: formatDate(transaction.processedAt),
						transactionDetail: transaction.type === "cardPurchase" 
						? "“预付卡”转出至 “沃易卡账户”" 
						: transaction.type === "cardTopup"
						? "充值至 “沃易卡账户”" 
						: transaction.type === "deposit"
						? "“沃易卡账户”转出至“预付卡”"
						: transaction.type === "fee"
						? "开卡手续费"
						: transaction.type === "other"
						? "其他"
						: transaction.type,
					}));

					setDataSource(formattedData);
					setFilteredDataSource(formattedData); 
					getBalance()

				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	const columns: any[] = [
		{
			title: "交易类型",
			dataIndex: "transactionType",
			key: "transactionType",
			align: "center"
		},
		{
			title: "金额",
			dataIndex: "amount",
			key: "amount",
			align: "center"
		},
		{
			title: "币种",
			dataIndex: "currency",
			key: "currency",
			align: "center"
		},
		{
			title: "时间",
			dataIndex: "time",
			key: "time",
			align: "center"
		},
		{
			title: "交易明细",
			dataIndex: "transactionDetail",
			key: "transactionDetail",
			align: "center"
		}
	];

	// Handle change in transaction type filter
	const handleTransactionTypeChange = (selectedTypes: string[]) => {
		setSelectedTransactionTypes(selectedTypes);
		applyFilters(selectedTypes, selectedDateRange);
	};

	// Handle date range filter
	const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
		setSelectedDateRange(dateStrings);
		applyFilters(selectedTransactionTypes, dateStrings);
	};

	// Filter data based on both selected types and date range
	const applyFilters = (selectedTypes: string[], dateRange: [string, string] | null) => {
		let filteredData = dataSource;

		// Filter by transaction type if any types are selected
		if (selectedTypes.length > 0) {
			filteredData = filteredData.filter(transaction => 
				selectedTypes.includes(transaction.transactionType)
			);
		}

		// Filter by date range if a date range is selected
		if (dateRange) {
			const [startDate, endDate] = dateRange;
			filteredData = filteredData.filter(transaction => {
				const transactionDate = new Date(transaction.time);
				return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
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
						<RangePicker onChange={handleDateRangeChange} />
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
								{ value: "其他", label: "其他" }
							]}
							className="transactionType"
						/>
						<Button type="primary">查询</Button>
					</Space>
				</div>
				<Button type="primary">导出账单明细</Button>
			</div>
			<Table bordered={true} dataSource={filteredDataSource} columns={columns} />
		</div>
	);
};

export default Account;
