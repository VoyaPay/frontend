import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Input, Button, Modal, message, InputNumber, Progress } from "antd";
import "./index.less";
import { AddCardApi } from "@/api/modules/prepaid";
import { GetBalanceApi } from "@/api/modules/ledger";
import { CardbinApi } from "@/api/modules/card";
import { AccountApi } from "@/api/modules/user";
import { store } from "@/redux";
interface BinData {
	bin: string;
	network?: string;
	orgCompanyId?: string;
	note?: string;
}

const AddPrepaidCard = () => {
	const remainingCards = store.getState().global.userInfo.userConfig.maximumCardsAllowed;
	const [cardName, setCardName] = useState("");
	const [amount, setAmount] = useState(0);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [streetAddress, setStreetAddress] = useState("1201 North Market Street");
	const [city, setCity] = useState("Wilmington");
	const [state, setState] = useState("DE");
	const [zipcode, setZipCode] = useState("19801");
	const [cardsfee, setcardsfee] = useState(0);
	const [accountBalance, setAccountBalance] = useState(0);
	const [dataSource, setDataSource] = useState<BinData[]>([]);
	const [selectedCard, setSelectedCard] = useState<string | null>(null);
	const navigate = useNavigate();
	const [newCards, setNewCards] = useState(1);
	const [successCount, setSuccessCount] = useState<number | undefined>(undefined);
	const maxLength = 16;
	const combinedLength = firstName.length + lastName.length;

	const validations = [
		{
			condition: !selectedCard,
			message: "请先选择一个卡号"
		},
		{
			condition: !cardName,
			message: "请填写卡昵称"
		},
		{
			condition: !firstName,
			message: "请填写持卡人名字"
		},
		{
			condition: !lastName,
			message: "请填写持卡人姓氏"
		},
		{
			condition: !streetAddress,
			message: "请填写地址"
		},
		{
			condition: !city,
			message: "请填写城市"
		},
		{
			condition: !state,
			message: "请填写州"
		},
		{
			condition: !zipcode,
			message: "请填写邮编"
		},
		{
			condition: amount <= 0,
			message: "充值金额必须大于0"
		},
		{
			condition: newCards * (amount + cardsfee) > accountBalance,
			message: "开卡总金额和开卡费总额不能超过账户余额"
		}
	];

	const showModal = () => {
		let msg = "";
		for (const validation of validations) {
			if (validation.condition) {
				msg = validation.message;
			}
		}
		if (msg) {
			message.error(msg);
			return;
		}
		setOpen(true);
	};

	const changeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (value.length > maxLength) {
			message.error("卡昵称长度不能超过16个字符");
			return;
		}

		setCardName(value);
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
		setSuccessCount(0);
		const payload = {
			type: "PrefundCredit",
			initialLimit: amount,
			alias: cardName,
			cardHolderFirstName: firstName,
			cardHolderLastName: lastName,
			cardBin: selectedCard
		};
		try {
			for (let i = 0; i < newCards; i++) {
				await AddCardApi(payload);
				setSuccessCount(i + 1);
			}
			setSuccessCount(undefined);
			message.success("申请已提交");
			navigate("/applySuccess/index");
		} catch (error) {
			navigate("/prepaidCard");
			message.error("部分卡申请失败");
		}
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
			setcardsfee(Number(formattedData.cardCreationFee));
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
						orgCompanyId: bins.orgCompanyId,
						note:
							bins.bin === "555243"
								? "支持全球商户全币种消费(除美国经济制裁地区外)，以美元结算。"
								: "仅支持美国境内商户消费，以美元结算。"
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

	const changeNewCards = (value: number) => {
		if (!Number.isInteger(value)) {
			message.error("开卡数量必须为整数");
			return;
		}
		if (value > remainingCards) {
			message.error(`开卡数量不能超过${remainingCards}张`);
			return;
		}
		setNewCards(value);
	};

	return (
		<div className="addPrepaidCard-wrap">
			{successCount !== undefined && (
				<div className="loading-wrap">
					<Progress
						className="loading-progress"
						strokeColor="#134faf"
						type="circle"
						percent={Math.round((successCount / newCards) * 100)}
						format={() => `${successCount} / ${newCards}`}
					/>
				</div>
			)}
			<Modal title="申请" visible={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
				<p>
					单卡充值金额 {amount} USD，单卡开卡费 {cardsfee} USD，新增卡数 {newCards} 张，总计充值金额 {amount * newCards}{" "}
					USD，总计开卡费 {cardsfee * newCards} USD，继续申请？
				</p>
			</Modal>
			<div className="contentWrap">
				<div className="title">1.卡产品选择</div>
				<div className="cardWrap">
					{dataSource.map((bin, index) => (
						<div key={index}>
							<div
								className={`prepaidCard ${selectedCard === bin.bin ? "selected" : ""}`}
								onClick={() => {
									setSelectedCard(bin.bin);
								}}
							>
								{bin.network + " " + bin.bin}
								<p className="cardDesc">{bin.note}</p>
							</div>
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
				{/* 3. 确认开卡数。 展示:剩余可用开卡数,新增开卡数，开卡数是个NumberInput，1的整数，最大不超过剩余可用开卡数 */}
				<div className="title">3. 确认开卡数</div>
				<div className="content">
					<div className="pre">剩余可用开卡数：</div>
					<div className="text" style={{ marginLeft: "0" }}>
						{remainingCards} 张
					</div>
				</div>
				<div className="content">
					<div className="pre">新增开卡数：</div>
					<InputNumber
						value={newCards}
						onChange={changeNewCards}
						className="edit"
						style={{ width: "160px", marginRight: "40px" }}
						min={1}
						max={remainingCards}
						step={1}
					/>
				</div>
			</div>
			<div className="contentWrap">
				<div className="title">4.充值</div>
				<div className="content">
					<div className="pre">扣款账户：</div>
					<div className="text" style={{ marginLeft: "0" }}>
						沃易卡账户&nbsp;&nbsp;&nbsp;&nbsp; $ {accountBalance}
					</div>
				</div>
				<div className="content">
					<div className="pre">充值金额：</div>
					<Input
						value={amount}
						onChange={changeAmount}
						className="edit"
						addonBefore="$"
						style={{ width: "160px", marginRight: "50px" }}
					/>
					<div className={`pre ${amount * newCards > accountBalance ? "red" : ""}`}>总计充值金额：</div>
					<div className={`text ${amount * newCards > accountBalance ? "red" : ""}`}>{amount * newCards} USD</div>
				</div>
				<div className="content">
					<div className="pre">单卡开卡费：</div>
					<div className="text" style={{ marginLeft: "0" }}>
						{cardsfee} USD
					</div>
					<div className="pre">总计开卡费：</div>
					<div className="text">{cardsfee * newCards} USD</div>
				</div>
			</div>
			<div className="btns">
				<Button type="primary" className="actionBtn" onClick={showModal}>
					立即申请
				</Button>
				<Button type="text" className="return">
					<NavLink to="/prepaidCard" className="myAccount">
						返回
					</NavLink>
				</Button>
			</div>
		</div>
	);
};

export default AddPrepaidCard;
