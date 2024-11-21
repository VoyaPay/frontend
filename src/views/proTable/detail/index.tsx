import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Input, Button, message, Modal } from "antd";
import bankcard from "@/assets/images/bluecardwithshadow.png";
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
	cardTotal: string;
	cardStatus: string;
	balance: string;
	createCardTime: string;
	updatecardTime: string;
	address?: string;
	expirationDate?: string;
	cvv2?: string;
	cardHolderAddressStreet: string;
	cardHolderAddressCity: string;
	cardHolderAddressState: string;
	cardHolderAddressPostalCode: string;
	cardHolderAddressCountry: string;
	partnerIdempotencyKey: string;
	cardHolderName: string;
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

const formatDate2 = (dateString: string) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	// 返回格式为 yyyy-MM-dd hh:mm:ss
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
		balance: "0",
		createCardTime: "2023-01-01",
		updatecardTime: "1999-01-01",
		cardTotal: "00000000000",
		cardHolderAddressStreet: "street",
		cardHolderAddressCity: "city",
		cardHolderAddressState: "state",
		cardHolderAddressPostalCode: "zipcode",
		cardHolderAddressCountry: "country",
		partnerIdempotencyKey: "0",
		cardHolderName: "name"
	};
	const [cardData, setCardData] = useState<CardData>((location.state as CardData) ?? defaultCardData);
	const [cardName, setCardName] = useState(cardData.cardName || "cardname");
	const [cardNameStatus, setCardNameStatus] = useState(false);
	const [openFreezeModal, setOpenFreezeModal] = useState(false);
	const [openCloseModal, setOpenCloseModal] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	// const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
	// const [isNameModalVisible, setIsNameModalVisible] = useState(false);
	// const [streetAddress, setStreetAddress] = useState("street");
	// const [city, setCity] = useState("city");
	// const [state, setState] = useState("state");
	// const [zipcode, setZipCode] = useState("zipcode");

	// // Cardholder name states
	// const [firstName, setFirstName] = useState("first");
	// const [lastName, setLastName] = useState("last");

	useEffect(() => {
		console.log(cardData);
		if (cardData.key) {
			fetchCardInformation(cardData.key, setCardData);
		}
	}, [cardData.key]);
	// const changeStreetAddress = (e: React.ChangeEvent<HTMLInputElement>) => setStreetAddress(e.target.value);
	// const changeCity = (e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value);
	// const changeState = (e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value);
	// const changeZipCode = (e: React.ChangeEvent<HTMLInputElement>) => setZipCode(e.target.value);

	// // Handlers for name input changes
	// const changeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value);
	// const changeLastName = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value);

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
			message.success("卡片信息修改成功");
			setCardData(prevData => ({
				...prevData,
				cardStatus: updatedData.status // 更新状态
			}));
		}
	};

	// const showAddressModal = () => {
	// 	setIsAddressModalVisible(true);
	// };

	// const showNameModal = () => {
	// 	setIsNameModalVisible(true);
	// };

	// const handleAddressCancel = () => {
	// 	setIsAddressModalVisible(false);
	// };

	// const handleNameCancel = () => {
	// 	setIsNameModalVisible(false);
	// };

	const saveChanges2 = async () => {
		const maxLength = 16;
		if (cardData.cardStatus === "Closed") {
			// Display error message and prevent editing
			message.error("无法修改已注销的卡片");
			return;
		}
		if (cardName.length > maxLength) {
			message.error("卡昵称长度不能超过16个字符");
			return;
		}
		const updatedData = {
			status: cardData.cardStatus,
			alias: cardName
		};
		const response: any = await updateCardInformation(cardData.key, updatedData);
		if (response?.id) {
			message.success("卡片信息修改成功");
			fetchCardInformation(cardData.key, setCardData);
		}
	};

	// const saveAddressChanges = async () => {
	// 	if (cardData.cardStatus === "Closed") {
	// 		// Display error message and prevent editing
	// 		message.error("无法修改已注销的卡片");
	// 		return;
	// 	}
	// 	const updatedAddress = {
	// 		streetAddress,
	// 		city,
	// 		state,
	// 		zipcode
	// 	};
	// 	try {
	// 		await ChangeCardInformationApi("some-id", updatedAddress); // Replace 'some-id' with the actual card id
	// 		message.success("地址修改成功");
	// 		setIsAddressModalVisible(false); // Close the modal after saving
	// 	} catch (error) {
	// 		message.error("修改地址失败");
	// 	}
	// };

	// const saveNameChanges = async () => {
	// 	// Simulate saving the name (e.g., API call)
	// 	const updatedName = {
	// 		firstName,
	// 		lastName
	// 	};
	// 	try {
	// 		await ChangeCardInformationApi("some-id", updatedName); // Replace 'some-id' with the actual card id
	// 		message.success("姓名修改成功");
	// 		setIsNameModalVisible(false); // Close the modal after saving
	// 	} catch (error) {
	// 		message.error("修改姓名失败");
	// 	}
	// };

	const saveChanges3 = async () => {
		// 先保存原来的状态，以便在出错时恢复
		if (cardData.cardStatus === "Closed") {
			// Display error message and prevent editing
			message.error("无法修改已注销的卡片");
			return;
		}
		const previousStatus = cardData.cardStatus;

		setCardData(prevData => ({
			...prevData,
			cardStatus: "Closed"
		}));

		// 构建更新数据
		const updatedData = {
			status: "Closed",
			alias: cardName
		};

		try {
			const response: any = await updateCardInformation(cardData.key, updatedData);

			if (response?.id) {
				message.success("操作成功");
				setCardData(prevData => ({
					...prevData,
					cardStatus: updatedData.status // 更新状态
				}));
			} else {
				// 如果没有成功更新，显示失败提示
				throw new Error("此卡在30天内存在交易记录， 无法注销，请之后重试");
			}
		} catch (error) {
			// 如果发生错误（包括服务器返回 400），恢复原来的状态并显示错误消息
			setCardData(prevData => ({
				...prevData,
				cardStatus: previousStatus // 恢复到之前的状态
			}));
			message.error("更新失败");
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
				balance: record.balance,
				createCardTime: record.createCardTime
			}
		});
	};
	const handlecashback = (record: CardData) => {
		if (cardData.cardStatus === "Closed") {
			// Display error message and prevent editing
			message.error("无法充值已注销的卡片");
			return;
		}
		navigate("/cashback/index", {
			state: {
				key: record.key,
				cardName: record.cardName,
				cardOwner: record.cardOwner,
				cardGroup: record.cardGroup,
				cardNo: record.cardNo,
				cardStatus: record.cardStatus,
				balance: record.balance,
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
				balance: record.balance,
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
	const formatCardNumber = (cardNumber: string) => {
		if (cardNumber) {
			return cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
		} else {
			return 1234 - 5678 - 9000;
		}
	};

	return (
		<div className="detail-wrap">
			{contextHolder}

			{/* Freeze Confirmation Modal */}
			<Modal
				title={cardData.cardStatus === "Inactive" ? "确认解冻" : "确认冻结"} // 根据状态动态调整标题
				visible={openFreezeModal}
				onOk={handleFreezeOk}
				confirmLoading={confirmLoading}
				onCancel={handleFreezeCancel}
			>
				<p>{cardData.cardStatus === "Inactive" ? "确定要解冻此卡片吗？" : "确定要冻结此卡片吗？"}</p> {/* 根据状态动态调整内容 */}
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
							<Input
								value={cardName}
								onChange={e => {
									const value = e.target.value;
									if (value.length <= 16) {
										setCardName(value);
									} else {
										message.error("卡昵称长度不能超过16个字符");
									}
								}}
								className="edit"
								placeholder="请输入卡昵称"
							/>
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
									cardData.cardStatus !== "Closed" ? toggleCardName("change") : message.error("无法修改已注销的卡片");
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
						<div className="text">{formatCardNumber(cardData.cardTotal) || "123 456 789"}</div>
						<span className="action" onClick={toCopy}>
							复制完整卡号
						</span>
					</div>

					<div className="content">
						<div className="pre">有效期：</div>
						<div className="text">{cardData.expirationDate}</div>
					</div>

					<div className="content">
						<div className="pre">CVV2：</div>
						<div className="text">{cardData.cvv2 || "N/A"}</div>
					</div>

					<div className="content">
						<div className="pre">账单地址：</div>
						<div className="text">
							{cardData.cardHolderAddressStreet +
								" , " +
								cardData.cardHolderAddressCity +
								" ,    " +
								cardData.cardHolderAddressState +
								" , USA " +
								" , " +
								cardData.cardHolderAddressPostalCode || "address"}
						</div>
					</div>

					<div className="content">
						<div className="pre">持卡人：</div>
						<div className="text">{cardData.cardHolderName || "N/A"}</div>
					</div>

					<div className="content">
						<div className="pre">卡状态：</div>
						<div className="text">
							{cardData.cardStatus === "Active"
								? "活跃"
								: cardData.cardStatus === "Inactive"
								? "已冻结"
								: cardData.cardStatus === "PreClose"
								? "待注销"
								: cardData.cardStatus === "Closed"
								? `已注销 (${formatDate2(cardData.updatecardTime)})`
								: "N/A"}
						</div>
					</div>

					<div className="content">
						<div className="pre">余额：</div>
						<div className="text"> {cardData.balance ? `$ ${cardData.balance}` : "$0"}</div>

						<div className="check" onClick={() => goCheck(cardData)}>
							查看消费记录
						</div>
					</div>

					<div className="content">
						<div className="pre">开卡时间：</div>
						<div className="text">{cardData.createCardTime || "N/A"}</div>
					</div>
				</div>

				{/* <Modal title="修改账单地址" visible={isAddressModalVisible} onOk={saveAddressChanges} onCancel={handleAddressCancel}>
					<Input value={streetAddress} onChange={changeStreetAddress} className="edit" placeholder="Street Address" />
					<Input value={city} onChange={changeCity} className="edit" placeholder="City" />
					<Input value={state} onChange={changeState} className="edit" placeholder="State" />
					<Input value="USA" className="edit" placeholder="Country" disabled />
					<Input value={zipcode} onChange={changeZipCode} className="edit" placeholder="Zip Code" />
				</Modal> */}

				{/* Cardholder Name Modification Modal */}
				{/* <Modal title="修改持卡人姓名" visible={isNameModalVisible} onOk={saveNameChanges} onCancel={handleNameCancel}>
					<Input value={firstName} onChange={changeFirstName} className="edit" placeholder="First Name" />
					<Input value={lastName} onChange={changeLastName} className="edit" placeholder="Last Name" />
				</Modal> */}

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
						onClick={() => handlecashback(cardData)}
						disabled={cardData.cardStatus !== "Active"}
					>
						提现
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
						disabled={cardData.cardStatus === "Closed" || cardData.cardStatus === "PreClose"}
					>
						{cardData.cardStatus === "PreClose" ? "注销中" : cardData.cardStatus === "Closed" ? "已注销" : "注销"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Detail;
