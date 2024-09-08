import { useState } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Input, Button } from "antd";
import bankcard from "@/assets/images/bankcard.png";
import back from "@/assets/images/return.png";
import "./index.less";

const PrepaidRecharge = () => {
	// 按钮权限
	// const { BUTTONS } = useAuthButtons();
	// const { RangePicker } = DatePicker;
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	console.log(BUTTONS);
	// }, []);

	const [amount, setAmount] = useState(0);

	const changeAmount = e => {
		setAmount(e.target.value);
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
						<div className="text">沃易卡账户 $100</div>
					</div>
					<div className="content">
						<div className="pre">待充值预付卡：</div>
						<div className="text">广告2（485643***2345）</div>
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
						<Button type="text" className="return">
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
