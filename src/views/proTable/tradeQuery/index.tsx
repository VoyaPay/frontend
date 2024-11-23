import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space, Input, Tooltip, TablePaginationConfig, TableProps } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
import { Select } from "antd";
import { useLocation } from "react-router-dom";

import "./index.less";
import { SearchTransactionApi, TransactionsCSVApi } from "@/api/modules/transactions";
import { UserCardApi } from "@/api/modules/prepaid";
import { SearchTransactionRequest, TransactionListItem } from "@/api/interface";
import { SorterResult } from "antd/es/table/interface";

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

const TRANSACTION_DEFAULT_SORT_FIELD = "transactionTime";
const TRANSACTION_DEFAULT_PAGE_SIZE = 10;

const StatusMapping = {
	Authorized: "已授权",
	Settled: "已结算",
	Declined: "失败",
	Reversed: "退款",
	AuthDeleted: "撤销授权"
};

const CardTypeMapping = {
	PrefundCredit: "预充卡",
	Shared: "共享卡"
};

interface FormattedCard {
	key: string;
	cardName: string;
	cardOwner: string;
	cardGroup: string;
	cardNo: string;
	cardStatus: string;
	balance: string;
	createCardTime: string;
}

interface CardData {
	key: string;
	cardName: string;
	cardOwner: string;
	cardGroup: string;
	cardNo: string;
	cardStatus: string;
	balance: string;
	createCardTime: string;
	address?: string;
	expirationDate?: string;
	cvv2?: string;
}

interface TableParams {
	pagination?: TablePaginationConfig;
	sortField?: SorterResult<any>["field"];
	sortOrder?: SorterResult<any>["order"];
	// filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

interface FormattedTransaction extends TransactionListItem {
	key: string;
	wrongReason?: string;
}

const TradeQuery = () => {
	const location = useLocation();
	const defaultCardData: CardData = {
		key: "",
		cardName: "defaultCardName",
		cardOwner: "defaultOwner",
		cardGroup: "defaultGroup",
		cardNo: "",
		cardStatus: "defaultStatus",
		balance: "0",
		createCardTime: "2023-01-01 00:00:00"
	};
	const cardData = (location.state as CardData) ?? defaultCardData;
	console.log(cardData);

	// 按钮权限

	const { RangePicker } = DatePicker;
	const [tradeType, setTradeType] = useState("auth");
	const [dataSource, setDataSource] = useState<FormattedCard[]>([]);
	const [filteredData, setFilteredData] = useState<FormattedCard[]>([]);
	const [transactionPage, setTransactionPage] = useState<FormattedTransaction[]>([]);
	const [transactionTableParams, setTransactionTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: TRANSACTION_DEFAULT_PAGE_SIZE,
			showSizeChanger: false
		},
		sortField: TRANSACTION_DEFAULT_SORT_FIELD,
		sortOrder: "descend"
	});

	const getCSV = async (): Promise<void> => {
		try {
			const response = await TransactionsCSVApi({
				where: {
					startDate: selectedTimeRange ? selectedTimeRange[0] : undefined,
					endDate: selectedTimeRange ? selectedTimeRange[1] : undefined,
					status: tranStatus,
					merchant: merchant,
					cardNumber: cardNoSearch
				},
				sortBy: TRANSACTION_DEFAULT_SORT_FIELD,
				asc: false,
				pageNum: 1,
				pageSize: TRANSACTION_DEFAULT_PAGE_SIZE
			});
			console.log(response);
		} catch (e: any) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchUserCards();
		searchTransaction(1, TRANSACTION_DEFAULT_PAGE_SIZE);
	}, []);

	const createCardColumns: any[] = [
		{
			title: "卡号",
			dataIndex: "cardNo",
			key: "cardNo",
			align: "center",
			width: "200px"
		},
		{
			title: "卡片类型",
			dataIndex: "cardType",
			key: "cardType",
			align: "center",
			width: "100px",
			render: (cardType: string) => (cardType === "PrefundCredit" ? "预充卡" : "共享卡")
		},

		{
			title: "开卡时间",
			dataIndex: "createTime",
			key: "createTime",
			align: "center",
			width: "200px",
			defaultSortOrder: "descend",
			sorter: (a: any, b: any) => {
				const dateA = new Date(a.createTime).getTime();
				const dateB = new Date(b.createTime).getTime();
				return dateA - dateB;
			}
		},
		{
			title: "卡昵称",
			dataIndex: "cardName",
			key: "cardName",
			align: "center",
			width: "200px", // Fixed width in pixels
			render: (cardName: string) => (
				<Tooltip title={cardName.length > 17 ? cardName : ""}>
					{cardName.length > 17 ? `${cardName.substring(0, 17)}...` : cardName}
				</Tooltip>
			)
		},
		{
			title: "卡组",
			dataIndex: "cardGroup",
			key: "cardGroup",
			align: "center",
			width: "100px" // Fixed width in pixels
		}
	];

	const transactionColumns: any[] = [
		{
			title: "时间",
			dataIndex: TRANSACTION_DEFAULT_SORT_FIELD,
			key: TRANSACTION_DEFAULT_SORT_FIELD,
			align: "center",
			sorter: true
		},

		{
			title: "卡号",
			dataIndex: "cardNum",
			key: "cardNum",
			align: "center"
		},
		{
			title: "卡片类型",
			dataIndex: "cardType",
			key: "cardType",
			align: "center"
		},
		{
			title: "商户名称",
			dataIndex: "merchantName",
			key: "merchantName",
			align: "center"
		},
		{
			title: "支付状态",
			dataIndex: "status",
			key: "status",
			align: "center"
		},
		{
			title: "交易金额",
			dataIndex: "merchantAmount",
			key: "merchantAmount",
			align: "center",
			sorter: true,
			render: (amount: string, row: any) => {
				if (!amount) {
					return "0";
				}
				// Parse the amount as a float to handle conditional formatting
				const numericAmount = parseFloat(amount);
				const formattedAmount = numericAmount >= 0 ? `${numericAmount}` : `-${Math.abs(numericAmount)}`;
				if (row.conversionRate != 1) {
					return <Tooltip title={`汇率: ${row.conversionRate}`}>{formattedAmount + " " + row.currencyCode}</Tooltip>;
				}
				return formattedAmount + " " + row.currencyCode;
			}
		},
		{
			title: "授权金额(USD)",
			dataIndex: "amount",
			key: "amount",
			align: "center",
			sorter: true,
			render: (amount: string) => {
				if (!amount) {
					return "0";
				}
				return parseFloat(amount);
			}
		},
		{
			title: "结算金额(USD)",
			dataIndex: "totalAmount",
			key: "totalAmount",
			align: "center",
			sorter: true,
			render: (amount: string) => {
				if (!amount) {
					return "";
				}
				return parseFloat(amount);
			}
		},
		{
			title: "授权ID",
			dataIndex: "orderNumber",
			key: "orderNumber",
			align: "center"
		},
		{
			title: "失败原因",
			dataIndex: "wrongReason",
			key: "wrongReason",
			align: "center"
		},
		{
			title: "索引号",
			dataIndex: "id",
			key: "id",
			align: "center"
		}
	];
	const [columns, setColumns] = useState(transactionColumns);
	const [selectedTimeRange, setSelectedTimeRange] = useState<any[]>([]);
	const [cardNoSearch, setCardNoSearch] = useState(cardData.cardNo || "");
	const [merchant, setMerchant] = useState("");
	const [tranStatus, setTranStatus] = useState(undefined);

	const handleTimeChange = (dates: any) => {
		setSelectedTimeRange(dates ? [dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")] : []);
		console.log("dates", [dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")]);
	};

	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
	};

	const changeTradeType = (type: any) => {
		setTradeType(type);
		if (type == "create") {
			setColumns(createCardColumns);
		}
		if (type == "auth") {
			setColumns(transactionColumns);
		}
	};

	const onClickSearch = () => {
		setTransactionTableParams({
			pagination: {
				...transactionTableParams.pagination,
				current: 1
			}
		});
		searchTransaction(1, transactionTableParams.pagination?.pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE);
	};

	const handleTransactionTableChange: TableProps<FormattedTransaction>["onChange"] = (pagination, filters, sorter) => {
		const sortField = Array.isArray(sorter) ? TRANSACTION_DEFAULT_SORT_FIELD : sorter.field?.toString();
		const sortOrder = Array.isArray(sorter) ? "ascend" : sorter.order;
		setTransactionTableParams({
			pagination: {
				...transactionTableParams.pagination,
				current: pagination.current,
				pageSize: pagination.pageSize
			},
			sortField,
			sortOrder
		});
		searchTransaction(
			pagination.current ?? 1,
			pagination.pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE,
			sortField,
			sortOrder === "ascend"
		);
	};

	const fetchUserCards = async () => {
		try {
			const response = await UserCardApi();
			console.log(response);
			if (Array.isArray(response)) {
				const formattedData = response.map(card => ({
					key: card.id,
					cardName: card.alias,
					cardOwner: "NA",
					cardGroup: card.network,
					cardNo: card.number,
					cardStatus: card.status,
					balance: card.initialLimit,
					createCardTime: formatDate(card.transactionTime),
					createTime: formatDate(card.createdAt),
					cardType: card.type
				}));

				setDataSource(formattedData);
				setFilteredData(formattedData);
			}
		} catch (error) {
			console.error("Failed to fetch user cards:", error);
		}
	};

	const searchTransaction = (
		current: number,
		pageSize: number,
		sortBy: string = TRANSACTION_DEFAULT_SORT_FIELD,
		asc: boolean = false
	) => {
		const requestBody: SearchTransactionRequest = {
			where: {
				startDate: selectedTimeRange ? selectedTimeRange[0] : undefined,
				endDate: selectedTimeRange ? selectedTimeRange[1] : undefined,
				status: tranStatus,
				merchant: merchant,
				cardNumber: cardNoSearch
			},
			sortBy: sortBy,
			asc: asc,
			pageNum: current ?? 1,
			pageSize: pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE
		};
		SearchTransactionApi(requestBody).then(res => {
			console.log("search result", res);
			const formattedData = res.datalist?.map((tran: any) => {
				const t: FormattedTransaction = {
					...tran,
					key: tran.id,
					amount: tran.amount,
					transactionTime: formatDate(tran.transactionTime),
					status: StatusMapping[tran.status as keyof typeof StatusMapping],
					cardType: CardTypeMapping[tran.cardType as keyof typeof CardTypeMapping],
					wrongReason: tran.status === "Declined" ? tran.notes : ""
				};
				return t;
			});
			setTransactionTableParams({
				pagination: {
					...transactionTableParams.pagination,
					current: res.pageNum,
					total: res.total
				}
			});
			if (formattedData) {
				setTransactionPage(formattedData);
			}
		});
	};

	const applyFilters = () => {
		let filtered = [...dataSource];
		console.log("filter" + filtered);

		// Apply date range filter
		if (selectedTimeRange.length > 0) {
			const [start, end] = selectedTimeRange;
			const adjustedStart = new Date(start).setHours(0, 0, 0, 0);

			// Set end time to 23:59:59 for the end date
			const adjustedEnd = new Date(end).setHours(23, 59, 59, 999);

			filtered = filtered.filter(card => {
				const cardDate = new Date(card.createCardTime).getTime();
				return cardDate >= adjustedStart && cardDate <= adjustedEnd;
			});
		}

		// Apply card group filter
		if (cardNoSearch) {
			filtered = filtered.filter(card => card.cardNo.includes(cardNoSearch));
		}

		setFilteredData(filtered);
	};

	return (
		<div className="card content-box tradeQueryWrap">
			<div className="tradeQueryTitle">交易查询</div>
			<div className="tradeTypeWrap">
				<div
					className={tradeType == "auth" ? "tradeType selected" : "tradeType"}
					onClick={() => {
						changeTradeType("auth");
					}}
				>
					消费明细
				</div>
				<div
					className={tradeType == "create" ? "tradeType selected" : "tradeType"}
					onClick={() => {
						changeTradeType("create");
					}}
				>
					开卡明细
				</div>
			</div>

			<div className="actionWrap">
				<div>
					{tradeType === "auth" ? (
						<Space>
							<RangePicker onChange={handleTimeChange} style={{ width: 250 }} />
							{/*<Select*/}
							{/*	placeholder="卡片类型"*/}
							{/*	mode="multiple"*/}
							{/*	allowClear*/}
							{/*	style={{ width: 120 }}*/}
							{/*	onChange={handleChange}*/}
							{/*	options={[*/}
							{/*		{ value: "PrefundCredit", label: "预充卡" },*/}
							{/*		{ value: "share", label: "共享卡" }*/}
							{/*	]}*/}
							{/*	className="transactionType"*/}
							{/*/>*/}
							<Input
								placeholder="商户名称" // Provide a default placeholder
								style={{ width: 200 }}
								onChange={(e: any) => {
									setMerchant(e.target.value);
									console.log("merchant status " + merchant + " merchant value：" + e.target.value);
								}}
							/>
							<Select
								placeholder="支付状态"
								allowClear
								style={{ width: 120 }}
								onChange={value => {
									setTranStatus(value);
									console.log("tran status " + tranStatus + " value：" + value);
								}}
								options={Object.entries(StatusMapping).map(([key, label]) => ({ value: key, label }))}
								className="transactionType"
							/>

							<Input
								placeholder="卡号"
								style={{ width: 200 }}
								value={cardNoSearch}
								onChange={(e: any) => {
									const value = e.target.value;
									// 使用正则表达式过滤掉非数字字符
									const filteredValue = value.replace(/[^0-9*]/g, ""); // \D 表示非数字
									setCardNoSearch(filteredValue); // 更新用户输入的值
									console.log("card No search: " + filteredValue);
								}}
							/>

							<Button type="primary" onClick={onClickSearch}>
								查询
							</Button>
						</Space>
					) : (
						<Space>
							<RangePicker onChange={handleTimeChange} style={{ width: 250 }} />
							<Select
								placeholder="卡片类型"
								mode="multiple"
								allowClear
								style={{ width: 120 }}
								onChange={handleChange}
								options={[
									{ value: "PrefundCredit", label: "预充卡" },
									{ value: "Share", label: "共享卡" }
								]}
								className="transactionType"
							/>
							<Button type="primary" onClick={applyFilters}>
								查询
							</Button>
						</Space>
					)}
				</div>
				<Button type="primary" onClick={getCSV}>
					导出账单明细
				</Button>
			</div>
			{tradeType === "auth" ? (
				<Table
					bordered={true}
					dataSource={transactionPage}
					columns={columns}
					pagination={transactionTableParams.pagination}
					onChange={handleTransactionTableChange}
				/>
			) : (
				<Table
					bordered={true}
					dataSource={filteredData}
					columns={columns}
					pagination={{ pageSize: 10, showSizeChanger: false }}
				/>
			)}
		</div>
	);
};

export default TradeQuery;
