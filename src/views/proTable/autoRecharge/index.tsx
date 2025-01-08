import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bankcard from "@/assets/images/bluecardwithshadow.png";
import { Button, message, InputNumber } from "antd";
import "./index.less";
import { CardData } from "../detail";
import { GetRulesApi, PostRulesParams, UpdateRuleApi, AddRuleApi } from "@/api/modules/rules";

const AutoRecharge = () => {
	const [threshold, setThreshold] = useState<number>(0);
	const [amount, setAmount] = useState<number>(0);
	const [hasRule, setHasRule] = useState(false);
	const [isEnable, setIsEnable] = useState(false);
	const [rule, setRule] = useState<any>(null);
	const navigate = useNavigate();
	const location = useLocation();
	const cardData = location.state as CardData;

	useEffect(() => {
		const fetchRules = async () => {
			await GetRulesApi({ where: { name: `autoRecharge:[${cardData.key}]`, trigger: "cardBalanceChanged" } }).then((res: any) => {
				if (res && res.datalist.length > 0) {
					setRule(res.datalist[0]);
					setIsEnable(res.datalist[0].isEnable);
					setThreshold(res.datalist[0].rule.decisions[0].conditions.all[0].value);
					setAmount(res.datalist[0].rule.decisions[0].event.params.amount);
					setHasRule(true);
				}
			});
		};
		fetchRules();
	}, [cardData.key]);

	const handleSubmit = async () => {
		if (amount < 0.01) {
			message.error("自动充值金额不能小于0.01");
			return;
		}
		const params: PostRulesParams = {
			name: `autoRecharge:[${cardData.key}]`,
			trigger: "cardBalanceChanged",
			isEnable: hasRule ? isEnable : true,
			rule: {
				attributes: [
					{
						name: "cardId",
						type: "number"
					}
				],
				decisions: [
					{
						conditions: {
							all: [
								{
									fact: "balance",
									operator: "lessThan",
									value: Number(threshold)
								},
								{
									fact: "cardId",
									operator: "in",
									value: [parseInt(cardData.key)]
								}
							]
						},
						event: {
							params: {
								amount: Number(amount)
							},
							type: "rechargeCard"
						}
					}
				]
			}
		};

		if (hasRule) {
			await UpdateRuleApi(rule.id, params);
			message.success("自动充值规则修改成功！");
		} else {
			await AddRuleApi(params);
			message.success("自动充值开通成功！");
		}
		navigate(-1);
	};

	const changeMoney = (value: number, type: string) => {
		if (value === undefined || /^\d+(\.\d{0,2})?$/.test(value.toString())) {
			if (type === "threshold") {
				setThreshold(value);
			} else {
				setAmount(value);
			}
		} else {
			message.error("请输入有效的金额，最多两位小数");
		}
	};

	return (
		<div className="autoRecharge-wrap">
			<div className="contentWrap">
				<div className="basicInfo">
					<div className="basicInfo-column">
						<div className="content">
							<div className="pre">预付卡：</div>
							<div className="text">{cardData.cardName}</div>
							<div className="text">&nbsp;{"  ( " + cardData.cardNo + " )"}</div>
							<div className="text">&nbsp;{"$" + cardData.balance}</div>
						</div>
						<div className="content">
							<div className="pre">充值阈值：</div>
							<InputNumber
								value={threshold || undefined}
								onChange={value => changeMoney(value, "threshold")}
								className="edit"
								placeholder="0"
								addonBefore="$"
								min={0}
								step={0.01}
								controls={false}
							/>
						</div>
						<div className="content">
							<div className="pre">自动充值金额：</div>
							<div className="input-wrapper">
								<InputNumber
									value={amount || undefined}
									onChange={value => changeMoney(value, "amount")}
									className="edit"
									placeholder="0"
									addonBefore="$"
									min={0}
									step={0.01}
									controls={false}
								/>
								<div className="input-tips">注意：低于充值阈值时，将发起该金额的自动充值</div>
							</div>
						</div>
					</div>
					<div className="btns">
						<Button type="primary" onClick={handleSubmit}>
							{hasRule ? "确认修改" : "确认开通"}
						</Button>
						<Button type="text" onClick={() => navigate(-1)} style={{ marginLeft: 16 }}>
							返回
						</Button>
					</div>
				</div>
				<div className="right">
					<img src={bankcard} alt="" className="bankCard" />
				</div>
			</div>
		</div>
	);
};

export default AutoRecharge;
