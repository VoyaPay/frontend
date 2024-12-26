import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Button, Modal, message, InputNumber } from "antd";
import bankcard from "@/assets/images/bluecardwithshadow.png";
import "./index.less";
import { RechargeCardApi } from "@/api/modules/prepaid";
import { GetBalanceApi } from "@/api/modules/ledger";

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
const cashback = () => {
	const location = useLocation();
	const defaultCardData: CardData = {
		key: "",
		cardName: "defaultCardName",
		cardOwner: "defaultOwner",
		cardGroup: "defaultGroup",
		cardNo: "0000",
		cardStatus: "defaultStatus",
		balance: "0",
		createCardTime: "2023-01-01 00:00:00"
	};
	const cardData = (location.state as CardData) ?? defaultCardData;
	const [amount, setAmount] = useState(0);
	const recharge = () => {
		setOpen(true);
	};
	const changeAmount = (value: number) => {
		if (value === undefined || /^\d+(\.\d{0,2})?$/.test(value.toString())) {
			if (value > parseFloat(cardData.balance)) {
				message.error("该预充卡余额不足");
				return;
			}
			setAmount(value);
		} else {
			message.error("请输入有效的金额，最多两位小数");
		}
	};

	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [accountBalance, setAccountBalance] = useState(0);

	const handleOk = async () => {
		try {
			setConfirmLoading(true);
			const response = await RechargeCardApi(cardData.key, { amount: -amount });

			// 检查是否成功并给出提示
			if (response.id) {
				message.success("提现成功 !"); // 成功消息
			}

			setOpen(false);
			setConfirmLoading(false);
		} catch (error: any) {
			// 检查错误类型并给出提示
			if (error.response && error.response.data) {
				const errorMessage = error.response.data.message;
				if (errorMessage === "Insufficient balance") {
					message.error("沃易卡账户余额不足"); // 显示余额不足错误
				} else if (Array.isArray(errorMessage) && errorMessage.includes("amount must be a positive number")) {
					message.error("金额必须是正数， 请重新输入"); // 显示无效金额错误
				} else {
					message.error("其他错误"); // 其他错误的提示
				}
			} else {
				message.error("An unknown error occurred. Please try again later.");
			}
			setConfirmLoading(false);
			setOpen(false);
		}
	};
	useEffect(() => {
		const getBalance = async () => {
			try {
				const response = await GetBalanceApi();
				const balance = response.currentBalance ? parseFloat(parseFloat(response.currentBalance).toFixed(2)) : 0;
				setAccountBalance(balance);
			} catch (error) {
				console.log("Cannot get balance of the account:", error);
			}
		};
		getBalance();
	}, []);
	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<div className="prepaidRecharge-wrap">
			<Modal title="充值" visible={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
				<p>提现金额 ${amount}，继续提现？</p>
			</Modal>
			<div className="contentWrap">
				<div className="basicInfo">
					<div className="content">
						<div className="pre">待提现预充卡：</div>
						<div className="text">{cardData.cardName}</div>
						<div className="text">&nbsp;{"  ( " + cardData.cardNo + " )"}</div>
						<div className="text">&nbsp;{" ( 卡余额： $ " + cardData.balance + " )"}</div>
					</div>
					<div className="content">
						<div className="pre">接收账户：</div>
						<div className="text">沃易卡账户</div>
						<div className="text">&nbsp;&nbsp;{" $" + accountBalance}</div>
					</div>

					<div className="content">
						<div className="pre">提现金额:</div>
						<div className="input-wrapper">
							<InputNumber
								value={amount || undefined}
								onChange={changeAmount}
								className="edit"
								placeholder="0"
								addonBefore="$"
								min={0}
								step={0.01}
								controls={false}
							/>
							<div className="input-tips">注意：提现金额不能大于该预充卡余额</div>
						</div>
					</div>
					<div className="btns">
						<Button type="primary" className="actionBtn" onClick={recharge} style={{ marginRight: "20px" }}>
							立刻提现
						</Button>
						<Button type="primary" className="actionBtn">
							<NavLink to="/prepaidCard" className="myAccount">
								返回
							</NavLink>
						</Button>
					</div>
				</div>
				<div className="right">
					<img src={bankcard} alt="" className="bankCard" />
				</div>
			</div>
		</div>
	);
};

export default cashback;
