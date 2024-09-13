import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space } from "antd";
import useAuthButtons from "@/hooks/useAuthButtons";
import { Select } from "antd";
// import { UserTransactionApi } from "@/api/modules/transactions";
// import { HOME_URL } from "@/config/config";
// import { useNavigate, NavLink } from "react-router-dom";
// import { NavLink } from "react-router-dom";
import filter from "@/assets/images/filter.png";
import "./index.less";
// import {UserTransactionApi} from "@/api/modules/transactions"

// const FetchTransactionInformation = async () =>{
// 	const response = await UserTransactionApi();
// 	console.log(response);
// }

const TradeQuery = () => {
	// const createOptions = [
	// 	{ value: "cardNum", label: "卡号" },
	// 	{ value: "cardType", label: "卡片类型" },
	// 	{ value: "applyId", label: "申请ID" },
	// 	{ value: "createTime", label: "开卡时间" },
	// 	{ value: "cardName", label: "卡片名称" },
	// 	{ value: "cardGroup", label: "卡组" }
	// ];
	// const authOptions = [
	// 	{ value: "authTime", label: "时间" },
	// 	{ value: "authNum", label: "单号" },
	// 	{ value: "cardNum", label: "卡号" },
	// 	{ value: "cardType", label: "卡片类型" },
	// 	{ value: "shopName", label: "商户名称" },
	// 	{ value: "authStatus", label: "支付状态" },
	// 	{ value: "tradeCurrency", label: "交易币种" },
	// 	{ value: "tradeAmount", label: "交易金额" },
	// 	{ value: "wrongReason", label: "失败原因" }
	// ];

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

	const transactionColumns: any[] = [
		{
			title: "时间",
			dataIndex: "authTime",
			key: "authTime",
			align: "center"
		},
		{
			title: "单号",
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
		}
	];

	// 按钮权限
	const { BUTTONS } = useAuthButtons();
	const { RangePicker } = DatePicker;
	// const navigate = useNavigate();
	const [tradeType, setTradeType] = useState("create");
	// const [options, setOptions] = useState(createOptions);
	// const [defaultOptions, setDefaultOptions] = useState("cardNum");
	const [columns, setColumns] = useState(createColumns);

	useEffect(() => {
		console.log(BUTTONS);
	}, []);

	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
	};

	const changeTradeType = (type: any) => {
		setTradeType(type);
		if (type == "create") {
			// setOptions(createOptions);
			// setDefaultOptions("cardNum");
			setColumns(createColumns);
		}
		if (type == "auth") {
			// setOptions(authOptions);
			// setDefaultOptions("authTime");
			setColumns(transactionColumns);
		}
	};
	const dataSource: any = [];

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
					消费明细
				</div>
			</div>

			<div className="actionWrap">
				<div>
					<img src={filter} alt="" className="filterIcon" />
					{tradeType === "auth" ? (
						<Space>
							<RangePicker />
							<Select
								placeholder="卡片类型"
								mode="multiple"
								allowClear
								style={{ width: 120 }}
								onChange={handleChange}
								options={[
									{ value: "prepaid", label: "预付卡" },
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
							<Button type="primary">查询</Button>
						</Space>
					) : (
						<Space>
							<RangePicker />
							<Select
								placeholder="卡片类型"
								mode="multiple"
								allowClear
								style={{ width: 120 }}
								onChange={handleChange}
								options={[
									{ value: "prepaid", label: "预付卡" },
									{ value: "share", label: "共享卡" }
								]}
								className="transactionType"
							/>
							<Select
								placeholder="卡组"
								mode="multiple"
								allowClear
								style={{ width: 120 }}
								onChange={handleChange}
								options={[
									{ value: "visa", label: "visa" },
									{ value: "masterCard", label: "masterCard" }
								]}
								className="transactionType"
							/>
							<Button type="primary">查询</Button>
						</Space>
					)}
				</div>
				<Button type="primary">导出账单明细</Button>
			</div>
			<Table bordered={true} dataSource={dataSource} columns={columns} />
		</div>
	);
};

export default TradeQuery;
