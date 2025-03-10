// import { useEffect, useState, useRef } from "react";
// import { Button, DatePicker } from "antd";
// import { NavLink, Outlet, useLocation } from "react-router-dom";
// import { TransactionStatisticApi } from "@/api/modules/transactions";
// import { GetBalanceApi } from "@/api/modules/ledger";
// import * as echarts from "echarts";
// import { MCC_MAP, COUNTRY_MAP } from "@/enums/transactions";
//
// import "./index.less";
//
// const Account = () => {
// 	const [accountBalance, setAccountBalance] = useState(0);
// 	const location = useLocation();
// 	const [selectedDateRange, setSelectedDateRange] = useState<[string, string] | null>(null);
//
// 	const [transactionData, setTransactionData] = useState({
// 		mccGroup: [],
// 		merchantCountryGroup: [],
// 		monthGroup: []
// 	});
//
// 	const transactionChartRef = useRef(null);
// 	const mccChartRef = useRef(null);
// 	const countryChartRef = useRef(null);
//
// 	// ✅ 获取交易统计数据
// 	const getTransactionStatistics = async (startDate?: string, endDate?: string) => {
// 		try {
// 			const response = await TransactionStatisticApi({ startDate, endDate });
//
// 			console.log("📊 交易统计完整响应:", JSON.stringify(response, null, 2));
// 			setTransactionData(response);
// 		} catch (error) {
// 			console.error("获取交易统计数据失败:", error);
// 		}
// 	};
//
// 	// ✅ 获取账户余额
// 	const getBalance = async () => {
// 		try {
// 			const response = await GetBalanceApi();
// 			const balance = response.currentBalance ? parseFloat(parseFloat(response.currentBalance).toFixed(2)) : 0;
// 			setAccountBalance(balance);
// 		} catch (error) {
// 			console.log("无法获取账户余额:", error);
// 		}
// 	};
//
// 	// ✅ 组件挂载时请求数据
// 	useEffect(() => {
// 		const defaultStartDate = new Date();
// 		defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 10);
// 		getTransactionStatistics(defaultStartDate.toISOString().split("T")[0], new Date().toISOString().split("T")[0]);
// 		getBalance();
// 	}, []);
//
// 	// ✅ 监听 `transactionData` 变化，更新图表
// 	useEffect(() => {
// 		if (transactionData.monthGroup.length > 0) {
// 			renderTransactionChart();
// 		}
// 		if (transactionData.mccGroup.length > 0) {
// 			renderMccChart();
// 		}
// 		if (transactionData.merchantCountryGroup.length > 0) {
// 			renderCountryChart();
// 		}
// 	}, [transactionData]);
//
// 	// ✅ 日期筛选
// 	const handleDateChange = (dates: any) => {
// 		if (dates) {
// 			// ✅ 选择了日期
// 			const [start, end] = dates;
// 			const formattedRange: [string, string] = [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")];
// 			setSelectedDateRange(formattedRange);
// 			console.log("📅 选择的日期范围:", formattedRange);
// 			getTransactionStatistics(formattedRange[0], formattedRange[1]);
// 		} else {
// 			// ✅ 点击清除按钮，重置为默认日期范围（最近10年）
// 			console.log("🚀 日期被清除，恢复默认查询");
// 			setSelectedDateRange(null); // 确保 UI 也能同步更新
//
// 			const defaultStartDate = new Date();
// 			defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 10);
// 			const defaultEndDate = new Date().toISOString().split("T")[0];
//
// 			getTransactionStatistics(defaultStartDate.toISOString().split("T")[0], defaultEndDate);
// 		}
// 	};
//
// 	// ✅ 确保 selectedDateRange 被使用
// 	useEffect(() => {
// 		console.log("🔍 当前选定的日期范围:", selectedDateRange);
// 	}, [selectedDateRange]);
//
// 	// ✅ 渲染 交易统计图表
// 	const renderTransactionChart = () => {
// 		if (transactionChartRef.current) {
// 			const chart = echarts.init(transactionChartRef.current);
// 			chart.setOption({
// 				tooltip: { trigger: "axis", axisPointer: { type: "cross", crossStyle: { color: "#999" } } },
// 				legend: { data: ["交易金额", "交易笔数"] },
// 				xAxis: { type: "category", data: transactionData.monthGroup.map(item => item.groupBy), axisPointer: { type: "shadow" } },
// 				yAxis: [
// 					{ type: "value", name: "交易金额", min: 0, axisLabel: { formatter: "${value}" } },
// 					{ type: "value", name: "交易笔数", min: 0 }
// 				],
// 				series: [
// 					{ name: "交易金额", type: "bar", data: transactionData.monthGroup.map(item => item.totalAmount) },
// 					{ name: "交易笔数", type: "line", yAxisIndex: 1, data: transactionData.monthGroup.map(item => item.totalTransactions) }
// 				]
// 			});
// 		}
// 	};
//
// 	// ✅ 渲染 MCC 图表
// 	const renderMccChart = () => {
// 		if (mccChartRef.current) {
// 			const chart = echarts.init(mccChartRef.current);
// 			chart.setOption({
// 				tooltip: { trigger: "item" },
// 				legend: { orient: "vertical", left: "left" },
// 				series: [
// 					{
// 						name: "MCC分布",
// 						type: "pie",
// 						radius: "50%",
// 						data: transactionData.mccGroup.map(item => ({
// 							value: item.totalAmount,
// 							name: MCC_MAP[item.groupBy] || item.groupBy
// 						})),
// 						emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" } }
// 					}
// 				]
// 			});
// 		}
// 	};
//
// 	// ✅ 渲染 商户国家分布图表
// 	const renderCountryChart = () => {
// 		if (countryChartRef.current) {
// 			const chart = echarts.init(countryChartRef.current);
// 			chart.setOption({
// 				tooltip: { trigger: "item" },
// 				legend: { orient: "vertical", left: "left" },
// 				series: [
// 					{
// 						name: "国家分布",
// 						type: "pie",
// 						radius: "50%",
// 						data: transactionData.merchantCountryGroup.map(item => ({
// 							value: item.totalAmount,
// 							name: COUNTRY_MAP[item.groupBy] || item.groupBy
// 						})),
// 						emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" } }
// 					}
// 				]
// 			});
// 		}
// 	};
//
// 	return (
// 		<>
// 			{location.pathname === "/account/recharge" ? (
// 				<Outlet />
// 			) : (
// 				<div className="card content-box accountWrap">
// 					<div className="accountInfo">
// 						<div className="accountBlanceWrap">
// 							<span className="pre">沃易卡账户余额</span>
// 							<span className="amount">{accountBalance >= 0 ? `$ ${accountBalance}` : `-$ ${Math.abs(accountBalance)}`}</span>
// 						</div>
// 						<Button>
// 							<NavLink to="/account/recharge">充值</NavLink>
// 						</Button>
// 					</div>
// 					<div className="accountChart">
// 						<div className="chartHeader">
// 							<h3 className="title">交易总额</h3>
// 							<DatePicker.RangePicker style={{ width: "200px" }} onChange={handleDateChange} />
// 						</div>
// 						<div className="chartContent">
// 							<div ref={transactionChartRef} style={{ height: "300px", marginBottom: "20px" }}></div>
// 							<div style={{ display: "flex", justifyContent: "space-between" }}>
// 								<div style={{ width: "48%" }}>
// 									<div className="chartTitle">商户类别分布</div>
// 									<div ref={mccChartRef} style={{ height: "400px", width: "100%" }}></div>
// 								</div>
// 								<div style={{ width: "48%" }}>
// 									<div className="chartTitle">商户国家分布</div>
// 									<div ref={countryChartRef} style={{ height: "400px", width: "100%" }}></div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			)}
// 		</>
// 	);
// };
//
// export default Account;
export {};
