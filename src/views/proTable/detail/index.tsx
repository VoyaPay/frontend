import { useState, useEffect } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Input, Button, message, Modal } from "antd";

import bankcard from "@/assets/images/bankcard.png";
import back from "@/assets/images/return.png";
import "./index.less";
import { CardInformationApi } from "@/api/modules/card";
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
const fetchCardInformation = async (id: string, setCardData: React.Dispatch<React.SetStateAction<CardData>>) => {
	try {
		const information = await CardInformationApi(id);
		console.log(information);

		if (information) {
			setCardData(prevData => ({
				...prevData,
				expirationDate: information.expiration || "",
				cvv2: information.cvc || "",
				cardNo: information.pan || ""
			}));
		}
	} catch (error) {
		console.error("Error fetching card information:", error);
	}
};

const Detail = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [messageApi, contextHolder] = message.useMessage();
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
	const [cardData, setCardData] = useState<CardData>((location.state as CardData) ?? defaultCardData);

	useEffect(() => {
		if (cardData.key) {
			fetchCardInformation(cardData.key, setCardData);
		}
	}, [cardData.key]);

	const [cardName, setCardName] = useState(cardData.cardName || "cardname");
	const [cardNameStatus, setCardNameStatus] = useState(false);

	const [address, setAddress] = useState(cardData.address || "address");
	const [addressStatus, setAddressStatus] = useState(false);

	const [cardOwner, setCardOwner] = useState(cardData.cardOwner || "cardOwner");
	const [cardOwnerStatus, setCardOwnerStatus] = useState(false);

	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const changeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardName(e.target.value);
	};

	const toggleCardName = (status: any) => {
		setCardNameStatus(status === "change");
	};

	const changeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value);
	};

	const toggleAddress = (status: any) => {
		setAddressStatus(status === "change");
	};

	const changeCardOwner = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardOwner(e.target.value);
	};

	const toggleCardOwner = (status: any) => {
		setCardOwnerStatus(status === "change");
	};

	const goCheck = () => {
		navigate("/proTable/tradeQuery");
	};

	const gotologout = () => {
		messageApi.info("该卡片未满足注销条件！（注销条件：卡片近30天内需无任何授权交易）");
		setOpen(true);
	};

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

	const handlerRechargeDetails = (record: CardData) => {
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

	return (
		<div className="detail-wrap">
			{contextHolder}
			<Modal title="注销提示" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
				<p>确认要注销该卡片吗？</p>
			</Modal>
			<div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">
					<img src={back} alt="" className="returnIcon" /> 预付卡{" "}
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
									toggleCardName("finish");
								}}
							>
								修改完成
							</span>
						) : (
							<span
								className="action"
								onClick={() => {
									toggleCardName("change");
								}}
							>
								修改
							</span>
						)}
					</div>
					<div className="content">
						<div className="pre">卡组：</div>
						<div className="text">{cardData.cardGroup || "N/A"}</div>
					</div>
					<div className="content">
						<div className="pre">卡号：</div>
						<div className="text">{cardData.cardNo || "1234"}</div>
						<span className="action">复制完整卡号</span>
					</div>
					<div className="content">
						<div className="pre">有效期：</div>
						<div className="text">{cardData.expirationDate || "N/A"}</div>
					</div>
					<div className="content">
						<div className="pre">CVV2：</div>
						<div className="text">{cardData.cvv2 || "N/A"}</div>
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
									toggleAddress("finish");
								}}
							>
								修改完成
							</span>
						) : (
							<span
								className="action"
								onClick={() => {
									toggleAddress("change");
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
									toggleCardOwner("finish");
								}}
							>
								修改完成
							</span>
						) : (
							<span
								className="action"
								onClick={() => {
									toggleCardOwner("change");
								}}
							>
								修改
							</span>
						)}
					</div>
					<div className="content">
						<div className="pre">状态：</div>
						<div className="text">{cardData.cardStatus || "N/A"}</div>
					</div>
					<div className="content">
						<div className="pre">余额：</div>
						<div className="text">{cardData.banlance || "N/A"}</div>
						<div className="check" onClick={goCheck}>
							查看消费记录
						</div>
					</div>
					<div className="content">
						<div className="pre">开卡时间：</div>
						<div className="text">{cardData.createCardTime || "N/A"}</div>
					</div>
				</div>
				<div className="right">
					<img src={bankcard} alt="" className="bankCard" />
					<Button type="primary" className="actionBtn" size="large" onClick={() => handlerRechargeDetails(cardData)}>
						充值
					</Button>
					<Button type="primary" size="large" className="actionBtn">
						冻结
					</Button>
					<Button type="primary" size="large" className="actionBtn" onClick={gotologout}>
						注销
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Detail;
