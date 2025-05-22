import { useState, useEffect, createContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, message, Modal, Switch } from "antd";
import bankcard from "@/assets/images/bluecardwithshadow.png";
import "./index.less";
import { CardInformationApi, ChangeCardInformationApi, enableCardDetail } from "@/api/modules/card";
import copy from "copy-to-clipboard";
import CardTabs from "./components/cardTabs";
import { encryption, formatDate } from "@/utils/util";
import { GetRulesApi, UpdateRuleStatusApi } from "@/api/modules/rules";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { ResultEnum } from "@/enums/httpEnum";
import { findPayConfig } from "@/api/modules/user";

export interface CardData {
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
	autoRecharge: boolean;
}

const maxLength = 20;

const fetchCardInformation = async (id: string, setCardData: React.Dispatch<React.SetStateAction<CardData>>) => {
	try {
		const information = await CardInformationApi(id);
		if (information) {
			setCardData(prevData => ({
				...prevData,
				balance: information.balance?.toString() || "0",
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
	return await ChangeCardInformationApi(id, newDate);
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
		cardHolderName: "name",
		autoRecharge: false
	};
	const [cardData, setCardData] = useState<CardData>((location.state as CardData) ?? defaultCardData);
	const [cardName, setCardName] = useState(cardData.cardName || "cardname");
	const [rule, setRule] = useState<any>(null);
	const [cardNameStatus, setCardNameStatus] = useState(false);
	const [openFreezeModal, setOpenFreezeModal] = useState(false);
	const [openCloseModal, setOpenCloseModal] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [openAutoRechargeModal, setOpenAutoRechargeModal] = useState(false);
	const [autoRechargeSwitch, setAutoRechargeSwitch] = useState(false);
	const [showCardDetails, setShowCardDetails] = useState(false);
	const payPwdRef = useRef("");

	useEffect(() => {
		if (cardData.key) {
			getIsShowCardDetail();
			fetchCardInformation(cardData.key, setCardData);
			fetchRules();
		}
	}, [cardData.key]);

	const getIsShowCardDetail = async () => {
		const res = await findPayConfig();
		if (res.data?.showCardDetail == 1) {
			setShowCardDetails(true);
		}
	};

	const fetchRules = async () => {
		await GetRulesApi({ where: { name: `autoRecharge:[${cardData.key}]`, trigger: "cardBalanceChanged" } }).then((res: any) => {
			if (res && res.datalist.length > 0) {
				setRule(res.datalist[0]);
				setCardData(prevData => ({
					...prevData,
					autoRecharge: res.datalist[0].isEnable
				}));
				setAutoRechargeSwitch(res.datalist[0].isEnable);
			}
		});
	};

	const openOrClosedDetail = async () => {
		Modal.confirm({
			title: "请输入支付密码",
			icon: null,
			content: (
				<Input.Password
					onChange={e => {
						payPwdRef.current = e.target.value;
					}}
					placeholder="请输入支付密码..."
				/>
			),
			onOk() {
				let value = payPwdRef.current;
				console.log("用户输入:", value);
				if (!value) {
					message.error("请输入支付密码！");
					return Promise.reject();
				}
				// 这里执行确认后的逻辑
				enableCardDetail({ pwd: encryption(value), enable: showCardDetails ? 0 : 1 }).then(res => {
					if (res.code == ResultEnum.SUCCESS) {
						fetchCardInformation(cardData.key, setCardData);
						setShowCardDetails(!showCardDetails);
					}
				});
			},
			onCancel() {}
		});
	};

	const saveChanges1 = async () => {
		if (cardData.cardStatus === "Closed") {
			message.error("无法修改已注销的卡片。");
			return;
		}
		const updatedData = {
			status: cardData.cardStatus === "Active" ? "Inactive" : "Active",
			alias: cardName
		};
		const response: any = await updateCardInformation(cardData.key, updatedData);
		if (response?.id) {
			message.success("卡片信息修改成功。");
			setCardData(prevData => ({
				...prevData,
				cardStatus: updatedData.status // 更新状态
			}));
		}
	};

	const saveChanges2 = async () => {
		if (cardData.cardStatus === "Closed") {
			// Display error message and prevent editing
			message.error("无法修改已注销的卡片。");
			return;
		}
		if (cardName.length > maxLength) {
			message.error(`卡昵称长度不能超过${maxLength}个字符`);
			return;
		}
		const updatedData = {
			status: cardData.cardStatus,
			alias: cardName.trim()
		};
		const response: any = await updateCardInformation(cardData.key, updatedData);
		if (response?.id) {
			setCardData(prevData => ({
				...prevData,
				cardName: cardName.trim()
			}));
			setCardName(cardName.trim());
			message.success("卡片信息修改成功。");
			fetchCardInformation(cardData.key, setCardData);
		}
	};

	const saveChanges3 = async () => {
		if (Number(cardData.balance) < 0) {
			message.error("余额为负，无法注销。");
			return;
		}
		if (cardData.cardStatus === "Closed") {
			message.error("无法修改已注销的卡片。");
			return;
		}
		const response: any = await updateCardInformation(cardData.key, {
			status: "Closed",
			alias: cardName
		});
		if (response?.id) {
			message.success("操作成功");
			setCardData(prevData => ({
				...prevData,
				cardStatus: "Closed"
			}));
			if (cardData.autoRecharge) {
				handleAutoRechargeChange(cardData.key, false);
			}
		}
	};

	const toggleCardName = (status: any) => {
		setCardNameStatus(status === "change");
		if (status === "finish") {
			saveChanges2();
		}
	};

	const handlerRechargeDetails = (record: CardData) => {
		navigate("/prepaidCard/prepaidRecharge", {
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
		navigate("/prepaidCard/cashback", {
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
		navigate("/tradeQuery", {
			state: {
				key: record.key
			}
		});
	};

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
			return "0000 0000 0000";
		}
	};

	const handleAutoRechargeChange = (key: string, value: boolean) => {
		if (cardData.cardStatus === "Closed" || cardData.cardStatus === "PreClose") {
			message.error("已注销或待注销的卡片不能开启自动充值。");
			setCardData(prevData => ({
				...prevData,
				autoRecharge: false
			}));
			setAutoRechargeSwitch(false);
			return;
		}
		if (!rule) {
			navigate("/prepaidCard/autoRecharge", {
				state: {
					...cardData
				}
			});
			setAutoRechargeSwitch(cardData.autoRecharge);
			return;
		}
		UpdateRuleStatusApi(rule.id, value).then(() => {
			message.success(value ? "自动充值开启成功！" : "自动充值关闭成功！");
			setCardData(prevData => ({
				...prevData,
				autoRecharge: value
			}));
			setAutoRechargeSwitch(value);
		});
	};

	const handleSwitchChange = (checked: boolean) => {
		setAutoRechargeSwitch(!checked);
		setOpenAutoRechargeModal(true);
	};

	const goAutoRecharge = () => {
		navigate("/prepaidCard/autoRecharge", {
			state: {
				...cardData
			}
		});
	};

	return (
		<div className="detail-wrap">
			{contextHolder}
			<Modal
				title={cardData.cardStatus === "Inactive" ? "确认解冻" : "确认冻结"}
				visible={openFreezeModal}
				onOk={handleFreezeOk}
				confirmLoading={confirmLoading}
				onCancel={handleFreezeCancel}
			>
				<p>{cardData.cardStatus === "Inactive" ? "确定要解冻此卡片吗？" : "确定要冻结此卡片吗？"}</p>
			</Modal>
			<Modal
				title="确认注销"
				visible={openCloseModal}
				onOk={handleCloseOk}
				confirmLoading={confirmLoading}
				onCancel={handleCloseCancel}
			>
				<p>确定要注销此卡片吗？</p>
			</Modal>
			<div className="contentWrap">
				<div className="basicInfo">
					<span className="title">卡片信息</span>
					<div style={{ display: "flex", justifyContent: "space-between", maxWidth: "900px" }}>
						<div className="basicInfo-column">
							<div className="content">
								<div className="pre">卡昵称：</div>
								{cardNameStatus ? (
									<Input
										value={cardName}
										onChange={e => {
											const value = e.target.value;
											if (value.length <= maxLength) {
												setCardName(value);
											} else {
												message.error(`卡昵称长度不能超过${maxLength}个字符`);
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
								<div className="text">{formatCardNumber(cardData.cardTotal)}</div>
								<span className="action eye-icon" onClick={() => openOrClosedDetail()}>
									{showCardDetails ? <EyeInvisibleOutlined /> : <EyeOutlined />}
								</span>
								<span className="action" onClick={toCopy}>
									复制完整卡号
								</span>
							</div>

							<div className="content">
								<div className="pre">有效期：</div>
								<div className="text">{cardData.expirationDate || "N/A"}</div>
								<span className="action eye-icon" onClick={() => openOrClosedDetail()}>
									{showCardDetails ? <EyeInvisibleOutlined /> : <EyeOutlined />}
								</span>
							</div>

							<div className="content">
								<div className="pre">CVV：</div>
								<div className="text">{cardData.cvv2 || "N/A"}</div>
								<span className="action eye-icon" onClick={() => openOrClosedDetail()}>
									{showCardDetails ? <EyeInvisibleOutlined /> : <EyeOutlined />}
								</span>
							</div>
							<div className="content">
								<div className="pre">自动充值：</div>
								<div className="switch-wrap">
									<Switch size="small" checked={autoRechargeSwitch} onChange={checked => handleSwitchChange(checked)} />
									{cardData.cardStatus !== "Closed" && cardData.cardStatus !== "PreClose" && (
										<span className="action" onClick={goAutoRecharge}>
											配置规则
										</span>
									)}
								</div>
							</div>
						</div>
						<div className="basicInfo-column">
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
										? `已注销 (${formatDate(cardData.updatecardTime)})`
										: "N/A"}
								</div>
							</div>

							<div className="content">
								<div className="pre">余额：</div>
								<div className="text"> {cardData.balance ? (showCardDetails ? "" : "$ ") + `${cardData.balance}` : "$0"}</div>
								<span className="action eye-icon" onClick={() => openOrClosedDetail()}>
									{showCardDetails ? <EyeInvisibleOutlined /> : <EyeOutlined />}
								</span>
								<div className="check" onClick={() => goCheck(cardData)}>
									查看消费记录
								</div>
							</div>

							<div className="content">
								<div className="pre">开卡时间：</div>
								<div className="text">{cardData.createCardTime || "N/A"}</div>
							</div>

							<div className="content">
								<div className="pre">账单地址：</div>
								<div className="text" style={{ flex: 1 }}>
									1201 North Market Street,
									<br />
									Wilmington, DE, USA, 19801
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="right">
					<img src={bankcard} alt="" className="bankCard" />
					<div className="actionBtnWrap">
						<Button
							type="primary"
							className="actionBtn"
							size="large"
							onClick={() => handlerRechargeDetails(cardData)}
							disabled={cardData.cardStatus !== "Active" && cardData.cardStatus !== "Closed"}
						>
							充值
						</Button>
						<Button
							type="primary"
							className="actionBtn"
							size="large"
							onClick={() => handlecashback(cardData)}
							disabled={cardData.cardStatus !== "Active" && cardData.cardStatus !== "Closed"}
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
					<Modal
						title={cardData.autoRecharge ? "确认关闭" : "确认开启"}
						visible={openAutoRechargeModal}
						onOk={() => {
							handleAutoRechargeChange(cardData.key, !cardData.autoRecharge);
							setOpenAutoRechargeModal(false);
						}}
						onCancel={() => {
							setAutoRechargeSwitch(cardData.autoRecharge);
							setOpenAutoRechargeModal(false);
						}}
						okText={!rule ? "确定，去配置规则" : "确定"}
						cancelText="取消"
					>
						<p>{cardData.autoRecharge ? "确定要关闭自动充值吗？" : "确定要开启自动充值吗？"}</p>
					</Modal>
				</div>
			</div>
			<CardProvider cardData={cardData}>
				<CardTabs id={cardData.key} />
			</CardProvider>
		</div>
	);
};

export const CardContext = createContext<CardData | null>(null);

export const CardProvider = ({ children, cardData }: { children: React.ReactNode; cardData: CardData }) => {
	return <CardContext.Provider value={cardData}>{children}</CardContext.Provider>;
};

export default Detail;
