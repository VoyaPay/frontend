import { useEffect, useState } from "react";
import { Table, Button, Space, DatePicker, Select, message, Tooltip, Input, TablePaginationConfig } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import "./index.less";
import { UserCardApi } from "@/api/modules/prepaid";
import { GetBalanceApi, GetTotalBalanceApi } from "@/api/modules/ledger";
import { CardbinApi } from "@/api/modules/card";
import SvgIcon from "@/components/svgIcon";
import { SorterResult } from "antd/lib/table/interface";
import { store } from "@/redux";

interface BinData {
	bin: string;
	network?: string;
	orgCompanyId?: string;
}

interface TableParams {
	pagination?: TablePaginationConfig;
	sortField?: SorterResult<any>["field"];
	sortOrder?: SorterResult<any>["order"];
}

const Auth = localStorage.getItem("username");

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

const PrepaidCard = () => {
	const [filteredData, setFilteredData] = useState<FormattedCard[]>([]);
	const [bins, setbins] = useState<BinData[]>([]);

	const [accountBalance, setAccountBalance] = useState(0);
	const [totalBalance, setTotalBalance] = useState(0);
	const [selectedTimeRange, setSelectedTimeRange] = useState<any[]>([]);
	const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
	const [cardNameSearch, setCardNameSearch] = useState<string[]>([]);
	const [cardOwnerSearch, setCardOwnerSearch] = useState("");
	const [cardNoSearch, setCardNoSearch] = useState<string[]>([]);
	const iconStyle = { width: "32px", height: "32px", marginTop: "8px", color: "#0D99FF" };

	const navigate = useNavigate();
	const { RangePicker } = DatePicker;
	const [totalCardNumber, setTotalCardNumber] = useState<number>(0);
	const [cardTableParams, setCardTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: 10
		}
	});

	const getCardBin = async () => {
		try {
			const response = await CardbinApi();
			if (Array.isArray(response)) {
				const formattedData = response.map((bins: any) => ({
					bin: bins.bin,
					network: bins.network, // Include other properties if needed
					orgCompanyId: bins.orgCompanyId
				}));
				setbins(formattedData);
			} else {
				console.error("Response is not an array:", response);
			}
		} catch (error) {
			console.error("Error fetching card BINs:", error);
		}
	};
	const binOptions = bins.map(bin => ({
		value: bin.bin,
		label: `${bin.bin}`
	}));
	const fetchUserCards = async (pageNum: number, pageSize: number) => {
		let adjustedStart: number | undefined = undefined;
		let adjustedEnd: number | undefined = undefined;
		if (selectedTimeRange?.length > 0) {
			const [start, end] = selectedTimeRange;
			adjustedStart = new Date(start).setHours(0, 0, 0, 0);
			adjustedEnd = new Date(end).setHours(23, 59, 59, 999);
		}
		try {
			const response = await UserCardApi({
				where: {
					createdAt: {
						min: adjustedStart ?? undefined,
						max: adjustedEnd ?? undefined
					},
					bin: selectedGroups && selectedGroups.length > 0 ? selectedGroups.join(",") : undefined,
					status: selectedStatuses && selectedStatuses.length > 0 ? selectedStatuses : undefined,
					alias: cardNameSearch && cardNameSearch.length > 0 && cardNameSearch[0] !== "" ? cardNameSearch : undefined,
					cardHolderName: cardOwnerSearch ?? undefined,
					last4: cardNoSearch && cardNoSearch.length > 0 && cardNoSearch[0] !== "" ? cardNoSearch : undefined
				},
				pageNum: pageNum ?? 1,
				pageSize: pageSize ?? 10
			});
			processUserCardData(response);
		} catch (error) {
			console.error("Failed to fetch user cards:", error);
		}
	};

	const processUserCardData = (response: any) => {
		const userInfo = store.getState().global.userInfo;
		const maxCards = userInfo.userConfig?.maximumCardsAllowed || 0;
		let remainCardsCountToDisplay;
		if (maxCards === 0) {
			remainCardsCountToDisplay = 99;
		} else {
			remainCardsCountToDisplay = maxCards - (response.total || 0);
			if (remainCardsCountToDisplay < 0) {
				remainCardsCountToDisplay = 0;
			}
		}
		setCardTableParams({
			pagination: {
				...cardTableParams.pagination,
				current: response?.pageNum ?? 1,
				pageSize: response?.pageSize ?? 10,
				total: response?.total ?? 0
			}
		});
		setTotalCardNumber(remainCardsCountToDisplay);

		if (Array.isArray(response?.datalist)) {
			const formattedData = response?.datalist.map((card: any) => ({
				key: card.id || "",
				cardName: card.alias || "",
				cardOwner: Auth ? Auth : "NA",
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
	};
	useEffect(() => {
		getCardBin();
		getBalance();
		fetchUserCards(1, 10);
	}, []);
	const goCheck = (record: FormattedCard) => {
		navigate("/proTable/tradeQuery", {
			state: {
				key: record.key,
				cardName: record.cardName,
				cardOwner: record.cardOwner,
				cardGroup: record.cardGroup,
				cardNo: record.cardNo,
				cardStatus: record.cardStatus,
				balance: record.balance,
				createCardTime: record.createCardTime
			}
		});
	};
	const cashback = (record: FormattedCard) => {
		navigate("/cashback/index", {
			state: {
				key: record.key,
				cardName: record.cardName,
				cardOwner: record.cardOwner,
				cardGroup: record.cardGroup,
				cardNo: record.cardNo,
				cardStatus: record.cardStatus,
				balance: record.balance,
				createCardTime: record.createCardTime
			}
		});
	};

	const getBalance = async () => {
		const [balanceResponse, totalBalanceResponse] = await Promise.all([GetBalanceApi(), GetTotalBalanceApi()]);
		const balance = balanceResponse.currentBalance ? parseFloat(parseFloat(balanceResponse.currentBalance).toFixed(2)) : 0;
		const totalBalance = totalBalanceResponse.totalBalance
			? parseFloat(parseFloat(totalBalanceResponse.totalBalance).toFixed(2))
			: 0;
		setAccountBalance(balance);
		setTotalBalance(totalBalance);
	};

	const columns: any[] = [
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
		},
		{
			title: "操作",
			dataIndex: "transactionDetail",
			key: "transactionDetail",
			align: "center",
			width: "90px",
			render: (text: string, record: FormattedCard) => (
				<Space>
					<Button type="link" size="small" onClick={() => handleViewDetails(record)}>
						查看详情
					</Button>
					<Button type="link" size="small" onClick={() => handlerRechargeDetails(record)}>
						充值
					</Button>
					<Button type="link" size="small" onClick={() => goCheck(record)}>
						消费记录
					</Button>
					<Button type="link" size="small" onClick={() => cashback(record)}>
						提现
					</Button>
				</Space>
			)
		}
	];
	const handleViewDetails = (record: FormattedCard) => {
		navigate("/detail/index", {
			state: {
				key: record.key,
				cardName: record.cardName,
				cardOwner: Auth ? Auth : "NA",
				cardGroup: record.cardGroup,
				cardNo: record.cardNo,
				cardStatus: record.cardStatus,
				updatecardTime: record.updateCardTime,
				balance: record.balance,
				createCardTime: record.createCardTime,
				cardHolderAddressStreet: record.cardHolderAddressStreet,
				cardHolderAddressCity: record.cardHolderAddressCity,
				cardHolderAddressState: record.cardHolderAddressState,
				cardHolderAddressPostalCode: record.cardHolderAddressPostalCode,
				cardHolderAddressCountry: record.cardHolderAddressCountry,
				cardHolderName: record.cardHolderName
			}
		});
	};

	const handlerRechargeDetails = (record: FormattedCard) => {
		if (record.cardStatus === "Invaild") {
			// Display error message and prevent editing
			message.error("无法充值已冻结的卡片");
			return;
		}

		navigate("/prepaidRecharge/index", {
			state: {
				key: record.key,
				cardName: record.cardName,
				cardOwner: record.cardOwner,
				cardGroup: record.cardGroup,
				cardNo: record.cardNo,
				cardStatus: record.cardStatus,
				balance: record.balance,
				createCardTime: record.createCardTime
			}
		});
	};
	const applyFilters = () => {
		setCardTableParams({
			pagination: {
				current: 1,
				pageSize: 10
			}
		});
		fetchUserCards(1, 10);
	};

	const handleTableChange = (pagination: TablePaginationConfig) => {
		setCardTableParams({
			pagination: {
				...cardTableParams.pagination,
				current: pagination.current,
				pageSize: pagination.pageSize
			}
		});
		fetchUserCards(pagination.current ?? 1, pagination.pageSize ?? 10);
	};

	const handleTimeChange = (dates: any) => {
		setSelectedTimeRange(dates ? [dates[0].valueOf(), dates[1].valueOf()] : []);
	};

	const handleGroupChange = (values: string[]) => {
		setSelectedGroups(values);
	};

	const handleStatusChange = (values: string[]) => {
		setSelectedStatuses(values);
	};

	return (
		<div className="newtable">
			<div className="card content-box">
				<div className="prepaidCardInfo">
					<div className="balanceWrap">
						<span className="pre">沃易卡账户余额</span>
						<div className="amountWrap">
							<SvgIcon name="account_balance" iconStyle={iconStyle} />
							<span className="amount">${accountBalance}</span>
						</div>
					</div>
					<div className="balanceWrap">
						<span className="pre">卡内总余额</span>
						<div className="amountWrap">
							<SvgIcon name="total_balance" iconStyle={iconStyle} />
							<span className="amount">${totalBalance}</span>
						</div>
					</div>
					<div className="balanceWrap">
						<span className="pre">剩余可用开卡数</span>
						<div className="amountWrap">
							<SvgIcon name="cards_to_apply" iconStyle={iconStyle} />
							<span className="amount">{totalCardNumber}</span>
						</div>
					</div>

					<div className="buttonWrap">
						<Button type="primary" icon={<PlusOutlined />} style={{ width: 150 }}>
							<NavLink to="/addPrepaidCard/index" className="addPrepaidCard">
								新增预充卡
							</NavLink>
						</Button>
					</div>
				</div>
			</div>

			<div className="card content-box">
				<div className="search" style={{ marginBottom: 10 }}>
					<div className="actionWrap">
						<div className="left">
							<span className="title">预充卡</span>
							<Space>
								<RangePicker onChange={handleTimeChange} style={{ width: 250 }} />
								<Select
									placeholder="请选择卡bin"
									mode="multiple"
									allowClear
									style={{ width: 250 }}
									onChange={handleGroupChange}
									options={binOptions}
								/>
								<Select
									placeholder="请选择状态"
									mode="multiple"
									allowClear
									style={{ width: 250 }}
									onChange={handleStatusChange}
									options={[
										{ value: "Active", label: "活跃" },
										{ value: "Inactive", label: "已冻结" },
										{ value: "PreClose", label: "待注销" },
										{ value: "Closed", label: "已注销" }
									]}
								/>
							</Space>
						</div>

						<div className="buttonWrap">
							<Button type="primary" onClick={applyFilters} style={{ width: 150, marginRight: "10%" }}>
								查询
							</Button>
						</div>
					</div>

					<div className="actionWrap" style={{ marginBottom: 10, marginLeft: "4em" }}>
						<div className="left">
							<Space>
								<Input
									placeholder="搜索卡昵称"
									value={cardNameSearch}
									onChange={(e: any) => setCardNameSearch([e.target.value])}
									onPressEnter={applyFilters}
									style={{ width: 250 }}
									allowClear
								/>
								<Input
									placeholder="搜索持卡人"
									value={cardOwnerSearch}
									onChange={(e: any) => setCardOwnerSearch(e.target.value)}
									onPressEnter={applyFilters}
									style={{ width: 250 }}
									allowClear
								/>
								<Input
									placeholder="搜索卡号后四位"
									value={cardNoSearch}
									onChange={(e: any) => setCardNoSearch([e.target.value])}
									onPressEnter={applyFilters}
									style={{ width: 250 }}
									allowClear
								/>
							</Space>
						</div>
					</div>
				</div>
				<Table
					style={{ marginBottom: 50 }}
					bordered={true}
					dataSource={filteredData}
					columns={columns}
					tableLayout="fixed"
					scroll={{ x: 1200 }}
					pagination={cardTableParams.pagination}
					onChange={handleTableChange}
				/>
			</div>
		</div>
	);
};

export default PrepaidCard;
