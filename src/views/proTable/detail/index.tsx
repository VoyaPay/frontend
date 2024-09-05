import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Input, Button } from "antd";
import { NavLink } from "react-router-dom";
import bankcard from "@/assets/images/bankcard.png";
import "./index.less";

const Detail = () => {
	
	const location = useLocation();
	const { card } = location.state || {}; 
	console.log(location)
	
	const [cardName, setCardName] = useState(card?.cardName || "cardname");
	const [cardNameStatus, setCardNameStatus] = useState(false);

	const [address, setAddress] = useState(card?.address || "cardname");
	const [addressStatus, setAddressStatus] = useState(false);

	const [cardOwner, setCardOwner] = useState(card?.cardOwner || "cardname");
	const [cardOwnerStatus, setCardOwnerStatus] = useState(false);

	const changeCardName = e => {
		setCardName(e.target.value);
	};

	const tongleCardName = (status) => {
		setCardNameStatus(status === "change");
	};

	const changeAddress = e => {
		setAddress(e.target.value);
	};

	const tongleAddress = (status) => {
		setAddressStatus(status === "change");
	};

	const changeCardOwner = e => {
		setCardOwner(e.target.value);
	};

	const tongleCardOwner = (status) => {
		setCardOwnerStatus(status === "change");
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
						<div className="text">{card?.cardGroup || "MasterCard"}</div>
					</div>
					<div className="content">
						<div className="pre">卡号：</div>
						<div className="text">{card?.cardNo || "1234344555"}</div>
						<span className="action">复制完整卡号</span>
					</div>
					<div className="content">
						<div className="pre">有效期：</div>
						<div className="text">{card?.expirationDate || "02/28"}</div>
					</div>
					<div className="content">
						<div className="pre">CVV2：</div>
						<div className="text">{card?.cvv || "122"}</div>
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
						<div className="text">{card?.cardStatus || "Active"}</div>
					</div>
					<div className="content">
						<div className="pre">余额：</div>
						<div className="text">{card?.banlance || "122"}</div>
					</div>
					<div className="content">
						<div className="pre">开卡时间：</div>
						<div className="text">{card?.createCardTime || "2024/09/05"}</div>
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
