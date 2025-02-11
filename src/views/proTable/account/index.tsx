import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space, TableProps, Input } from "antd";
import { Select } from "antd";
const { Option } = Select;
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./index.less";
import { SearchTransfersApi, TransferEntity } from "@/api/modules/ledger";
import { GetBalanceApi, LedgerCSVApi } from "@/api/modules/ledger";
import { SearchTransferRequest } from "@/api/interface";
import { PageResponse } from "@/api";

interface TransferVo {
	key: string;
	typeLabel: string;
	type: string;
	dynamicAccountType: string;
	amount: string;
	currency: string;
	time: string;
	transactionDetail: string;
}

const TransferTypeMapping = {
	cardPurchase: "卡首充",
	cardTopup: "卡充值",
	deposit: "账户充值",
	fee: "手续费",
	cardWithdrawn: "卡提现返还",
	closeCardRefund: "销卡返还",
	cardCreationRebate: "开卡手续费返点",
	consumptionRebate: "消费返点",
	other: "其他"
};

const Account = () => {
	const { RangePicker } = DatePicker;
	const [tableSource, setTableSource] = useState<PageResponse<TransferVo>>();
	const [accountBalance, setAccountBalance] = useState(0);
	const [cardInput, setCardInput] = useState("");
	const [cardFilterType, setCardFilterType] = useState("cardLast4");
	const [searchTransferRequest, setSearchTransferRequest] = useState<SearchTransferRequest>(
		new SearchTransferRequest({ pageSize: 10 })
	);
	const location = useLocation();

	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([getBalance(), fetchTransfers()]);
		};
		fetchData();
	}, []);

	const getBalance = async () => {
		try {
			const response = await GetBalanceApi();
			const balance = response.currentBalance ? parseFloat(parseFloat(response.currentBalance).toFixed(2)) : 0;
			setAccountBalance(balance);
		} catch (error) {
			console.log("Cannot get balance of the account:", error);
		}
	};

	const getTransferDetail = (transaction: TransferEntity) => {
		let cardName = "预充卡 ";
		if (transaction.card) {
			cardName += transaction.card.number;
			if (transaction.card.alias) {
				cardName += " ( ";
				cardName += transaction.card.alias;
				cardName += " )";
			}
		}
		if (transaction.type === "cardPurchase" || transaction.type === "cardTopup") {
			return "沃易卡账户 -> " + cardName;
		} else if (transaction.type === "deposit") {
			return "您的资金转入至沃易卡账户";
		} else if (transaction.type === "closeCardRefund") {
			return cardName + " -> 沃易卡账户";
		} else if (transaction.type === "fee") {
			return cardName + " 开卡手续费";
		} else if (transaction.type === "cardWithdrawn") {
			return cardName + " -> 沃易卡账户";
		} else if (TransferTypeMapping[transaction.type as keyof typeof TransferTypeMapping]) {
			return "";
		}
		return "其他";
	};

	const fetchTransfers = async () => {
		try {
			const response = await SearchTransfersApi(searchTransferRequest);
			const formattedData = response.datalist.map(transaction => {
				return {
					key: transaction.id + "",
					typeLabel: TransferTypeMapping[transaction.type as keyof typeof TransferTypeMapping] || "其他",
					type: transaction.type,
					dynamicAccountType: transaction.origin || "N/A",
					amount: "$" + String(Math.abs(transaction.amount).toFixed(2)),
					currency: "USD",
					time: formatDate(transaction.createdAt),
					cardNumber: transaction.card?.number,
					transactionDetail: getTransferDetail(transaction)
				};
			});
			setTableSource({
				total: response.total,
				pageNum: response.pageNum,
				pageSize: response.pageSize,
				datalist: formattedData,
				totalPage: response.totalPage
			});
		} catch (error) {
			console.error("Error fetching transactions:", error);
		}
	};

	const getCSV = async (): Promise<void> => {
		try {
			await LedgerCSVApi(searchTransferRequest);
		} catch (e: any) {
			console.log(e);
		}
	};

	const columns: any[] = [
		{ title: "交易类型", dataIndex: "typeLabel", key: "typeLabel", align: "center", width: "200px" },
		{ title: "卡号", dataIndex: "cardNumber", key: "cardNumber", align: "center", width: "200px" },
		{
			title: "金额",
			dataIndex: "amount",
			key: "amount",
			align: "center",
			width: "300px",
			sorter: (a: any, b: any) => {
				const amountA = parseFloat(a.amount.replace("$", "").replace(",", ""));
				const amountB = parseFloat(b.amount.replace("$", "").replace(",", ""));
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
	const handleTransactionTypeChange = (selectedType: string) => {
		searchTransferRequest.where!.type = selectedType;
		setSearchTransferRequest({ ...searchTransferRequest });
	};

	// Update selected date range
	const handleTimeChange = (dates: any) => {
		if (dates) {
			searchTransferRequest.where!.startDate = dates[0].valueOf();
			searchTransferRequest.where!.endDate = dates[1].valueOf();
		} else {
			searchTransferRequest.where!.startDate = undefined;
			searchTransferRequest.where!.endDate = undefined;
		}
		setSearchTransferRequest({ ...searchTransferRequest });
	};

	const handlePageChange: TableProps<TransferVo>["onChange"] = (pagination, filters, sorter, extra) => {
		console.log(pagination, filters, sorter, extra);
		searchTransferRequest.pageNum = pagination.current ?? 1;
		searchTransferRequest.pageSize = pagination.pageSize ?? 10;
		setSearchTransferRequest({ ...searchTransferRequest });
		fetchTransfers();
	};

	const onCardFilterChanged = (input: string, type: string) => {
		searchTransferRequest.where!.cardLast4 = input && type === "cardLast4" ? input : undefined;
		searchTransferRequest.where!.cardId = input && type === "cardId" ? parseInt(input) : undefined;
		searchTransferRequest.where!.cardExternalId = input && type === "cardExternalId" ? input : undefined;
		searchTransferRequest.where!.cardAlias = input && type === "cardAlias" ? input : undefined;
		setSearchTransferRequest({ ...searchTransferRequest });
	};

	const handleCardFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardInput(e.target.value);
		onCardFilterChanged(e.target.value, cardFilterType);
	};

	const handleCardFilterTypeChange = (value: string) => {
		setCardFilterType(value);
		onCardFilterChanged(cardInput, value);
	};

	// Apply filters based on transaction type and date range when the user clicks "查询"
	const applyFilters = () => {
		searchTransferRequest.pageNum = 1;
		setSearchTransferRequest({ ...searchTransferRequest });
		fetchTransfers();
	};

	return (
		<>
			{location.pathname === "/account/recharge" ? (
				<Outlet />
			) : (
				<div className="card content-box accountWrap">
					<div className="accountInfo">
						<div className="accountBlanceWrap">
							<span className="pre">沃易卡账户余额</span>
							<span className="amount">{accountBalance >= 0 ? `$ ${accountBalance}` : `-$ ${Math.abs(accountBalance)}`}</span>
						</div>
						<Button>
							<NavLink to="/account/recharge">充值</NavLink>
						</Button>
					</div>
					<div className="actionWrap">
						<div>
							<span className="title">动账明细</span>
							<Space>
								<RangePicker onChange={handleTimeChange} />
								<Select
									placeholder="请选择交易类型"
									// mode="multiple"
									allowClear
									style={{ width: 200 }}
									onChange={handleTransactionTypeChange}
									options={Object.entries(TransferTypeMapping).map(([key, type]) => {
										return { label: type, value: key };
									})}
									className="transactionType"
								/>
								<Input.Group compact>
									<Select defaultValue="cardLast4" style={{ width: "40%" }} onChange={handleCardFilterTypeChange}>
										<Option value="cardLast4">卡号</Option>
										<Option value="cardId">卡ID</Option>
										<Option value="cardExternalId">卡外部ID</Option>
										<Option value="cardAlias">卡昵称</Option>
									</Select>
									<Input style={{ width: "50%" }} value={cardInput} onChange={handleCardFilterChange} allowClear />
								</Input.Group>
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
						dataSource={tableSource?.datalist}
						columns={columns}
						onChange={handlePageChange}
						pagination={{
							pageSize: 10,
							showSizeChanger: false,
							total: tableSource?.total,
							showTotal: total => `共 ${total} 条`
						}}
					/>
				</div>
			)}
		</>
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

export default Account;
