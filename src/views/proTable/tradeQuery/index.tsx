import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space, Input, Tooltip} from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
import { Select } from "antd";
import { useLocation } from "react-router-dom";
import filter from "@/assets/images/filter.png";
import "./index.less";
import { TransactionsCSVApi } from "@/api/modules/transactions";
import { UserCardApi } from "@/api/modules/prepaid";

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
interface FormattedCard {
	key: string;
	cardName: string;
	cardOwner: string;
	cardGroup: string;
	cardNo: string;
	cardStatus: string;
	banlance: string;
	createCardTime: string;
}

interface CardData {
	key: string;
	cardName: string;
	cardOwner: string;
	cardGroup: string;
	cardNo: string;
	cardStatus: string;
	banlance: string;
	createCardTime: string;
	address?: string;
	expirationDate?: string;
	cvv2?: string;
}
const getCSV = async (): Promise<void> => {
	try {
		const response = await TransactionsCSVApi();
		console.log(response);
	} catch (e: any) {
		console.log(e);
	}
};

const TradeQuery = () => {
	const location = useLocation();
	const defaultCardData: CardData = {
		key: "",
		cardName: "defaultCardName",
		cardOwner: "defaultOwner",
		cardGroup: "defaultGroup",
		cardNo: "0000",
		cardStatus: "defaultStatus",
		banlance: "0",
		createCardTime: "2023-01-01 00:00:00"
	};
	const cardData = (location.state as CardData) ?? defaultCardData;
	console.log(cardData);

	// 按钮权限

	const { RangePicker } = DatePicker;
	const [tradeType, setTradeType] = useState("auth");
	const [dataSource, setDataSource] = useState<FormattedCard[]>([]);
	const [filteredData, setFilteredData] = useState<FormattedCard[]>([]);

	useEffect(() => {
		const fetchUserCards = async () => {
			try {
				const response = await UserCardApi();
				console.log(response);
				if (Array.isArray(response)) {
					const formattedData = response
					.filter(card => card.type === "PrePaid") 
					.map(card => ({
						key: card.id,
						cardName: card.alias,
						cardOwner: "NA",
						cardGroup: card.network,
						cardNo: card.last4,
						cardStatus: card.status,
						banlance: card.initialLimit,
						createCardTime: formatDate(card.createdAt),
						cardType:card.type,

					}));

					setDataSource(formattedData);
					setFilteredData(formattedData);
				}
			} catch (error) {
				console.error("Failed to fetch user cards:", error);
			}
		};

		fetchUserCards();
	}, []);

	const createColumns: any[] = [
    {
        title: "卡号",
        dataIndex: "cardNo",
        key: "cardNo",
        align: "center",
        width: 80, 
    },
    {
        title: "卡片类型",
        dataIndex: "cardType",
        key: "cardType",
        align: "center",
        width: 100, 
				render: (cardType: string) => (
					cardType === "PrePaid" ? "预充卡" : "共享卡"
			)
    },
    {
        title: "申请ID",
        dataIndex: "key",
        key: "key",
        align: "center",
        width: 100, // Fixed width in pixels
    },
    {
        title: "开卡时间",
        dataIndex: "createCardTime",
        key: "createCardTime",
        align: "center",
        width: 120, 
				defaultSortOrder: "descend",
				sorter: (a: any, b: any) => {
					const dateA = new Date(a.createCardTime).getTime();
					const dateB = new Date(b.createCardTime).getTime();
					return dateA - dateB;
				}
    },
    {
        title: "卡片名称",
        dataIndex: "cardName",
        key: "cardName",
        align: "center",
        width: 150, // Fixed width in pixels
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
        width: 200, // Fixed width in pixels
    }
];

	const transactionColumns: any[] = [
		{
			title: "时间",
			dataIndex: "authTime",
			key: "authTime",
			align: "center"
		},
		{
			title: "授权ID",
			dataIndex: "authNum",
			key: "authNum",
			align: "center"
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
			dataIndex: "shopName",
			key: "shopName",
			align: "center"
		},
		{
			title: "支付状态",
			dataIndex: "authStatus",
			key: "authStatus",
			align: "center"
		},
		{
			title: "交易币种",
			dataIndex: "tradeCurrency",
			key: "tradeCurrency",
			align: "center"
		},
		{
			title: "原币种",
			dataIndex: "tradeCurrency",
			key: "tradeCurrency",
			align: "center"
		},
		{
			title: "金额",
			dataIndex: "tradeCurrency",
			key: "tradeCurrency",
			align: "center"
		},
		{
			title: "交易金额",
			dataIndex: "tradeAmount",
			key: "tradeAmount",
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
			dataIndex: "authNum",
			key: "authNum",
			align: "center"
		}
	];
	const [columns, setColumns] = useState(transactionColumns);
	const [selectedTimeRange, setSelectedTimeRange] = useState<any[]>([]);
	const [cardNoSearch, setCardNoSearch] = useState("");

	const handleTimeChange = (dates: any) => {
		setSelectedTimeRange(dates ? [dates[0].valueOf(), dates[1].valueOf()] : []);
	};

	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
	};

	const changeTradeType = (type: any) => {
		setTradeType(type);
		if (type == "create") {
			setColumns(createColumns);
		}
		if (type == "auth") {
			setColumns(transactionColumns);
		}
	};

	const applyFilters = () => {
		let filtered = [...dataSource];
		console.log("filter"+ filtered)

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
					<img src={filter} alt="" className="filterIcon" />
					{tradeType === "auth" ? (
						<Space>
							<RangePicker onChange={handleTimeChange} style={{ width: 250 }} />
							<Select
								placeholder="卡片类型"
								mode="multiple"
								allowClear
								style={{ width: 120 }}
								onChange={handleChange}
								options={[
									{ value: "prepaid", label: "预充卡" },
									{ value: "share", label: "共享卡" }
								]}
								className="transactionType"
							/>
							<Select
								placeholder="商户名称"
								mode="multiple"
								allowClear
								style={{ width: 120 }}
								onChange={handleChange}
								options={[
									{ value: "Meta", label: "Meta" },
									{ value: "Amazon", label: "Amazon" }
								]}
								className="transactionType"
							/>
							<Select
								placeholder="支付状态"
								mode="multiple"
								allowClear
								style={{ width: 120 }}
								onChange={handleChange}
								options={[
									{ value: "auth", label: "已授权" },
									{ value: "settled", label: "已结算" },
									{ value: "fail", label: "失败" }
								]}
								className="transactionType"
							/>
							<Select
								placeholder="交易币种"
								mode="multiple"
								allowClear
								style={{ width: 120 }}
								onChange={handleChange}
								options={[{ value: "USD", label: "USD" }]}
								className="transactionType"
							/>
							<Input
								placeholder={cardData.cardNo || "请输入卡号"} // Provide a default placeholder
								style={{ width: 200 }}
								onChange={(e: any) => setCardNoSearch(e.target.value)}
							/>
							<Button type="primary">查询</Button>
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
									{ value: "prepaid", label: "预充卡" },
									{ value: "share", label: "共享卡" }
								]}
								className="transactionType"
							/>
							<Button type="primary" onClick={applyFilters}>查询</Button>
						</Space>
					)}
				</div>
				<Button type="primary" onClick={getCSV}>
					导出账单明细
				</Button>
			</div>
			{tradeType === "auth" ?<div> </div>:
			<Table bordered={true} dataSource={filteredData} columns={columns} pagination={{ pageSize: 10, showSizeChanger: false }}  />}
		</div>
	);
};

export default TradeQuery;
