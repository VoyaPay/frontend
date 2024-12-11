import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Input, Button, Modal, message } from "antd";
import back from "@/assets/images/return.png";
import "./index.less";
import { AddCardApi } from "@/api/modules/prepaid";
import { GetBalanceApi } from "@/api/modules/ledger";
import { CardbinApi } from "@/api/modules/card";
import { AccountApi } from "@/api/modules/user";
interface BinData {
	bin: string;
	network?: string;
	orgCompanyId?: string;
}

const AddPrepaidCard = () => {
	const [cardName, setCardName] = useState("");
	const [amount, setAmount] = useState(0);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [streetAddress, setStreetAddress] = useState("1201 North Market Street");
	const [city, setCity] = useState("Wilmington");
	const [state, setState] = useState("DE");
	const [zipcode, setZipCode] = useState("19801");
	const [cardsfee, setcardsfee] = useState("0");
	const [accountBalance, setAccountBalance] = useState(0);
	const [dataSource, setDataSource] = useState<BinData[]>([]);
	const [selectedCard, setSelectedCard] = useState<string | null>(null);
	const navigate = useNavigate();
	const maxLength = 16;
	const combinedLength = firstName.length + lastName.length;

	const changeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (value.length > maxLength) {
			message.error("卡昵称长度不能超过16个字符");
			return;
		}

		setCardName(value);
	};
	const showModal = () => {
		if (!selectedCard) {
			message.error("请先选择一个卡号");
			return;
		}
		if (!cardName) {
			message.error("请填写卡昵称");
			return;
		}

		if (!firstName) {
			message.error("请填写持卡人名字");
			return;
		}

		if (!lastName) {
			message.error("请填写持卡人姓氏");
			return;
		}

		if (!streetAddress) {
			message.error("请填写地址");
			return;
		}

		if (!city) {
			message.error("请填写城市");
			return;
		}

		if (!state) {
			message.error("请填写州");
			return;
		}

		if (!zipcode) {
			message.error("请填写邮编");
			return;
		}

		if (amount <= 0) {
			message.error("充值金额必须大于0");
			return;
		}
		setOpen(true);
	};

	const changeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const regex = /^[A-Za-z\s]*$/; // Only allows English letters and spaces

		if (!regex.test(value)) {
			message.error("名字只能包含英文字符");
			return;
		}
		if (value.length + lastName.length > maxLength) {
			message.error("名字总长度不能超过16个字符");
			return;
		}
		setFirstName(value);
	};

	const changeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const regex = /^[A-Za-z\s]*$/; // Only allows English letters and spaces

		if (!regex.test(value)) {
			message.error("姓氏只能包含英文字符");
			return;
		}

		if (firstName.length + value.length > maxLength) {
			message.error("名字总长度不能超过16个字符");
			return;
		}

		setLastName(value);
	};

	const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(parseInt(e.target.value, 10) || 0);
	};

	const changeStreetAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const regex = /^[A-Za-z0-9\s]*$/; // Only allows English letters and spaces

		if (!regex.test(value)) {
			message.error("地址只能包含英文字符和数字");
			return;
		}
		if (value.length > 50) {
			message.error("地址长度不能超过50个字符");
			return;
		}
		setStreetAddress(value);
	};

	const changeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const regex = /^[A-Za-z\s]*$/; // Only allows English letters and spaces

		if (!regex.test(value)) {
			message.error("城市只能包含英文字符");
			return;
		}
		if (value.length > 50) {
			message.error("城市长度不能超过50个字符");
			return;
		}
		setCity(value);
	};

	const changeState = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const regex = /^[A-Za-z\s]*$/; // Only allows English letters and spaces

		if (!regex.test(value)) {
			message.error("州只能包含英文字符");
			return;
		}
		if (value.length > 25) {
			message.error("州长度不能超过25个字符");
			return;
		}
		setState(value);
	};
	const changeCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const regex = /^[A-Za-z\s]*$/; // Only allows English letters and spaces

		if (!regex.test(value)) {
			message.error("国家只能包含英文字符");
			return;
		}
		if (value.length > 25) {
			message.error("国家长度不能超过25个字符");
			return;
		}
		// setCountry(value);
	};
	const changeZipCode = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const regex = /^[0-9\s]*$/; // Only allows English letters and spaces

		if (!regex.test(value)) {
			message.error("邮编只能包含数字");
			return;
		}
		if (value.length > 5) {
			message.error("邮编长度不能超过5个字符");
			return;
		}
		setZipCode(value);
	};
	const handleSubmit = async () => {
		const payload = {
			type: "PrefundCredit",
			initialLimit: amount,
			alias: cardName,
			cardHolderFirstName: firstName,
			cardHolderLastName: lastName,
			cardBin: selectedCard
		};
		await AddCardApi(payload)
			.then(() => {
				message.success("申请已提交");
				navigate("/applySuccess/index");
			})
			.catch(error => {
				message.error(error);
			});
	};
	const userInformation = async () => {
		try {
			const response = await AccountApi();
			const formattedData = {
				id: response.id || 0,
				fullName: response.fullName || "N/A",
				email: response.email || "N/A",
				companyName: response.companyName || "N/A",
				cardCreationFee: response.userConfig.cardCreationFee || "N/A",
				maximumCardsAllowed: response.userConfig.maximumCardsAllowed || 0
			};
			setcardsfee(formattedData.cardCreationFee);
		} catch (error) {
			console.log("Error fetching user information: " + error);
		}
	};

	useEffect(() => {
		userInformation();
		const getCardBin = async () => {
			try {
				const response = await CardbinApi();
				if (Array.isArray(response)) {
					const formattedData = response.map((bins: any) => ({
						bin: bins.bin,
						network: bins.network, // Include other properties if needed
						orgCompanyId: bins.orgCompanyId
					}));
					setDataSource(formattedData);
				} else {
					console.error("Response is not an array:", response);
				}
			} catch (error) {
				console.error("Error fetching card BINs:", error);
			}
		};

		const getBalance = async () => {
			try {
				const response = await GetBalanceApi();
				console.log("this balance" + response.currentBalance);
				const balance = response.currentBalance ? parseFloat(parseFloat(response.currentBalance).toFixed(2)) : 0;
				setAccountBalance(balance);
			} catch (error) {
				console.log("Cannot get balance of the account:", error);
			}
		};

		// Call the functions
		getBalance();
		getCardBin();
	}, []);

	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const handleOk = () => {
		setConfirmLoading(true);
		setOpen(false);
		setConfirmLoading(false);
		handleSubmit();
	};

	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<div className="addPrepaidCard-wrap">
			<Modal title="申请" visible={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
				<p>
					充值金额 {amount} USD， 开卡费 {cardsfee} USD，总计 {parseFloat(cardsfee) + amount} USD，继续申请？
				</p>
			</Modal>
			<div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">
					<img src={back} alt="" className="returnIcon" />
					预充卡{" "}
				</NavLink>
				-&gt; 新增预充卡
			</div>
			<div className="contentWrap">
				<div className="title">1.卡产品选择</div>
				<div className="cardWrap">
					{dataSource.map((bin, index) => (
						<div
							key={index}
							className={`prepaidCard ${selectedCard === bin.bin ? "selected" : ""}`}
							onClick={() => {
								setSelectedCard(bin.bin);
								console.log("Selected card:", bin.network, bin.bin);
							}}
						>
							{bin.network + " " + bin.bin}
						</div>
					))}
				</div>
			</div>
			<div className="contentWrap">
				<div className="title">2.自定义卡信息</div>
				<div className="content">
					<div className="pre">卡昵称：</div>
					<Input value={cardName} onChange={changeCardName} className="edit" placeholder="Card Name" />
				</div>
				<div className="content">
					<div className="pre">持卡人:</div>
					<div className="name-group">
						<Input value={firstName} onChange={changeFirstName} className="edit" placeholder="First Name" required />
						<Input value={lastName} onChange={changeLastName} className="edit" placeholder="Last Name" required />
						<span>
							{combinedLength}/{maxLength}{" "}
						</span>
					</div>
				</div>

				<div className="content">
					<div className="pre">账单地址：</div>
					<Input value={streetAddress} onChange={changeStreetAddress} className="edit" placeholder="Street Address" disabled />
					<Input value={city} onChange={changeCity} className="edit" placeholder="City" disabled />
					<Input value={state} onChange={changeState} className="edit" placeholder="State" disabled />
					<Input value="USA" onChange={changeCountry} className="edit" placeholder="Country" disabled />
					<Input value={zipcode} onChange={changeZipCode} className="edit" placeholder="Zip Code" disabled />
				</div>
			</div>
			<div className="contentWrap">
				<div className="title">2.充值</div>
				<div className="content">
					<div className="pre">扣款账户：</div>
					<div className="text">沃易卡账户&nbsp;&nbsp;&nbsp;&nbsp; $ {accountBalance}</div>
				</div>
				<div className="content">
					<div className="pre">充值金额：</div>
					<Input value={amount} onChange={changeAmount} className="edit" addonBefore="$" />
				</div>
				<div className="content">
					<div className="pre">开卡费：</div>
					<div className="text">{cardsfee} USD</div>
				</div>
			</div>
			<div className="btns">
				<Button type="primary" className="actionBtn" onClick={showModal}>
					立即申请
				</Button>
				<Button type="text" className="return">
					<NavLink to="/proTable/prepaidCard" className="myAccount">
						返回
					</NavLink>
				</Button>
			</div>
		</div>
	);
};

export default AddPrepaidCard;
