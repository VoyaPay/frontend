import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CardTransactionRecordApi, CardTransactionRecordParams } from "@/api/modules/card";
import { formatDate } from "@/utils/util";
interface cardTransactionRecordList {
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
	const [list, setList] = useState<cardTransactionRecordList[]>([]);
	const [, setSelectedTimeRange] = useState<any[]>([]);
	const [pageObj, setPageObj] = useState<any>({
		current: 1,
		pageSize: 5,
		total: 0
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
				amount: `$${item.amount.toFixed(2)}`,
				merchantAmount: `$${item.merchantAmount.toFixed(2)}`,
				totalAmount: `$${item.totalAmount.toFixed(2)}`
			}));
			setList(list);
		});
	};

	const handleFilterChange = (key: string, value: any) => {
		setFilters(prevState => ({
			where: {
				...prevState.where,
				[key]: value
			}
		}));
	};

	const handleSearch = () => {
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
		{ title: "时间", dataIndex: "transactionTime", key: "transactionTime" },
		{ title: "交易类型", dataIndex: "type", key: "type" },
		{ title: "支付状态", dataIndex: "status", key: "status" },
		{ title: "商户名称", dataIndex: "merchantName", key: "merchantName" },
		{ title: "交易金额", dataIndex: "amount", key: "amount" },
		{ title: "授权金额", dataIndex: "merchantAmount", key: "merchantAmount" },
		{ title: "结算金额", dataIndex: "totalAmount", key: "totalAmount" },
		{ title: "授权ID", dataIndex: "orderNumber", key: "orderNumber" },
		{ title: "失败原因", dataIndex: "notes", key: "notes" }
	];

	return (
		<div>
			<div style={{ marginBottom: 20 }}>
				<RangePicker onChange={handleTimeChange} />
				<Select
					value={filters.where.type}
					onChange={value => handleFilterChange("type", value)}
					placeholder="交易类型"
					allowClear
					style={{ marginLeft: 10, width: 160 }}
				>
					<Option value="消费">消费</Option>
					<Option value="首充">首充</Option>
					<Option value="充值">充值</Option>
					<Option value="提现">提现</Option>
					<Option value="销卡">销卡</Option>
				</Select>
				<Select
					value={filters.where.status}
					onChange={value => handleFilterChange("status", value)}
					placeholder="支付状态"
					allowClear
					style={{ marginLeft: 10, width: 160 }}
				>
					<Option value="success">成功</Option>
					<Option value="failed">失败</Option>
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
			<Table
				columns={columns}
				dataSource={list.map(item => ({ ...item, key: item.id }))}
				pagination={pageObj}
				onChange={pagination => {
					setPageObj(pagination);
					fetchData();
				}}
			/>
		</div>
	);
};

export default CardTransactionRecord;
