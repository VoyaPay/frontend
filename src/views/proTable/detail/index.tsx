import { useState } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Input, Button } from "antd";
import bankcard from "@/assets/images/bankcard.png";
import "./index.less";

const Detail = () => {
	// 按钮权限
	// const { BUTTONS } = useAuthButtons();
	// const { RangePicker } = DatePicker;
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	console.log(BUTTONS);
	// }, []);

	const [cardName, setCardName] = useState("cardname");
	const [cardNameStatus, setCardNameStatus] = useState(false);

	const [address, setAddress] = useState("cardname");
	const [addressStatus, setAddressStatus] = useState(false);

	const [cardOwner, setCardOwner] = useState("cardname");
	const [cardOwnerStatus, setCardOwnerStatus] = useState(false);

	const changeCardName = e => {
		console.log(e);
		setCardName(e.target.value);
	};

	const tongleCardName = (status: any) => {
		if (status == "change") {
			setCardNameStatus(true);
		} else {
			setCardNameStatus(false);
		}
	};

	const changeAddress = e => {
		setAddress(e.target.value);
	};

	const tongleAddress = (status: any) => {
		if (status == "change") {
			setAddressStatus(true);
		} else {
			setAddressStatus(false);
		}
	};

	const changeCardOwner = e => {
		setCardOwner(e.target.value);
	};

	const tongleCardOwner = (status: any) => {
		if (status == "change") {
			setCardOwnerStatus(true);
		} else {
			setCardOwnerStatus(false);
		}
	};

	return (
		<div className="detail-wrap">
			<div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">
					预付卡{" "}
				</NavLink>
				-&gt; 查看详情
			</div>
			<div className="contentWrap">
				<div className="basicInfo">
					<span className="title">基本信息</span>
					<div className="content">
						<div className="pre">卡片名称：</div>
						{cardNameStatus ? (
							<Input value={cardName} onChange={changeCardName} className="edit" />
						) : (
							<div className="text">{cardName}</div>
						)}
						{cardNameStatus ? (
							<span
								className="action"
								onClick={() => {
									tongleCardName("finish");
								}}
							>
								修改完成
							</span>
						) : (
							<span
								className="action"
								onClick={() => {
									tongleCardName("change");
								}}
							>
								修改
							</span>
						)}
					</div>
					<div className="content">
						<div className="pre">卡组：</div>
						<div className="text">MasterCard</div>
					</div>
					<div className="content">
						<div className="pre">卡号：</div>
						<div className="text">1234344555</div>
						<span className="action">复制完整卡号</span>
					</div>
					<div className="content">
						<div className="pre">有效期：</div>
						<div className="text">02/28</div>
					</div>
					<div className="content">
						<div className="pre">CVV2：</div>
						<div className="text">122</div>
					</div>
					<div className="content">
						<div className="pre">地址：</div>
						{addressStatus ? (
							<Input value={address} onChange={changeAddress} className="edit" />
						) : (
							<div className="text">{address}</div>
						)}
						{addressStatus ? (
							<span
								className="action"
								onClick={() => {
									tongleAddress("finish");
								}}
							>
								修改完成
							</span>
						) : (
							<span
								className="action"
								onClick={() => {
									tongleAddress("change");
								}}
							>
								修改
							</span>
						)}
					</div>
					<div className="content">
						<div className="pre">持卡人名称：</div>
						{cardOwnerStatus ? (
							<Input value={cardOwner} onChange={changeCardOwner} className="edit" />
						) : (
							<div className="text">{cardOwner}</div>
						)}
						{cardOwnerStatus ? (
							<span
								className="action"
								onClick={() => {
									tongleCardOwner("finish");
								}}
							>
								修改完成
							</span>
						) : (
							<span
								className="action"
								onClick={() => {
									tongleCardOwner("change");
								}}
							>
								修改
							</span>
						)}
					</div>
					<div className="content">
						<div className="pre">状态：</div>
						<div className="text">122</div>
					</div>
					<div className="content">
						<div className="pre">余额：</div>
						<div className="text">122</div>
					</div>
					<div className="content">
						<div className="pre">开卡时间：</div>
						<div className="text">122</div>
					</div>
				</div>
				<div className="right">
					<img src={bankcard} alt="" className="bankCard" />
					<Button type="primary" className="actionBtn">
						充值
					</Button>
					<Button type="primary" className="actionBtn">
						冻结
					</Button>
					<Button type="primary" className="actionBtn">
						注销
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Detail;
