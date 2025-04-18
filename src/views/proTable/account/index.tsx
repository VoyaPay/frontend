import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Button, DatePicker } from "antd";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { TransactionStatisticApi } from "@/api/modules/transactions";
import { GetBalanceApi } from "@/api/modules/ledger";
import * as echarts from "echarts";
import { COUNTRY_MAP } from "@/enums/transactions";

import "./index.less";

type TransactionData = {
	mccGroup: Array<{ groupBy: string; totalAmount: number }>;
	merchantCountryGroup: Array<{ groupBy: string; totalAmount: number }>;
	monthGroup: Array<{ groupBy: string; totalAmount: number; totalTransactions: number }>;
};

function renderChartWithNoData(dom: HTMLElement | null, buildOption: () => echarts.EChartsOption) {
	if (!dom) return;

	const prev = echarts.getInstanceByDom(dom);
	if (prev) prev.dispose();

	const chart = echarts.init(dom);
	const option = buildOption();
	const hasData = (option.series as any[]).some(s => Array.isArray(s.data) && s.data.length > 0);

	if (!hasData) {
		chart.clear();
		chart.setOption({
			graphic: {
				type: "text",
				left: "center",
				top: "middle",
				style: {
					text: "暂无数据",
					fontSize: 14,
					fill: "#999"
				}
			}
		});
	} else {
		chart.setOption(option);
	}
}

const Account: React.FC = () => {
	const [accountBalance, setAccountBalance] = useState<number>(0);
	const [selectedDateRange, setSelectedDateRange] = useState<[string, string] | null>(null);
	const [transactionData, setTransactionData] = useState<TransactionData>({
		mccGroup: [],
		merchantCountryGroup: [],
		monthGroup: []
	});

	const location = useLocation();
	const transactionChartRef = useRef<HTMLDivElement>(null);
	const mccChartRef = useRef<HTMLDivElement>(null);
	const countryChartRef = useRef<HTMLDivElement>(null);

	// 获取交易统计数据
	const getTransactionStatistics = async (startDate?: string, endDate?: string) => {
		try {
			const response = await TransactionStatisticApi({ startDate, endDate });
			setTransactionData(response);
		} catch (error) {
			console.error("获取交易统计数据失败:", error);
		}
	};

	// 获取账户余额
	const getBalance = async () => {
		try {
			const response = await GetBalanceApi();
			const balance = response.currentBalance ? parseFloat(parseFloat(response.currentBalance).toFixed(2)) : 0;
			setAccountBalance(balance);
		} catch (error) {
			console.error("无法获取账户余额:", error);
		}
	};

	useEffect(() => {
		const defaultStart = new Date();
		defaultStart.setFullYear(defaultStart.getFullYear() - 10);
		const start = defaultStart.toISOString().split("T")[0];
		const end = new Date().toISOString().split("T")[0];
		getTransactionStatistics(start, end);
		getBalance();
	}, []);

	// 统一渲染三张图表
	useEffect(() => {
		// 交易总额（柱 + 折线）
		renderChartWithNoData(transactionChartRef.current, () => ({
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "cross", crossStyle: { color: "#999" } },
				// 自定义 formatter，params 是一个数组，分别对应两个 series
				formatter: (params: any[]) => {
					// 找到交易金额的项
					const amountParam = params.find(p => p.seriesName === "交易金额");
					// 找到交易笔数的项
					const countParam = params.find(p => p.seriesName === "交易笔数");
					const date = amountParam.name; // X 轴日期
					const amount = `$${(amountParam.value as number).toLocaleString()}`;
					const count = (countParam.value as number).toLocaleString();
					return [date, `交易金额: ${amount}`, `交易笔数: ${count}`].join("<br/>");
				}
			},
			legend: { data: ["交易金额", "交易笔数"] },
			xAxis: {
				type: "category",
				data: transactionData.monthGroup.map(i => i.groupBy),
				axisPointer: { type: "shadow" }
			},
			yAxis: [
				{ type: "value", name: "交易金额", min: 0 },
				{ type: "value", name: "交易笔数", min: 0 }
			],
			series: [
				{
					name: "交易金额",
					type: "bar",
					data: transactionData.monthGroup.map(i => i.totalAmount)
				},
				{
					name: "交易笔数",
					type: "line",
					yAxisIndex: 1,
					data: transactionData.monthGroup.map(i => i.totalTransactions)
				}
			]
		}));

		// MCC 分布（饼图）
		renderChartWithNoData(mccChartRef.current, () => ({
			tooltip: {
				trigger: "item",
				formatter: (params: any) =>
					`${params.seriesName}<br/>` + `${params.name}: $${(params.value as number).toLocaleString()} (${params.percent}%)`
			},
			legend: { orient: "vertical", left: "left" },
			series: [
				{
					name: "MCC分布",
					type: "pie",
					radius: "50%",
					data: transactionData.mccGroup.map(i => ({
						value: i.totalAmount,
						name: i.groupBy
					}))
				}
			]
		}));

		// 国家分布（饼图）
		renderChartWithNoData(countryChartRef.current, () => ({
			tooltip: {
				trigger: "item",
				formatter: (params: any) =>
					`${params.seriesName}<br/>` + `${params.name}: $${(params.value as number).toLocaleString()} (${params.percent}%)`
			},
			legend: { orient: "vertical", left: "left" },
			series: [
				{
					name: "国家分布",
					type: "pie",
					radius: "50%",
					data: transactionData.merchantCountryGroup.map(i => ({
						value: i.totalAmount,
						name: COUNTRY_MAP[i.groupBy] || i.groupBy
					}))
				}
			]
		}));
	}, [transactionData]);

	// 日期筛选
	const handleDateChange = (dates: any) => {
		if (dates) {
			const [start, end] = dates;
			const formatted: [string, string] = [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")];
			setSelectedDateRange(formatted);
			getTransactionStatistics(formatted[0], formatted[1]);
		} else {
			setSelectedDateRange(null);
			const defaultStart = new Date();
			defaultStart.setFullYear(defaultStart.getFullYear() - 10);
			const start = defaultStart.toISOString().split("T")[0];
			const end = new Date().toISOString().split("T")[0];
			getTransactionStatistics(start, end);
		}
	};

	return (
		<>
			{location.pathname === "/account/recharge" ? (
				<Outlet />
			) : (
				<div className="card content-box accountWrap">
					<div className="accountInfo">
						<div className="accountBlanceWrap">
							<span className="pre">沃易卡账户余额</span>
							<span className="amount">{accountBalance >= 0 ? `$ ${accountBalance}` : `- $ ${Math.abs(accountBalance)}`}</span>
						</div>
						<Button>
							<NavLink to="/account/recharge">充值</NavLink>
						</Button>
					</div>

					<div className="accountChart">
						<div className="chartHeader" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
							<h2 style={{ fontSize: 20, margin: "0 0 8px" }}>交易金额</h2>
							<div style={{ display: "flex", alignItems: "center" }}>
								<h3 className="title" style={{ margin: 0, marginRight: 16 }}>
									时间
								</h3>
								<DatePicker.RangePicker
									style={{ width: 250 }}
									value={selectedDateRange ? [moment(selectedDateRange[0]), moment(selectedDateRange[1])] : undefined}
									onChange={handleDateChange}
								/>
							</div>
						</div>
						<div className="chartContent">
							<div ref={transactionChartRef} style={{ height: 300, marginBottom: 20 }} />
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<div style={{ width: "48%" }}>
									<div className="chartTitle">商户类别(MCC)分布</div>
									<div ref={mccChartRef} style={{ height: 400, width: "100%" }} />
								</div>
								<div style={{ width: "48%" }}>
									<div className="chartTitle">商户国家分布</div>
									<div ref={countryChartRef} style={{ height: 400, width: "100%" }} />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Account;
