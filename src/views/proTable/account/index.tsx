import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
import { Select } from "antd";
// import {TransactionDetail} from "@/api/interface"
// import { HOME_URL } from "@/config/config";
// import { useNavigate, NavLink } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./index.less";
import { UserTransfersApi } from "@/api/modules/ledger";

const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

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
	// 按钮权限
	const { RangePicker } = DatePicker;
	const [dataSource, setDataSource] = useState<FormattedTransaction[]>([]);
	const [totalAmount, setTotalAmount] = useState(0);

	useEffect(() => {

		const fetchData = async () => {
			try {
				const response = await UserTransfersApi();
					if (Array.isArray(response)) {
						// 格式化每个交易
						const formattedData = response.map((transaction) => ({
							key: transaction.id,
							transactionType: transaction.type, 
							dynamicAccountType: transaction.origin || 'N/A', 
							amount: transaction.amount, 
							currency: "USD", 
							time: formatDate(transaction.processedAt), 
							transactionDetail: transaction.externalId 
						}));
					
						setDataSource(formattedData);
					
						const total = formattedData.reduce((sum, transaction) => {
							return sum + (parseFloat(transaction.amount) || 0);
						}, 0);

						setTotalAmount(total);
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
			title: "动帐类型",
			dataIndex: "dynamicAccountType",
			key: "dynamicAccountType",
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
	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
	};
	// const goToCharge = () => {
	// 	navigate("/proTable/account/recharge/index");
	// };
	return (
		<div className="card content-box accountWrap">
			<div className="accountInfo">
				<div className="accountBlanceWrap">
					<span className="pre">沃易卡账户余额</span>
					<span className="amount">$ {totalAmount}</span>
				</div>
				{/* <Button onClick={goToCharge}>充值</Button> */}
				<Button>
					<NavLink to="/recharge/index">充值</NavLink>
				</Button>
			</div>
			<div className="actionWrap">
				<div>
					<span className="title">动帐明细</span>
					<Space>
						<RangePicker />
						<Select
							defaultValue="transactionType"
							style={{ width: 120 }}
							onChange={handleChange}
							options={[
								{ value: "transactionType", label: "交易类型" },
								{ value: "dynamicAccountType", label: "动帐类型" },
								{ value: "amount", label: "金额" },
								{ value: "currency", label: "币种" },
								{ value: "time", label: "时间" },
								{ value: "transactionDetail", label: "交易明细" }
							]}
						/>
					</Space>
				</div>
				<Button type="primary">导出账单明细</Button>
			</div>
			{/* <div className="auth">
				<Space>
					{BUTTONS.add && <Button type="primary">我是 Admin && User 能看到的按钮</Button>}
					{BUTTONS.delete && <Button type="primary">我是 Admin 能看到的按钮</Button>}
					{BUTTONS.edit && <Button type="primary">我是 User 能看到的按钮</Button>}
				</Space>
			</div> */}
			<Table bordered={true} dataSource={dataSource} columns={columns} />
		</div>
	);
};

export default Account;
