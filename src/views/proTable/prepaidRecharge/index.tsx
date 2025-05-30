import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
const PrepaidRecharge = () => {
	const navigate = useNavigate();
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
	const [amount, setAmount] = useState<number | undefined>(undefined);

	useEffect(() => {
		getBalance();
	}, []);

	const recharge = () => {
		setOpen(true);
	};
	const changeAmount = (value: number) => {
		if (value === undefined || /^\d+(\.\d{0,2})?$/.test(value.toString())) {
			if (value > accountBalance) {
				message.error("沃易卡账户余额不足");
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
			const response = await RechargeCardApi(cardData.key, { amount: amount });
			if (response.card) {
				message.success("充值成功!");
				navigate("/prepaidCard/detail", {
					state: {
						key: cardData.key,
						cardName: cardData.cardName,
						cardOwner: cardData.cardOwner,
						cardGroup: cardData.cardGroup,
						cardNo: cardData.cardNo,
						cardStatus: cardData.cardStatus,
						balance: cardData.balance,
						createCardTime: cardData.createCardTime
					},
					replace: true
				});
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

	const getBalance = () => {
		GetBalanceApi().then(res => {
			const balance = res.currentBalance ? parseFloat(parseFloat(res.currentBalance).toFixed(2)) : 0;
			setAccountBalance(balance);
		});
	};
	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<div className="prepaidRecharge-wrap">
			<Modal title="充值" visible={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
				<p>充值金额 ${amount}，继续充值？</p>
			</Modal>
			<div className="contentWrap">
				<div className="basicInfo">
					<div className="content">
						<div className="pre">扣款账户：</div>
						<div className="text">沃易卡账户</div>
						<div className="text">&nbsp;&nbsp;{" $" + accountBalance}</div>
					</div>
					<div className="content">
						<div className="pre">待充值预充卡：</div>
						<div className="text">{cardData.cardName}</div>
						<div className="text">&nbsp;{"  ( " + cardData.cardNo + " )"}</div>
					</div>
					<div className="content">
						<div className="pre">充值金额:</div>
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
							<div className="input-tips">注意：充值金额不能大于沃易卡账户的余额</div>
						</div>
					</div>
					<div className="btns">
						<Button type="primary" className="actionBtn" onClick={recharge}>
							充值
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

export default PrepaidRecharge;
