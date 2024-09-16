import { useState, useEffect } from "react";
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
	cardTotal:string,
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
		if (information) {
			setCardData(prevData => ({
				...prevData,
				expirationDate: information.expiration || "",
				cvv2: information.cvc || "",
				cardTotal: information.pan || ""
			}));
		}
	} catch (error) {
		console.error("Error fetching card information:", error);
	}
};

const updateCardInformation = async (id: string, newDate: any) => {
	try {
		const response = await ChangeCardInformationApi(id, newDate);
		return response;
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
		createCardTime: "2023-01-01 00:00:00",
		cardTotal:"00000000000"
	};
	const [cardData, setCardData] = useState<CardData>((location.state as CardData) ?? defaultCardData);
	const [cardName, setCardName] = useState(cardData.cardName || "cardname");
	const [cardNameStatus, setCardNameStatus] = useState(false);
	const [openFreezeModal, setOpenFreezeModal] = useState(false);
	const [openCloseModal, setOpenCloseModal] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	useEffect(() => {
		if (cardData.key) {
			fetchCardInformation(cardData.key, setCardData);
		}
	}, [cardData.key]);

	const saveChanges1 = async () => {
		if (cardData.cardStatus === "Closed") {
			// Display error message and prevent editing
			message.error("无法修改已注销的卡片");
			return;
		}
		const updatedData = {
			status: cardData.cardStatus === "Active" ? "Inactive" : "Active",
			alias: cardName
		};
		const response: any = await updateCardInformation(cardData.key, updatedData);
		if (response?.id) {
			message.success("Card information updated successfully");
			navigate("/proTable/prepaidCard");
		}
	};

	const saveChanges2 = async () => {
		if (cardData.cardStatus === "Closed") {
			// Display error message and prevent editing
			message.error("无法修改已注销的卡片");
			return;
		}
		const updatedData = {
			status: cardData.cardStatus,
			alias: cardName
		};
		const response: any = await updateCardInformation(cardData.key, updatedData);
		if (response?.id) {
			message.success("Card information updated successfully");
			navigate("/proTable/prepaidCard");
		}
	};

	const saveChanges3 = async () => {
		if (cardData.cardStatus === "Closed") {
			// Display error message and prevent editing
			message.error("无法修改已注销的卡片");
			return;
		}
		const updatedData = {
			status: "Closed",
			alias: cardName
		};
		const response: any = await updateCardInformation(cardData.key, updatedData);
		if (response?.id) {
			message.success("Card information updated successfully");
			navigate("/proTable/prepaidCard");
		}
	};

	const toggleCardName = (status: any) => {
		setCardNameStatus(status === "change");
		if (status === "finish") {
			saveChanges2();
		}
	};

	const handlerRechargeDetails = (record: CardData) => {
		if (cardData.cardStatus === "Closed") {
			// Display error message and prevent editing
			message.error("无法充值已注销的卡片");
			return;
		}
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

	const goCheck = (record: CardData) => {
		navigate("/proTable/tradeQuery", {
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

	// Freeze modal handler
	const showFreezeModal = () => {
		setOpenFreezeModal(true);
	};

	const handleFreezeOk = () => {
		setConfirmLoading(true);
		saveChanges1();
		setConfirmLoading(false);
		setOpenFreezeModal(false);
	};

	const handleFreezeCancel = () => {
		setOpenFreezeModal(false);
	};

	// Close modal handler
	const showCloseModal = () => {
		setOpenCloseModal(true);
	};

	const handleCloseOk = () => {
		setConfirmLoading(true);
		saveChanges3();
		setConfirmLoading(false);
		setOpenCloseModal(false);
	};

	const handleCloseCancel = () => {
		setOpenCloseModal(false);
	};

	const toCopy = () => {
		if (cardData && cardData.cardTotal) {
			copy(cardData.cardTotal);
			messageApi.info("复制成功！");
		} else {
			messageApi.info("卡号数据不存在，复制失败！");
		}
	};

	return (
		<div className="detail-wrap">
			{contextHolder}

			{/* Freeze Confirmation Modal */}
			<Modal
				title={cardData.cardStatus === "Inactive" ? "确认解冻" : "确认冻结"}  // 根据状态动态调整标题
				visible={openFreezeModal}
				onOk={handleFreezeOk}
				confirmLoading={confirmLoading}
				onCancel={handleFreezeCancel}
			>
				<p>{cardData.cardStatus === "Inactive" ? "确定要解冻此卡片吗？" : "确定要冻结此卡片吗？"}</p>  {/* 根据状态动态调整内容 */}
			</Modal>

			{/* Close Confirmation Modal */}
			<Modal
				title="确认注销"
				visible={openCloseModal}
				onOk={handleCloseOk}
				confirmLoading={confirmLoading}
				onCancel={handleCloseCancel}
			>
				<p>确定要注销此卡片吗？</p>
			</Modal>

			<div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">
					<img src={back} alt="" className="returnIcon" /> 预充卡{" "}
				</NavLink>
				-&gt; 查看详情
			</div>

			<div className="contentWrap">
				<div className="basicInfo">
					<span className="title">卡片信息</span>
					<div className="content">
						<div className="pre">卡昵称：</div>
						{cardNameStatus ? (
							<Input value={cardName} onChange={e => setCardName(e.target.value)} className="edit" />
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
						<div className="text">{cardData.cardTotal || "123456789"}</div>
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
						<div className="pre">账单地址：</div>
						<div className="text">{cardData.address || "address"}</div>
					</div>

					<div className="content">
						<div className="pre">持卡人：</div>
						<div className="text">{cardData.cardOwner || "N/A"}</div>
					</div>

					<div className="content">
						<div className="pre">卡状态：</div>
						<div className="text">{cardData.cardStatus === "Active"
							? "活跃"
							: cardData.cardStatus === "Inactive"
							? "已冻结"
							: cardData.cardStatus === "Closed"
							? "已注销"
							: "N/A"}	
						</div>
					</div>

					<div className="content">
						<div className="pre">余额：</div>
						<div className="text"> {cardData.banlance ? `$ ${cardData.banlance}` : "N/A"}</div>

						<div className="check" onClick={() => goCheck(cardData)}>
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
					<Button
						type="primary"
						className="actionBtn"
						size="large"
						onClick={() => handlerRechargeDetails(cardData)}
						disabled={cardData.cardStatus !== "Active"} 
					>
						充值
					</Button>
					<Button
						type="primary"
						className="actionBtn"
						size="large"
						onClick={showFreezeModal}
						disabled={cardData.cardStatus !== "Active" && cardData.cardStatus !== "Inactive"}
					>
						{cardData.cardStatus === "Inactive" ? "解冻" : "冻结"}
					</Button>
					<Button
						type="primary"
						size="large"
						className="actionBtn"
						onClick={showCloseModal}
						disabled={cardData.cardStatus === "Closed"}
					>
						注销
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Detail;
