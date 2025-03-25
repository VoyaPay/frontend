import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CardTransactionRecordApi, CardTransactionRecordCSVApi } from "@/api/modules/card";
import { formatDate } from "@/utils/util";
interface CardTransactionRecordList {
	id: string;
	cardId: number;
	type: string;
	status: null;
	transactionTime: string;
	merchantName: null;
	merchantAmount: string;
	amount: string;
	totalAmount: string;
	orderNumber: string;
	notes: string;
}

const { RangePicker } = DatePicker;
const { Option } = Select;

const CardTransactionRecord = ({ id }: { id: string }) => {
	const [list, setList] = useState<CardTransactionRecordList[]>([]);
	const [tableParams, setTableParams] = useState<any>({
		where: {
			createdAt: {
				start: undefined,
				end: undefined
			}
		},
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0
		}
	});

	useEffect(() => {
		fetchData();
	}, [tableParams.pagination.current]);

	const fetchData = () => {
		const query = {
			...tableParams,
			pageNum: tableParams.pagination.current,
			pageSize: tableParams.pagination.pageSize
		};
		CardTransactionRecordApi(id, query).then((res: any) => {
			const list = res.datalist.map((item: any) => ({
				...item,
				transactionTime: formatDate(item.transactionTime),
				amount: item.amount ? parseFloat(item.amount).toFixed(2) : "",
				merchantAmount: item.merchantAmount ? parseFloat(item.merchantAmount).toFixed(2) : "",
				totalAmount: item.totalAmount ? parseFloat(item.totalAmount).toFixed(2) : "",
				statusZh: setStatus(item.status),
				typeZh: setType(item.type)
			}));
			setTableParams({ ...tableParams, pagination: { ...tableParams.pagination, total: res.total } });
			setList(list);
			console.log(`fetched ${list.length} records for No ${tableParams.pagination.current} page `);
		});
	};

	const setType = (type: string) => {
		switch (type) {
			case "transaction":
				return "消费";
			case "cardPurchase":
				return "首充";
			case "cardTopup":
				return "充值";
			case "cardWithdrawn":
				return "提现";
			case "closeCardRefund":
				return "销卡";
			case "fee":
				return "手续费";
			default:
				return type;
		}
	};

	const setStatus = (status: string) => {
		switch (status) {
			case "Authorized":
				return "已授权";
			case "AuthDeleted":
				return "撤销授权";
			case "Reversed":
				return "已退款";
			case "Cancelled":
				return "已取消";
			case "Declined":
				return "已拒绝";
			case "Settled":
				return "已结算";
			default:
				return "--";
		}
	};

	const handleFilterChange = (key: string, value: any) => {
		setTableParams((prevState: { where: any }) => ({
			...prevState,
			where: {
				...prevState.where,
				[key]: value
			}
		}));
	};

	const getTransactionRecordCSV = () => {
		CardTransactionRecordCSVApi(id, tableParams);
	};

	const handleSearch = () => {
		if (tableParams.pagination.current === 1) {
			fetchData();
		} else {
			setTableParams((prevState: any) => ({
				...prevState,
				pagination: {
					...prevState.pagination,
					current: 1
				}
			}));
		}
		// setPageObj({ ...pageObj, current: 1 });
		// fetchData();
	};

	const handleTimeChange = (dates: any) => {
		// setSelectedTimeRange(dates ? [dates[0].valueOf(), dates[1].valueOf()] : []);
		handleFilterChange("createdAt", {
			start: dates ? dates[0].valueOf() : undefined,
			end: dates ? dates[1].valueOf() + 86399999 : undefined
		});
	};

	const handleTableParamChange = (pagination: any) => {
		console.log("about to fetch page", pagination.current);
		setTableParams((prevState: any) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				current: pagination.current,
				pageSize: pagination.pageSize
			}
		}));
		// setPageObj({ ...pageObj, current: pagination.current, pageSize: pagination.pageSize });
	};

	const columns = [
		{ title: "交易类型", render: (record: any) => record.typeZh || "--", key: "type" },
		{ title: "支付状态", render: (record: any) => record.statusZh || "--", key: "status" },
		{ title: "商户名称", render: (record: any) => record.merchantName || "--", key: "merchantName" },
		{
			title: "交易金额",
			render: (record: any) => (record.type === "transaction" ? record.merchantAmount + " " + record.currencyCode || "--" : "--"),
			key: "merchantAmount"
		},
		{
			title: "授权金额(USD)",
			render: (record: any) => (record.type === "transaction" ? record.amount || "--" : "--"),
			key: "amount"
		},
		{ title: "结算金额(USD)", render: (record: any) => record.totalAmount || "--", key: "totalAmount" },
		{
			title: "失败原因",
			render: (record: any) => {
				return record.status === "Declined" ? record.notes : "--";
			},
			key: "notes"
		},
		{ title: "时间", render: (record: any) => record.transactionTime || "--", key: "transactionTime" }
	];

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
				<div>
					<RangePicker onChange={handleTimeChange} style={{ marginBottom: 10 }} />
					<Select
						value={tableParams.where.type}
						onChange={value => handleFilterChange("type", value)}
						placeholder="交易类型"
						allowClear
						style={{ marginLeft: 10, width: 160 }}
					>
						<Option value="transaction">消费</Option>
						<Option value="cardPurchase">首充</Option>
						<Option value="cardTopup">充值</Option>
						<Option value="cardWithdrawn">提现</Option>
						<Option value="closeCardRefund">销卡</Option>
						<Option value="fee">手续费</Option>
					</Select>
					<Select
						value={tableParams.where.status}
						onChange={value => handleFilterChange("status", value)}
						placeholder="支付状态"
						allowClear
						style={{ marginLeft: 10, width: 160 }}
					>
						<Option value="Authorized">已授权</Option>
						<Option value="AuthDeleted">撤销授权</Option>
						<Option value="Reversed">已退款</Option>
						<Option value="Cancelled">已取消</Option>
						<Option value="Declined">已拒绝</Option>
						<Option value="Settled">已结算</Option>
					</Select>
					<Input
						value={tableParams.where.merchantName}
						onChange={e => handleFilterChange("merchantName", e.target.value)}
						placeholder="商户名称"
						onPressEnter={handleSearch}
						allowClear
						style={{ marginLeft: 10, width: 160 }}
					/>
					<Button icon={<SearchOutlined />} onClick={handleSearch} style={{ marginLeft: 10 }} type="primary">
						查询
					</Button>
				</div>
				<Button type="primary" style={{ float: "right" }} onClick={getTransactionRecordCSV}>
					导出卡交易明细
				</Button>
			</div>
			<Table
				bordered={true}
				columns={columns}
				dataSource={list.map(item => ({ ...item, key: item.id }))}
				pagination={tableParams.pagination}
				onChange={handleTableParamChange}
			/>
		</div>
	);
};

export default CardTransactionRecord;
