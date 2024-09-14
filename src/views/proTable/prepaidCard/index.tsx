import { useEffect, useState } from "react";

import { Table, Button, Space, DatePicker, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import accountBanlance from "@/assets/images/accountbanlace.png";
import accountextra from "@/assets/images/accountextra.png";
import canuse from "@/assets/images/canuse.png";
import "./index.less";
import { UserCardApi } from "@/api/modules/prepaid";
import { GetBalanceApi } from "@/api/modules/ledger";

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

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
const PrepaidCard = () => {
	// State to hold the card data
	const [dataSource, setDataSource] = useState<FormattedCard[]>([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [totalCardNumber, setTotalCardNumber] = useState(100);
	const [accountBalance, setAccountBalance] = useState(0);

	const navigate = useNavigate();
	const { RangePicker } = DatePicker;

	// Fetch data from the API on component mount
	useEffect(() => {
		const fetchUserCards = async () => {
			try {
				const response = await UserCardApi();
				console.log(response);
				if (Array.isArray(response)) {
					const formattedData = response.map(card => ({
						key: card.id,
						cardName: card.type,
						cardOwner: card.alias,
						cardGroup: card.network,
						cardNo: card.last4,
						cardStatus: card.status,
						banlance: card.initialLimit, // Replace with actual balance if available
						createCardTime: formatDate(card.updatedAt)
					}));

					const total = formattedData.reduce((sum, transaction) => sum + (parseFloat(transaction.banlance) || 0), 0);
					const totalcard = 100 - formattedData.length;
					console.log(total);
					setTotalCardNumber(totalcard);
					setDataSource(formattedData); // Adjust based on your API response structure
					setTotalAmount(total);
				}
			} catch (error) {
				console.error("Failed to fetch user cards:", error);
			}
		};

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
		fetchUserCards();
	}, []);

	const columns: any[] = [
		{
			title: "卡昵称",
			dataIndex: "cardName",
			key: "cardName",
			align: "center",
			width: 100
		},
		{
			title: "持卡人",
			dataIndex: "cardOwner",
			key: "cardOwner",
			align: "center",
			width: 120
		},
		{
			title: "卡组",
			dataIndex: "cardGroup",
			key: "cardGroup",
			align: "center",
			width: 80
		},
		{
			title: "卡号",
			dataIndex: "cardNo",
			key: "cardNo",
			align: "center",
			width: 120
		},
		{
			title: "状态",
			dataIndex: "cardStatus",
			key: "cardStatus",
			align: "center",
			width: 80
		},
		{
			title: "余额",
			dataIndex: "banlance",
			key: "banlance",
			align: "center",
			width: 120,
			defaultSortOrder: "descend",
			sorter: (a: any, b: any) => a.banlance - b.banlance
		},
		{
			title: "开卡时间",
			dataIndex: "createCardTime",
			key: "createCardTime",
			align: "center",
			width: 160,
			defaultSortOrder: "descend",
			sorter: (a: any, b: any) => a.createCardTime - b.createCardTime
		},
		{
			title: "操作",
			dataIndex: "transactionDetail",
			key: "transactionDetail",
			align: "center",
			width: 160,
			render: (text: string, record: FormattedCard) => (
				<Space>
					<Button type="link" size="small" onClick={() => handleViewDetails(record)}>
						查看详情
					</Button>
					<Button type="link" size="small" onClick={() => handlerRechargeDetails(record)}>
						充值
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
				cardOwner: record.cardOwner,
				cardGroup: record.cardGroup,
				cardNo: record.cardNo,
				cardStatus: record.cardStatus,
				banlance: record.banlance,
				createCardTime: record.createCardTime
			}
		});
	};
	const handlerRechargeDetails = (record: FormattedCard) => {
		console.log("navigation: " + record.key);
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

	const handleChange = e => {
		console.log(e);
	};

	return (
		<div className="card content-box">
			<div className="prepaidCardInfo">
				<div className="banlanceWrap">
					<span className="pre">沃易卡账户余额</span>
					<div className="amountWrap">
						<img src={accountBanlance} className="accountIcons" />
						<span className="amount">${accountBalance}</span>
					</div>
				</div>
				<div className="banlanceWrap">
					<span className="pre">预付卡内总余额</span>
					<div className="amountWrap">
						<img src={accountextra} className="accountIcons" />
						<span className="amount">${totalAmount}</span>
					</div>
				</div>
				<div className="banlanceWrap">
					<span className="pre">剩余可用开卡数</span>
					<div className="amountWrap">
						<img src={canuse} className="accountIcons" />
						<span className="amount">{totalCardNumber}</span>
					</div>
				</div>
			</div>
			<div className="actionWrap">
				<div className="left">
					<span className="title">预充卡</span>
					<Space>
						<RangePicker />
						<Select
							placeholder="请选择卡组"
							mode="multiple"
							allowClear
							style={{ width: 150 }}
							onChange={handleChange}
							options={[{ value: "VISA", label: "VISA" }]}
						/>
						<Select
							placeholder="请选择状态"
							mode="multiple"
							allowClear
							style={{ width: 150 }}
							onChange={handleChange}
							options={[
								{ value: "Active", label: "Active" },
								{ value: "Inactive", label: "Inactive" }
							]}
						/>
						<Button type="primary">查询</Button>
					</Space>
				</div>
				<Button type="primary" icon={<PlusOutlined />}>
					<NavLink to="/addPrepaidCard/index" className="addPrepaidCard">
						新增预付卡
					</NavLink>
				</Button>
			</div>
			<Table bordered={true} dataSource={dataSource} columns={columns} />
		</div>
	);
};

export default PrepaidCard;
