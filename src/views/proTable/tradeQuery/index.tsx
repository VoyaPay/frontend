import { useState } from "react";
import "./index.less";
import Auth from "./auth";
import Create from "./create";
import Aransactions from "./transactions";

const TradeQuery = () => {
	const [tradeType, setTradeType] = useState("auth");

	const changeTradeType = (type: string) => {
		setTradeType(type);
	};

	return (
		<div className="card content-box tradeQueryWrap">
			<div className="tradeQueryTitle">交易查询</div>
			<div className="tradeTypeWrap">
				<div
					className={tradeType == "auth" ? "tradeType selected" : "tradeType"}
					onClick={() => {
						changeTradeType("auth");
					}}
				>
					消费明细
				</div>
				<div
					className={tradeType == "create" ? "tradeType selected" : "tradeType"}
					onClick={() => {
						changeTradeType("create");
					}}
				>
					开卡明细
				</div>
				<div
					className={tradeType == "account" ? "tradeType selected" : "tradeType"}
					onClick={() => {
						changeTradeType("account");
					}}
				>
					动账明细
				</div>
			</div>

			<div>{tradeType === "auth" ? <Auth /> : tradeType === "create" ? <Create /> : <Aransactions />}</div>
		</div>
	);
};

export default TradeQuery;
