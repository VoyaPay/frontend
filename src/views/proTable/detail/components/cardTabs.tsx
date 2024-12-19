import React from "react";
import "./cardTabs.less";
import { Tabs } from "antd";
import CardTransactionRecord from "./cardTransactionRecord";
import CardInformationChangeRecord from "./cardInformationChangeRecord";
const { TabPane } = Tabs;

const CardTabs: React.FC<{ id: string }> = ({ id }) => {
	return (
		<div className="card-detail-tabs-container">
			<Tabs defaultActiveKey="1">
				<TabPane tab="卡交易记录" key="1">
					<CardTransactionRecord id={id} />
				</TabPane>
				<TabPane tab="卡信息变更记录" key="2">
					<CardInformationChangeRecord id={id} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default CardTabs;
