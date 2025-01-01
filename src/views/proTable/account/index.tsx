import { useEffect, useState } from "react";
import { Button, DatePicker } from "antd";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./index.less";
import { GetBalanceApi } from "@/api/modules/ledger";
import { useEcharts } from "@/hooks/useEcharts";

const Account = () => {
	const [accountBalance, setAccountBalance] = useState(0);
	const location = useLocation();
	const [transactionChartRef] = useEcharts({
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
				crossStyle: {
					color: "#999"
				}
			}
		},
		legend: {
			data: ["交易金额", "交易笔数"]
		},
		xAxis: {
			type: "category",
			data: ["1月", "2月", "3月", "4月", "5月", "6月"],
			axisPointer: {
				type: "shadow"
			}
		},
		yAxis: [
			{
				type: "value",
				name: "交易金额",
				min: 0,
				axisLabel: {
					formatter: "${value}"
				}
			},
			{
				type: "value",
				name: "交易笔数",
				min: 0
			}
		],
		series: [
			{
				name: "交易金额",
				type: "bar",
				data: [2000, 4900, 7000, 2320, 2500, 3300]
			},
			{
				name: "交易笔数",
				type: "line",
				yAxisIndex: 1,
				data: [20, 42, 71, 25, 28, 35]
			}
		]
	});

	const [mccChartRef] = useEcharts({
		tooltip: {
			trigger: "item"
		},
		legend: {
			orient: "vertical",
			left: "left"
		},
		series: [
			{
				name: "MCC分布",
				type: "pie",
				radius: "50%",
				data: [
					{ value: 1048, name: "餐饮" },
					{ value: 735, name: "购物" },
					{ value: 580, name: "交通" },
					{ value: 484, name: "娱乐" },
					{ value: 300, name: "其他" }
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)"
					}
				}
			}
		]
	});

	const [countryChartRef] = useEcharts({
		tooltip: {
			trigger: "item"
		},
		legend: {
			orient: "vertical",
			left: "left"
		},
		series: [
			{
				name: "国家分布",
				type: "pie",
				radius: "50%",
				data: [
					{ value: 1048, name: "美国" },
					{ value: 735, name: "英国" },
					{ value: 580, name: "加拿大" },
					{ value: 484, name: "澳大利亚" },
					{ value: 300, name: "其他" }
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)"
					}
				}
			}
		]
	});

	useEffect(() => {
		const fetchData = async () => {
			getBalance();
		};
		fetchData();
	}, []);

	const getBalance = async () => {
		try {
			const response = await GetBalanceApi();
			const balance = response.currentBalance ? parseFloat(parseFloat(response.currentBalance).toFixed(2)) : 0;
			setAccountBalance(balance);
		} catch (error) {
			console.log("Cannot get balance of the account:", error);
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
							<span className="amount">{accountBalance >= 0 ? `$ ${accountBalance}` : `-$ ${Math.abs(accountBalance)}`}</span>
						</div>
						<Button>
							<NavLink to="/account/recharge">充值</NavLink>
						</Button>
					</div>
					<div className="accountChart">
						<div className="chartHeader">
							<h3 className="title">交易总额</h3>
							<DatePicker.RangePicker style={{ width: "200px" }} />
						</div>
						<div className="chartContent">
							<div ref={transactionChartRef} style={{ height: "300px", marginBottom: "20px" }}></div>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<div style={{ width: "48%" }}>
									<div className="chartTitle">商户类别分布</div>
									<div ref={mccChartRef} style={{ height: "400px", width: "100%" }}></div>
								</div>
								<div style={{ width: "48%" }}>
									<div className="chartTitle">商户国家分布</div>
									<div ref={countryChartRef} style={{ height: "400px", width: "100%" }}></div>
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
