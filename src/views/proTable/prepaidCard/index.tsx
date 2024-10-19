import { useEffect, useState } from "react";
import { AccountApi } from "@/api/modules/user";
import { Table, Button, Space, DatePicker, Select, message, Tooltip, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import accountBanlance from "@/assets/images/accountbanlace.png";
// import accountextra from "@/assets/images/accountextra.png";
import canuse from "@/assets/images/canuse.png";
import "./index.less";
import { UserCardApi } from "@/api/modules/prepaid";
import { GetBalanceApi } from "@/api/modules/ledger";
import { CardbinApi } from "@/api/modules/card";

interface BinData {
	bin: string;
	network?: string;
	orgCompanyId?: string;
}

const Auth = localStorage.getItem("username");

console.log("AUTH IS " + Auth);
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
	banlance: number;
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
	// State to hold the card data
	const [dataSource, setDataSource] = useState<FormattedCard[]>([]);
	const [filteredData, setFilteredData] = useState<FormattedCard[]>([]);
	const [bins, setbins] = useState<BinData[]>([]);

	const [accountBalance, setAccountBalance] = useState(0);

	const [selectedTimeRange, setSelectedTimeRange] = useState<any[]>([]);
	const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
	const [cardNameSearch, setCardNameSearch] = useState("");
	const [cardOwnerSearch, setCardOwnerSearch] = useState("");
	const [cardNoSearch, setCardNoSearch] = useState("");

	const navigate = useNavigate();
	const { RangePicker } = DatePicker;
	const [totalCardNumber, setTotalCardNumber] = useState<number | null>(null);
	const userInformation = async (): Promise<number> => {
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
			setTotalCardNumber(formattedData.maximumCardsAllowed);
			return formattedData.maximumCardsAllowed; // Return the value
		} catch (error) {
			console.log("Error fetching user information: " + error);
			return 0; // Return 0 in case of error
		}
	};

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
	const fetchUserCards = async () => {
		try {
			const maxCards = await userInformation();
			const response = await UserCardApi();
			console.log(response.length);
			const totalcard = maxCards- parseFloat(response.length as string);
			setTotalCardNumber(totalcard);

			if (Array.isArray(response)) {
				const formattedData = response.map(card => ({
					key: card.id,
					cardName: card.alias,
					cardOwner: Auth ? Auth : "NA",
					cardGroup: card.network,
					cardNo: card.number,
					cardStatus: card.status,
					banlance: card.balance,
					createCardTime: formatDate(card.createdAt),
					updateCardTime: formatDate(card.updatedAt),
					cardHolderAddressStreet: card.cardHolderAddressStreet,
					cardHolderAddressCity: card.cardHolderAddressCity,
					cardHolderAddressState: card.cardHolderAddressState,
					cardHolderAddressPostalCode: card.cardHolderAddressPostalCode,
					cardHolderAddressCountry: card.cardHolderAddressPostalCountry,
					partnerIdempotencyKey: card.partnerIdempotencyKey,
					cardHolderName: `${card.cardHolderFirstName ? card.cardHolderFirstName : "FM"} ${
						card.cardHolderLastName ? card.cardHolderLastName : "LM"
					}`
				}));

				console.log(formattedData);

				console.log("final data" + formattedData);
				setDataSource(formattedData);
				setFilteredData(formattedData);
			}
		} catch (error) {
			console.error("Failed to fetch user cards:", error);
		}
	};
	useEffect(() => {
		getCardBin();
		getBalance();
		fetchUserCards();
		console.log(binOptions);
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
				banlance: record.banlance,
				createCardTime: record.createCardTime
			}
		});
	};
	const cashback= (record: FormattedCard) => {
		navigate("/cashback/index", {
			state: {
				key: record.key,
				cardName: record.cardName,
				cardOwner: record.cardOwner,
				cardGroup: record.cardGroup,
				cardNo: record.cardNo,
				cardStatus: record.cardStatus,
				banlance: record.banlance,
				createCardTime: record.createCardTime
			}
		});
	};

	const getBalance = async () => {
		try {
			const response = await GetBalanceApi();
			console.log(response);
			console.log("Full response:", response.currentBalance);
			const balance = response.currentBalance ? parseFloat(parseFloat(response.currentBalance).toFixed(2)) : 0;
			setAccountBalance(balance);
		} catch (error) {
			console.log("Cannot get balance of the account:", error);
		}
	};

	const columns: any[] = [
		{
			title: "卡昵称",
			dataIndex: "cardName",
			key: "cardName",
			align: "center",
			width: "40px", // Fixed width for this column
			render: (cardName: string) => (
				<Tooltip title={cardName.length > 17 ? cardName : ""}>
					{cardName.length > 17 ? `${cardName.substring(0, 17)}...` : cardName}
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
				<Tooltip title={cardHolderName.length > 17 ? cardHolderName : ""}>
					{cardHolderName.length > 17 ? `${cardHolderName.substring(0, 17)}...` : cardHolderName}
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
			dataIndex: "banlance",
			key: "banlance",
			align: "center",
			width: "30px",
			sorter: (a: any, b: any) => a.banlance - b.banlance,
			render: (banlance: string) => `$${banlance}`
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
		console.log("navigation: " + record.key);
		navigate("/detail/index", {
			state: {
				key: record.key,
				cardName: record.cardName,
				cardOwner: Auth ? Auth : "NA",
				cardGroup: record.cardGroup,
				cardNo: record.cardNo,
				cardStatus: record.cardStatus,
				updatecardTime: record.updateCardTime,
				banlance: record.banlance,
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
		console.log(record);
		if (record.cardStatus === "Closed") {
			// Display error message and prevent editing
			message.error("无法充值已注销的卡片");
			return;
		}
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
				banlance: record.banlance,
				createCardTime: record.createCardTime
			}
		});
	};
	const applyFilters = () => {
		let filtered = [...dataSource];

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
		if (selectedGroups.length > 0) {
			filtered = filtered.filter(card => selectedGroups.includes(card.cardNo.slice(0, 6)));
		}

		// Apply card status filter
		if (selectedStatuses.length > 0) {
			filtered = filtered.filter(card => selectedStatuses.includes(card.cardStatus));
		}

		if (cardNameSearch) {
			filtered = filtered.filter(card => card.cardName.toLowerCase().includes(cardNameSearch.toLowerCase()));
		}
		if (cardOwnerSearch) {
			filtered = filtered.filter(card => card.cardHolderName.toLowerCase().includes(cardOwnerSearch.toLowerCase()));
		}
		if (cardNoSearch) {
			filtered = filtered.filter(card => card.cardNo.slice(-4).includes(cardNoSearch));
		}

		setFilteredData(filtered);
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
					<div className="banlanceWrap">
						<span className="pre">沃易卡账户余额</span>
						<div className="amountWrap">
							<img src={accountBanlance} className="accountIcons" alt="沃易卡账户余额" />
							<span className="amount">${accountBalance}</span>
						</div>
					</div>

					<div className="banlanceWrap">
						<span className="pre">剩余可用开卡数</span>
						<div className="amountWrap">
							<img src={canuse} className="accountIcons" alt="剩余可用开卡数" />
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
									onChange={(e: any) => setCardNameSearch(e.target.value)}
									style={{ width: 250 }}
								/>
								<Input
									placeholder="搜索持卡人"
									value={cardOwnerSearch}
									onChange={(e: any) => setCardOwnerSearch(e.target.value)}
									style={{ width: 250 }}
								/>
								<Input
									placeholder="搜索卡号后四位"
									value={cardNoSearch}
									onChange={(e: any) => setCardNoSearch(e.target.value)}
									style={{ width: 250 }}
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
					pagination={{ pageSize: 10, showSizeChanger: false }}
				/>
			</div>
		</div>
	);
};

export default PrepaidCard;
