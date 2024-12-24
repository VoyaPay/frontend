import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space, Input, Tooltip, TablePaginationConfig, TableProps } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
import { Select } from "antd";
import { useLocation } from "react-router-dom";

import "./index.less";
import { CardsCSVApi, SearchTransactionApi, TransactionsCSVApi } from "@/api/modules/transactions";
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
	cardGroup: string;
	cardNo: string;
	cardStatus: string;
	balance: number;
	createCardTime: string;
	updateCardTime: string;
	cardHolderAddressStreet: string;
	cardHolderAddressCity: string;
	cardHolderAddressState: string;
	cardHolderAddressPostalCode: string;
	cardHolderAddressCountry: string;
	partnerIdempotencyKey: string;
	cardHolderName: string;
	number?: string;
	maximumCardsAllowed?: number;
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

	// 按钮权限

	const { RangePicker } = DatePicker;
	const [tradeType, setTradeType] = useState("auth");
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
	const [cardTableParams, setCardTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: TRANSACTION_DEFAULT_PAGE_SIZE,
			showSizeChanger: false
		}
	});

	const getBillCSV = async (): Promise<void> => {
		try {
			await TransactionsCSVApi({
				where: {
					startDate: selectedTimeRange ? selectedTimeRange[0] : undefined,
					endDate: selectedTimeRange ? selectedTimeRange[1] : undefined,
					status: tranStatus,
					merchantName: merchant,
					cardNumber: cardNoSearch
				},
				sortBy: TRANSACTION_DEFAULT_SORT_FIELD,
				asc: false,
				pageNum: 1,
				pageSize: TRANSACTION_DEFAULT_PAGE_SIZE
			});
		} catch (e: any) {
			console.log(e);
		}
	};

	const getCardCSV = () => {
		CardsCSVApi({
			where: {
				createdAt: {
					min: selectedTimeRange && selectedTimeRange.length > 0 ? selectedTimeRange[0] : undefined,
					max: selectedTimeRange && selectedTimeRange.length > 0 ? handleTimeFormat(selectedTimeRange[1]) : undefined
				}
			},
			pageNum: cardTableParams.pagination?.current ?? 1,
			pageSize: cardTableParams.pagination?.pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE
		});
	};

	useEffect(() => {
		fetchUserCards(1, TRANSACTION_DEFAULT_PAGE_SIZE);
		searchTransaction(1, TRANSACTION_DEFAULT_PAGE_SIZE);
	}, []);

	const createCardColumns: any[] = [
		{
			title: "卡昵称",
			dataIndex: "cardName",
			key: "cardName",
			align: "center",
			width: "40px", // Fixed width for this column
			render: (cardName: string) => (
				<Tooltip title={cardName?.length > 17 ? cardName : ""}>
					{cardName?.length > 17 ? `${cardName.substring(0, 17)}...` : cardName}
				</Tooltip>
			)
		},
		{
			title: "持卡人",
			dataIndex: "cardHolderName",
			key: "cardHolderName",
			align: "center",
			width: "40px",
			render: (cardHolderName: string) => (
				<Tooltip title={cardHolderName?.length > 17 ? cardHolderName : ""}>
					{cardHolderName?.length > 17 ? `${cardHolderName.substring(0, 17)}...` : cardHolderName}
				</Tooltip>
			)
		},

		{
			title: "卡组",
			dataIndex: "cardGroup",
			key: "cardGroup",
			align: "center",
			width: "30px"
		},
		{
			title: "卡号",
			dataIndex: "cardNo",
			key: "cardNo",
			align: "center",
			width: "50px"
		},
		{
			title: "状态",
			dataIndex: "cardStatus",
			key: "cardStatus",
			align: "center",
			width: "30px",
			render: (status: string) =>
				status === "Active"
					? "活跃"
					: status === "Inactive"
					? "已冻结"
					: status === "Closed"
					? "已注销"
					: status === "PreClose"
					? "待注销"
					: "N/A"
		},
		{
			title: "余额",
			dataIndex: "balance",
			key: "balance",
			align: "center",
			width: "30px",
			sorter: (a: any, b: any) => a.balance - b.balance,
			render: (balance: number) => (balance >= 0 ? `$${balance}` : `-$${Math.abs(balance)}`)
		},
		{
			title: "开卡时间",
			dataIndex: "createCardTime",
			key: "createCardTime",
			align: "center",
			width: "50px",
			defaultSortOrder: "descend",
			sorter: (a: any, b: any) => {
				const dateA = new Date(a.createCardTime).getTime();
				const dateB = new Date(b.createCardTime).getTime();
				return dateA - dateB;
			}
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
			align: "center",
			width: 100
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
			align: "center",
			width: 100
		},
		{
			title: "交易金额",
			dataIndex: "merchantAmount",
			key: "merchantAmount",
			align: "center",
			width: 120,
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
					return "--";
				}
				return parseFloat(amount);
			}
		},
		{
			title: "授权ID",
			dataIndex: "orderNumber",
			key: "orderNumber",
			align: "center",
			render: (record: any) => {
				return record ? record : "--";
			}
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
	const [cardType, setCardType] = useState<string[]>([]);
	const [merchant, setMerchant] = useState("");
	const [tranStatus, setTranStatus] = useState(undefined);

	const handleTimeChange = (dates: any) => {
		setSelectedTimeRange(dates ? [dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")] : []);
	};

	const handleCardTypeChange = (value: string[]) => {
		setCardType(value);
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

	const handleTimeFormat = (time: string) => {
		const date = new Date(time);
		date.setHours(23, 59, 59, 999);
		return date;
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

	const handleCardTableChange: TableProps<FormattedCard>["onChange"] = pagination => {
		setCardTableParams({
			pagination: {
				...cardTableParams.pagination,
				current: pagination.current,
				pageSize: pagination.pageSize
			}
		});
		fetchUserCards(pagination.current ?? 1, pagination.pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE);
	};

	const fetchUserCards = async (pageNum: number, pageSize: number, adjustedStart?: number, adjustedEnd?: number) => {
		try {
			const response = await UserCardApi({
				where: {
					createdAt: {
						min: adjustedStart ?? undefined,
						max: adjustedEnd ?? undefined
					}
				},
				pageNum: pageNum ?? 1,
				pageSize: pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE
			});
			setCardTableParams({
				pagination: {
					...cardTableParams.pagination,
					current: response.pageNum ?? 1,
					total: response.total ?? 0
				}
			});
			if (Array.isArray(response?.datalist)) {
				const formattedData = response?.datalist.map((card: any) => ({
					key: card.id || "",
					cardName: card.alias || "",
					cardGroup: card.network || "",
					cardNo: card.number || "",
					cardStatus: card.status || "",
					balance: card.balance || "",
					createCardTime: formatDate(card.createdAt) || "",
					updateCardTime: formatDate(card.updatedAt) || "",
					cardHolderAddressStreet: card.cardHolderAddressStreet || "",
					cardHolderAddressCity: card.cardHolderAddressCity || "",
					cardHolderAddressState: card.cardHolderAddressState || "",
					cardHolderAddressPostalCode: card.cardHolderAddressPostalCode || "",
					cardHolderAddressCountry: card.cardHolderAddressPostalCountry || "",
					partnerIdempotencyKey: card.partnerIdempotencyKey || "",
					cardHolderName: `${card.cardHolderFirstName ? card.cardHolderFirstName : "FM"} ${
						card.cardHolderLastName ? card.cardHolderLastName : "LM"
					}`
				}));
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
				startDate: selectedTimeRange && selectedTimeRange.length > 0 ? selectedTimeRange[0] : undefined,
				endDate: selectedTimeRange && selectedTimeRange.length > 0 ? selectedTimeRange[1] : undefined,
				status: tranStatus,
				merchantName: merchant,
				cardNumber: cardNoSearch
			},
			sortBy: sortBy,
			asc: asc,
			pageNum: current ?? 1,
			pageSize: pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE
		};
		SearchTransactionApi(requestBody).then(res => {
			const formattedData = res.datalist?.map((tran: any) => {
				const t: FormattedTransaction = {
					...tran,
					key: tran.id,
					amount: tran.amount,
					transactionTime: formatDate(tran.transactionTime),
					status: StatusMapping[tran.status as keyof typeof StatusMapping],
					cardType: CardTypeMapping[tran.cardType as keyof typeof CardTypeMapping],
					wrongReason: tran.status === "Declined" ? tran.notes : "--"
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
		let adjustedStart: number | undefined = undefined;
		let adjustedEnd: number | undefined = undefined;
		if (selectedTimeRange.length > 0) {
			const [start, end] = selectedTimeRange;
			adjustedStart = new Date(start).setHours(0, 0, 0, 0);
			adjustedEnd = new Date(end).setHours(23, 59, 59, 999);
		}
		fetchUserCards(1, TRANSACTION_DEFAULT_PAGE_SIZE, adjustedStart, adjustedEnd);
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
							<Input
								placeholder="商户名称"
								style={{ width: 200 }}
								onPressEnter={onClickSearch}
								allowClear
								onChange={(e: any) => {
									setMerchant(e.target.value);
								}}
							/>
							<Select
								placeholder="支付状态"
								allowClear
								style={{ width: 120 }}
								onChange={value => {
									setTranStatus(value);
								}}
								options={Object.entries(StatusMapping).map(([key, label]) => ({ value: key, label }))}
								className="transactionType"
							/>

							<Input
								placeholder="卡号"
								style={{ width: 200 }}
								value={cardNoSearch}
								onPressEnter={onClickSearch}
								allowClear
								onChange={(e: any) => {
									const value = e.target.value;
									// 使用正则表达式过滤掉非数字字符
									const filteredValue = value.replace(/[^0-9*]/g, ""); // \D 表示非数字
									setCardNoSearch(filteredValue); // 更新用户输入的值
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
								value={cardType}
								style={{ width: 120 }}
								onChange={handleCardTypeChange}
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
				{tradeType === "auth" ? (
					<Button type="primary" onClick={getBillCSV}>
						导出账单明细
					</Button>
				) : (
					<Button type="primary" onClick={getCardCSV}>
						导出开卡明细
					</Button>
				)}
			</div>
			{tradeType === "auth" ? (
				<Table
					bordered={true}
					dataSource={transactionPage}
					columns={columns}
					scroll={{ x: 1400 }}
					pagination={transactionTableParams.pagination}
					onChange={handleTransactionTableChange}
				/>
			) : (
				<Table
					bordered={true}
					dataSource={filteredData}
					columns={columns}
					scroll={{ x: 1400 }}
					pagination={cardTableParams.pagination}
					onChange={handleCardTableChange}
				/>
			)}
		</div>
	);
};

export default TradeQuery;
