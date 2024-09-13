import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Input, Button, Modal, message } from "antd";
import back from "@/assets/images/return.png";
import "./index.less";
import { AddCardApi } from "@/api/modules/prepaid";

const AddPrepaidCard = () => {
	const [cardName, setCardName] = useState("masterCard");
	const [cardOwner, setCardOwner] = useState("张三");
	const [amount, setAmount] = useState(0);
	const navigate = useNavigate();

	const changeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardName(e.target.value);
	};

	const changeCardOwner = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardOwner(e.target.value);
	};

	const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(parseInt(e.target.value, 10) || 0);
	};

	const handleSubmit = async () => {
		const payload = {
			type: cardName,
			initialLimit: amount,
			alias: cardOwner
		};

		try {
			const response = await AddCardApi(payload);
			console.log(response);
			const formattedData = {
				card: response.card,
				transaction: response.transaction
			};

			console.log("transaction is " + formattedData.transaction?.status);

			if (response && formattedData.transaction?.status) {
				navigate("/applySuccess/index");
			} else {
				// Show error message
				console.log("failed");
				message.error("卡片申请失败");
			}
		} catch (error) {
			// Handle any errors
			message.error("提交过程中发生错误");
		}
	};

	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	// const apply = () => {
	// 	setOpen(true);
	// };

	const handleOk = () => {
		setConfirmLoading(true);
		setTimeout(() => {
			setOpen(false);
			setConfirmLoading(false);
		}, 2000);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<div className="addPrepaidCard-wrap">
			<Modal title="申请" visible={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
				<p>充值金额XX， 开卡费1USD，总计XX，继续申请？</p>
			</Modal>
			<div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">
					<img src={back} alt="" className="returnIcon" />
					预付卡{" "}
				</NavLink>
				-&gt; 新增预付卡
			</div>
			<div className="contentWrap">
				<div className="title">1.卡产品选择</div>
				<div className="cardWrap">
					<div className="prepaidCard selected">Visa 485643</div>
					<div className="prepaidCard">MasterCard 485643</div>
				</div>
			</div>
			<div className="contentWrap">
				<div className="title">2.自定义卡信息</div>
				<div className="content">
					<div className="pre">
						<span className="require">*</span>卡昵称：
					</div>
					<Input value={cardName} onChange={changeCardName} className="edit" />
				</div>
				<div className="content">
					<div className="pre">持卡人：</div>
					<Input value={cardOwner} onChange={changeCardOwner} className="edit" />
				</div>
				<div className="content">
					<div className="pre">账单地址：</div>
					<div className="text">默认地址，不允许修改</div>
				</div>
			</div>
			<div className="contentWrap">
				<div className="title">2.充值</div>
				<div className="content">
					<div className="pre">扣款账户：</div>
					<div className="text">沃易卡账户&nbsp;&nbsp;&nbsp;&nbsp;$100</div>
				</div>
				<div className="content">
					<div className="pre">充值金额：</div>
					<Input value={amount} onChange={changeAmount} className="edit" />
				</div>
				<div className="content">
					<div className="pre">开卡费：</div>
					<div className="text">1 USD</div>
				</div>
			</div>
			<div className="btns">
				<Button type="primary" className="actionBtn" onClick={handleSubmit}>
					立即申请
				</Button>
				<Button type="text" className="return">
					<NavLink to="/proTable/prepaidCard" className="myAccount">
						返回
					</NavLink>
				</Button>
				<Button type="text" className="return">
					<NavLink to="/applySuccess/index" className="myAccount">
						申请成功
					</NavLink>
				</Button>
			</div>
		</div>
	);
};

export default AddPrepaidCard;
