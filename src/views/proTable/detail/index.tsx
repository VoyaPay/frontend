import { useState, useEffect } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Input, Button, message, Modal } from "antd";

import bankcard from "@/assets/images/bankcard.png";
import back from "@/assets/images/return.png";
import "./index.less";
import { CardInformationApi, ChangeCardInformationApi } from "@/api/modules/card";
import copy from "copy-to-clipboard";
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

const updateCardInformation = async (id: string, newDate: any) => {
	try {
		const response = await ChangeCardInformationApi(id, newDate);
		console.log(response);
	} catch (error) {
		console.error("Error updating card information:", error);
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

	const [cardName, setCardName] = useState(cardData.cardName|| "cardname");
	const [cardNameStatus, setCardNameStatus] = useState(false);

	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const saveChanges1 = async () => {
		try {
			const updatedData = {
				status: cardData.cardStatus === "Active" ? "Inactive" : "Active",
				alias: cardName
			};
			const response: any = await updateCardInformation(cardData.key, updatedData);
			if (response?.id) {
				message.success("Card information updated successfully");
			}
			navigate("/proTable/prepaidCard");
		} catch (error) {
			console.error("Error updating card information:", error);
		}
	};

	const saveChanges2 = async () => {
		try {
			const updatedData = {
				status: cardData.cardStatus,
				alias: cardName
			};
			const response: any = await updateCardInformation(cardData.key, updatedData);
			if (response?.id) {
				message.success("Card information updated successfully");
			}
			navigate("/proTable/prepaidCard");
		} catch (error) {
			console.error("Error updating card information:", error);
		}
	};

	const saveChanges3 = async () => {
		try {
			const updatedData = {
				status: "Closed",
				alias: cardName
			};
			const response: any = await updateCardInformation(cardData.key, updatedData);
			if (response?.id) {
				message.success("Card information updated successfully");
			}
			navigate("/proTable/prepaidCard");
		} catch (error) {
			console.error("Error updating card information:", error);
		}
	};

	const changeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardName(e.target.value);
	};

	const toggleCardName = (status: any) => {
		setCardNameStatus(status === "change");
		if (status === "finish") {
			saveChanges2(); 
		}
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

	const goCheck = () => {
		navigate("/proTable/tradeQuery");
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
	const toCopy = () => {
		if (cardData && cardData.cardNo) {
			copy(cardData.cardNo);
			messageApi.info("复制成功！");
		} else {
			messageApi.info("卡号数据不存在，复制失败！");
		}
	};
	return (
		<div className="detail-wrap">
			{contextHolder}
			<Modal title="注销提示" visible={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
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
					<span className="title">卡片信息</span>
					<div className="content">
						<div className="pre">卡昵称：</div>
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
						<span className="action" onClick={toCopy}>
							复制完整卡号
						</span>
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
						<div className="pre">账单地址</div>
						<div className="text">{cardData.address || "address"}</div>
					</div>
					<div className="content">
						<div className="pre">持卡人：</div>
						<div className="text">{cardData.cardOwner || "N/A"}</div>
					</div>

					<div className="content">
						<div className="pre">卡状态：</div>
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
					<Button
						type="primary"
						className="actionBtn"
						size="large"
						onClick={() => {
							saveChanges1();
						}}
					>
						冻结
					</Button>
					<Button type="primary" size="large" className="actionBtn" onClick={() => {
							saveChanges3();
						}}>
						注销
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Detail;
