import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space } from "antd";
import useAuthButtons from "@/hooks/useAuthButtons";
import { Select } from "antd";
// import { HOME_URL } from "@/config/config";
// import { useNavigate, NavLink } from "react-router-dom";
// import { NavLink } from "react-router-dom";
import filter from "@/assets/images/filter.png";
import "./index.less";

const TradeQuery = () => {
	const createOptions = [
		{ value: "cardNum", label: "卡号" },
		{ value: "cardType", label: "卡片类型" },
		{ value: "applyId", label: "申请ID" },
		{ value: "createTime", label: "开卡时间" },
		{ value: "cardName", label: "卡片名称" },
		{ value: "cardGroup", label: "卡组" }
	];
	const authOptions = [
		{ value: "authTime", label: "授权时间" },
		{ value: "authNum", label: "授权单号" },
		{ value: "cardNum", label: "卡号" },
		{ value: "cardType", label: "卡片类型" },
		{ value: "shopName", label: "商户名称" },
		{ value: "authStatus", label: "授权状态" },
		{ value: "tradeCurrency", label: "交易币种" },
		{ value: "tradeAmount", label: "交易金额" }
	];
	const settleOptions = [
		{ value: "settleTime", label: "结算时间" },
		{ value: "settleNum", label: "结算单号" },
		{ value: "cardNum", label: "卡号" },
		{ value: "cardType", label: "卡片类型" },
		{ value: "shopName", label: "商户名称" },
		{ value: "entryCurrency", label: "入账币种" },
		{ value: "settleAmount", label: "结算金额" }
	];

	const createColumns: any[] = [
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
			title: "申请ID",
			dataIndex: "applyId",
			key: "applyId",
			align: "center"
		},
		{
			title: "开卡时间",
			dataIndex: "createTime",
			key: "createTime",
			align: "center"
		},
		{
			title: "卡片名称",
			dataIndex: "cardName",
			key: "cardName",
			align: "center"
		},
		{
			title: "卡组",
			dataIndex: "cardGroup",
			key: "cardGroup",
			align: "center"
		}
	];

	const createDataSource = [
		{
			cardNum: "12345****66666",
			cardType: "预付卡",
			applyId: "4444555555",
			createTime: "2024/06/02 16：00",
			cardName: "广告1",
			cardGroup: "visa"
		},
		{
			cardNum: "12345****66666",
			cardType: "预付卡",
			applyId: "4444555555",
			createTime: "2024/06/02 16：00",
			cardName: "广告1",
			cardGroup: "visa"
		},
		{
			cardNum: "12345****66666",
			cardType: "预付卡",
			applyId: "4444555555",
			createTime: "2024/06/02 16：00",
			cardName: "广告1",
			cardGroup: "visa"
		}
	];

	const authColumns: any[] = [
		{
			title: "授权时间",
			dataIndex: "authTime",
			key: "authTime",
			align: "center"
		},
		{
			title: "授权单号",
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
			title: "授权状态",
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
			title: "交易金额",
			dataIndex: "tradeAmount",
			key: "tradeAmount",
			align: "center"
		}
	];

	const authDataSource = [
		{
			cardNum: "12345****66666",
			cardType: "预付卡",
			authTime: "2024/06/02 16：00",
			authNum: "5656565656565",
			shopName: "meta",
			authStatus: "成功",
			tradeCurrency: "USD",
			tradeAmount: "10.0"
		},
		{
			cardNum: "12345****66666",
			cardType: "预付卡",
			authTime: "2024/06/02 16：00",
			authNum: "5656565656565",
			shopName: "meta",
			authStatus: "成功",
			tradeCurrency: "USD",
			tradeAmount: "10.0"
		},
		{
			cardNum: "12345****66666",
			cardType: "预付卡",
			authTime: "2024/06/02 16：00",
			authNum: "5656565656565",
			shopName: "meta",
			authStatus: "成功",
			tradeCurrency: "USD",
			tradeAmount: "10.0"
		}
	];

	const settleColumns: any[] = [
		{
			title: "结算时间",
			dataIndex: "settleTime",
			key: "authTime",
			align: "center"
		},
		{
			title: "结算单号",
			dataIndex: "settleNum",
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
			title: "入账币种",
			dataIndex: "entryCurrency",
			key: "entryCurrency",
			align: "center"
		},
		{
			title: "结算金额",
			dataIndex: "settleAmount",
			key: "settleAmount",
			align: "center"
		}
	];

	const settleDataSource = [
		{
			cardNum: "12345****66666",
			cardType: "预付卡",
			settleTime: "2024/06/02 16：00",
			settleNum: "5656565656565",
			shopName: "meta",
			entryCurrency: "USD",
			settleAmount: "10.0"
		},
		{
			cardNum: "12345****66666",
			cardType: "预付卡",
			settleTime: "2024/06/02 16：00",
			settleNum: "5656565656565",
			shopName: "meta",
			entryCurrency: "USD",
			settleAmount: "10.0"
		},
		{
			cardNum: "12345****66666",
			cardType: "预付卡",
			settleTime: "2024/06/02 16：00",
			settleNum: "5656565656565",
			shopName: "meta",
			entryCurrency: "USD",
			settleAmount: "10.0"
		}
	];

	// 按钮权限
	const { BUTTONS } = useAuthButtons();
	const { RangePicker } = DatePicker;
	// const navigate = useNavigate();
	const [tradeType, setTradeType] = useState("create");
	const [options, setOptions] = useState(createOptions);
	const [defaultOptions, setDefaultOptions] = useState("cardNum");
	const [columns, setColumns] = useState(createColumns);
	const [dataSource, setDataSource] = useState(createDataSource);

	useEffect(() => {
		console.log(BUTTONS);
	}, []);

	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
	};

	const changeTradeType = (type: any) => {
		setTradeType(type);
		if (type == "create") {
			setOptions(createOptions);
			setDefaultOptions("cardNum");
			setColumns(createColumns);
			setDataSource(createDataSource);
		}
		if (type == "auth") {
			setOptions(authOptions);
			setDefaultOptions("authTime");
			setColumns(authColumns);
			setDataSource(authDataSource);
		}
		if (type == "settle") {
			setOptions(settleOptions);
			setDefaultOptions("settleTime");
			setColumns(settleColumns);
			setDataSource(settleDataSource);
		}
	};

	return (
		<div className="card content-box tradeQueryWrap">
			<div className="tradeQueryTitle">交易查询</div>
			<div className="tradeTypeWrap">
				<div
					className={tradeType == "create" ? "tradeType selected" : "tradeType"}
					onClick={() => {
						changeTradeType("create");
					}}
				>
					开卡明细
				</div>
				<div
					className={tradeType == "auth" ? "tradeType selected" : "tradeType"}
					onClick={() => {
						changeTradeType("auth");
					}}
				>
					授权明细
				</div>
				<div
					className={tradeType == "settle" ? "tradeType selected" : "tradeType"}
					onClick={() => {
						changeTradeType("settle");
					}}
				>
					结算明细
				</div>
			</div>
			{/* <div className="accountInfo">
				<div className="accountBlanceWrap">
					<span className="pre">沃易卡账户余额</span>
					<span className="amount">$ 100.0</span>
				</div>
				<Button>
					<NavLink to="/recharge/index">充值</NavLink>
				</Button>
			</div> */}
			<div className="actionWrap">
				<div>
					<img src={filter} alt="" className="filterIcon" />
					<Space>
						<RangePicker />
						<Select defaultValue={defaultOptions} style={{ width: 120 }} onChange={handleChange} options={options} />
					</Space>
				</div>
				<Button type="primary">导出账单明细</Button>
			</div>
			<Table bordered={true} dataSource={dataSource} columns={columns} />
		</div>
	);
};

export default TradeQuery;
