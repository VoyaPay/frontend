import { useState } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Input, Button } from "antd";
import "./index.less";

const AddPrepaidCard = () => {
	// 按钮权限
	// const { BUTTONS } = useAuthButtons();
	// const { RangePicker } = DatePicker;
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	console.log(BUTTONS);
	// }, []);

	const [cardName, setCardName] = useState("masterCard");

	const changeCardName = e => {
		setCardName(e.target.value);
	};

	const [cardOwner, setCardOwner] = useState("张三");

	const changeCardOwner = e => {
		setCardOwner(e.target.value);
	};

	const [amount, setAmount] = useState(0);

	const changeAmount = e => {
		setAmount(e.target.value);
	};

	return (
		<div className="addPrepaidCard-wrap">
			<div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">
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
					<div className="pre">卡片名称：</div>
					<Input value={cardName} onChange={changeCardName} className="edit" />
				</div>
				<div className="content">
					<div className="pre">持卡人名称：</div>
					<Input value={cardOwner} onChange={changeCardOwner} className="edit" />
				</div>
				<div className="content">
					<div className="pre">地址：</div>
					<div className="text">默认地址，不允许修改</div>
				</div>
			</div>
			<div className="contentWrap">
				<div className="title">2.充值</div>
				<div className="content">
					<div className="pre">扣款账户：</div>
					<div className="text">沃易卡账户 $100</div>
				</div>
				<div className="content">
					<div className="pre">充值金额：</div>
					<Input value={amount} onChange={changeAmount} className="edit" />
				</div>
				<div className="content">
					<div className="pre">服务费：</div>
					<div className="text">1 USD</div>
				</div>
			</div>
			<div className="btns">
				<Button type="primary" className="actionBtn">
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
