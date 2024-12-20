import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CardTransactionRecordApi, CardTransactionRecordCSVApi, CardTransactionRecordParams } from "@/api/modules/card";
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
	const [, setSelectedTimeRange] = useState<any[]>([]);
	const [pageObj, setPageObj] = useState<any>({
		current: 1,
		pageSize: 5,
		total: 0,
		showSizeChanger: true,
		pageSizeOptions: ["5", "10", "50", "100"]
	});
	const [filters, setFilters] = useState<CardTransactionRecordParams>({
		where: {
			createdAt: {
				start: undefined,
				end: undefined
			}
		}
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		CardTransactionRecordApi(id, filters).then((res: any) => {
			const list = res.datalist.map((item: any) => ({
				...item,
				transactionTime: formatDate(item.transactionTime),
				amount: item.amount ? parseFloat(item.amount).toFixed(2) : "",
				merchantAmount: item.merchantAmount ? parseFloat(item.merchantAmount).toFixed(2) : "",
				totalAmount: item.totalAmount ? parseFloat(item.totalAmount).toFixed(2) : "",
				status: setStatus(item.status),
				type: setType(item.type)
			}));
			setList(list);
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
				return "授权已删除";
			case "Reversed":
				return "已退款";
			case "Cancelled":
				return "已取消";
			case "Declined":
				return "已拒绝";
			case "Settled":
				return "已结算";
			default:
				return status;
		}
	};

	const handleFilterChange = (key: string, value: any) => {
		setFilters(prevState => ({
			where: {
				...prevState.where,
				[key]: value
			}
		}));
	};

	const getTransactionRecordCSV = () => {
		CardTransactionRecordCSVApi(id, filters);
	};

	const handleSearch = () => {
		setPageObj({ ...pageObj, current: 1 });
		fetchData();
	};

	const handleTimeChange = (dates: any) => {
		setSelectedTimeRange(dates ? [dates[0].valueOf(), dates[1].valueOf()] : []);
		handleFilterChange("createdAt", {
			start: dates ? dates[0].valueOf() : undefined,
			end: dates ? dates[1].valueOf() + 86399999 : undefined
		});
	};

	const columns = [
		{ title: "交易类型", dataIndex: "type", key: "type" },
		{ title: "支付状态", dataIndex: "status", key: "status" },
		{ title: "商户名称", dataIndex: "merchantName", key: "merchantName" },
		{ title: "交易金额", dataIndex: "amount", key: "amount" },
		{ title: "授权金额", dataIndex: "merchantAmount", key: "merchantAmount" },
		{ title: "结算金额", dataIndex: "totalAmount", key: "totalAmount" },
		{ title: "授权ID", dataIndex: "orderNumber", key: "orderNumber" },
		{ title: "失败原因", dataIndex: "notes", key: "notes" },
		{ title: "时间", dataIndex: "transactionTime", key: "transactionTime" }
	];

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
				<div>
					<RangePicker onChange={handleTimeChange} style={{ marginBottom: 10 }} />
					<Select
						value={filters.where.type}
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
						value={filters.where.status}
						onChange={value => handleFilterChange("status", value)}
						placeholder="支付状态"
						allowClear
						style={{ marginLeft: 10, width: 160 }}
					>
						<Option value="Authorized">已授权</Option>
						<Option value="AuthDeleted">授权已删除</Option>
						<Option value="Reversed">已退款</Option>
						<Option value="Cancelled">已取消</Option>
						<Option value="Declined">已拒绝</Option>
						<Option value="Settled">已结算</Option>
					</Select>
					<Input
						value={filters.where.merchantName}
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
				columns={columns}
				dataSource={list.map(item => ({ ...item, key: item.id }))}
				pagination={pageObj}
				scroll={{ x: 1400 }}
				onChange={pagination => {
					setPageObj(pagination);
					fetchData();
				}}
			/>
		</div>
	);
};

export default CardTransactionRecord;
