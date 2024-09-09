import { useState } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Input, Button } from "antd";
import bankcard from "@/assets/images/bankcard.png";
import back from "@/assets/images/return.png";
import "./index.less";

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
const PrepaidRecharge = () => {
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
	const [amount, setAmount] = useState(0);

	const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		const valueAsNumber = Number(e.target.value);
		setAmount(valueAsNumber);
	};

	return (
		<div className="prepaidRecharge-wrap">
			<div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">
					<img src={back} alt="" className="returnIcon" />
					预付卡{" "}
				</NavLink>
				-&gt; 充值
			</div>
			<div className="contentWrap">
				<div className="basicInfo">
					<div className="content">
						<div className="pre">扣款账户：</div>
						<div className="text">{cardData.cardOwner}</div>
					</div>
					<div className="content">
						<div className="pre">待充值预付卡：</div>
						<div className="text">{cardData.cardName}</div>
					</div>
					<div className="content">
						<div className="pre">充值金额：</div>
						<Input value={amount} onChange={changeAmount} className="edit" type="number" />
					</div>
					<div className="tips">注意：充值金额不能大于沃易卡账户的余额</div>
					<div className="btns">
						<Button type="primary" className="actionBtn">
							充值
						</Button>
						<Button type="primary" className="actionBtn">
							<NavLink to="/proTable/prepaidCard" className="myAccount">
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
