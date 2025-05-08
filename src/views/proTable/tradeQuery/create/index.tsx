import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space, Select, TableProps, TablePaginationConfig, Tooltip } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { UserCardApi } from "@/api/modules/prepaid";
import { CardsCSVApi } from "@/api/modules/transactions";
import { formatDate } from "@/utils/util";

interface TableParams {
	pagination?: TablePaginationConfig;
	sortField?: SorterResult<any>["field"];
	sortOrder?: SorterResult<any>["order"];
}

interface FormattedCard {
	key: string;
	cardName: string;
	cardGroup: string;
	cardNo: string;
	cardStatus: string;
	balance: number;
	createCardTime: string;
	updateCardTime: string;
	cardHolderAddressStreet: string;
	cardHolderAddressCity: string;
	cardHolderAddressState: string;
	cardHolderAddressPostalCode: string;
	cardHolderAddressCountry: string;
	partnerIdempotencyKey: string;
	cardHolderName: string;
}

const TRANSACTION_DEFAULT_PAGE_SIZE = 10;

const Create = () => {
	const { RangePicker } = DatePicker;
	const [filteredData, setFilteredData] = useState<FormattedCard[]>([]);
	const [cardType, setCardType] = useState<string[]>([]);
	const [selectedTimeRange, setSelectedTimeRange] = useState<any[]>([]);
	const [cardTableParams, setCardTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: TRANSACTION_DEFAULT_PAGE_SIZE,
			showSizeChanger: false
		}
	});

	const createCardColumns: any[] = [
		{
			title: "卡昵称",
			dataIndex: "cardName",
			key: "cardName",
			align: "center",
			width: "40px", // Fixed width for this column
			ellipsis: false,
			wrap: true
		},
		{
			title: "持卡人",
			dataIndex: "cardHolderName",
			key: "cardHolderName",
			align: "center",
			width: "40px",
			render: (cardHolderName: string) => (
				<Tooltip title={cardHolderName?.length > 17 ? cardHolderName : ""}>
					{cardHolderName?.length > 17 ? `${cardHolderName.substring(0, 17)}...` : cardHolderName}
				</Tooltip>
			)
		},

		{
			title: "卡组",
			dataIndex: "cardGroup",
			key: "cardGroup",
			align: "center",
			width: "30px"
		},
		{
			title: "卡号",
			dataIndex: "cardNo",
			key: "cardNo",
			align: "center",
			width: "50px"
		},
		{
			title: "状态",
			dataIndex: "cardStatus",
			key: "cardStatus",
			align: "center",
			width: "30px",
			render: (status: string) =>
				status === "Active"
					? "活跃"
					: status === "Inactive"
					? "已冻结"
					: status === "Closed"
					? "已注销"
					: status === "PreClose"
					? "待注销"
					: "N/A"
		},
		{
			title: "余额",
			dataIndex: "balance",
			key: "balance",
			align: "center",
			width: "30px",
			sorter: (a: any, b: any) => a.balance - b.balance,
			render: (balance: number) => (balance >= 0 ? `$${balance}` : `-$${Math.abs(balance)}`)
		},
		{
			title: "开卡时间",
			dataIndex: "createCardTime",
			key: "createCardTime",
			align: "center",
			width: "50px",
			defaultSortOrder: "descend",
			sorter: (a: any, b: any) => {
				const dateA = new Date(a.createCardTime).getTime();
				const dateB = new Date(b.createCardTime).getTime();
				return dateA - dateB;
			}
		}
	];

	const handleTimeChange = (dates: any) => {
		if (dates) {
			let startDate = new Date(dates[0]);
			startDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 0, 0, 0, 0));
			let endDate = new Date(dates[1]);
			endDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 23, 59, 59, 999));
			setSelectedTimeRange([startDate, endDate]);
		}
	};

	const handleCardTypeChange = (value: string[]) => {
		setCardType(value);
	};

	const handleCardTableChange: TableProps<FormattedCard>["onChange"] = pagination => {
		setCardTableParams({
			pagination: {
				...cardTableParams.pagination,
				current: pagination.current,
				pageSize: pagination.pageSize
			}
		});
		fetchUserCards(pagination.current ?? 1, pagination.pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE);
	};

	const fetchUserCards = async (pageNum: number, pageSize: number, adjustedStart?: number, adjustedEnd?: number) => {
		try {
			const response = await UserCardApi({
				where: {
					createdAt: {
						min: adjustedStart ?? undefined,
						max: adjustedEnd ?? undefined
					}
				},
				pageNum: pageNum ?? 1,
				pageSize: pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE
			});
			setCardTableParams({
				pagination: {
					...cardTableParams.pagination,
					current: response.pageNum ?? 1,
					total: response.total ?? 0
				}
			});
			if (Array.isArray(response?.datalist)) {
				const formattedData = response?.datalist.map((card: any) => ({
					key: card.id || "",
					cardName: card.alias || "",
					cardGroup: card.network || "",
					cardNo: card.number || "",
					cardStatus: card.status || "",
					balance: card.balance || "",
					createCardTime: formatDate(card.createdAt) || "",
					updateCardTime: formatDate(card.updatedAt) || "",
					cardHolderAddressStreet: card.cardHolderAddressStreet || "",
					cardHolderAddressCity: card.cardHolderAddressCity || "",
					cardHolderAddressState: card.cardHolderAddressState || "",
					cardHolderAddressPostalCode: card.cardHolderAddressPostalCode || "",
					cardHolderAddressCountry: card.cardHolderAddressPostalCountry || "",
					partnerIdempotencyKey: card.partnerIdempotencyKey || "",
					cardHolderName: `${card.cardHolderFirstName ? card.cardHolderFirstName : "FM"} ${
						card.cardHolderLastName ? card.cardHolderLastName : "LM"
					}`
				}));
				setFilteredData(formattedData);
			}
		} catch (error) {
			console.error("Failed to fetch user cards:", error);
		}
	};

	const getCardCSV = () => {
		CardsCSVApi({
			where: {
				createdAt: {
					min: selectedTimeRange && selectedTimeRange.length > 0 ? selectedTimeRange[0] : undefined,
					max: selectedTimeRange && selectedTimeRange.length > 0 ? handleTimeFormat(selectedTimeRange[1]) : undefined
				}
			},
			pageNum: cardTableParams.pagination?.current ?? 1,
			pageSize: cardTableParams.pagination?.pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE
		});
	};

	const handleTimeFormat = (time: string) => {
		const date = new Date(time);
		date.setHours(23, 59, 59, 999);
		return date;
	};

	const applyFilters = () => {
		let adjustedStart: number | undefined = undefined;
		let adjustedEnd: number | undefined = undefined;
		if (selectedTimeRange.length > 0) {
			const [start, end] = selectedTimeRange;
			adjustedStart = start;
			adjustedEnd = end;
		}
		fetchUserCards(1, TRANSACTION_DEFAULT_PAGE_SIZE, adjustedStart, adjustedEnd);
	};

	// 组件加载时获取数据
	useEffect(() => {
		fetchUserCards(1, TRANSACTION_DEFAULT_PAGE_SIZE);
	}, []);

	return (
		<div className="create-container">
			<div className="actionWrap">
				<Space>
					<RangePicker onChange={handleTimeChange} style={{ width: 250 }} />
					<Select
						placeholder="卡片类型"
						mode="multiple"
						allowClear
						value={cardType}
						style={{ width: 120 }}
						onChange={handleCardTypeChange}
						options={[
							{ value: "PrefundCredit", label: "预充卡" },
							{ value: "Share", label: "共享卡" }
						]}
						className="transactionType"
					/>
					<Button type="primary" onClick={applyFilters}>
						查询
					</Button>
				</Space>
				<Button type="primary" onClick={getCardCSV}>
					导出开卡明细
				</Button>
			</div>
			<div className="table-container">
				<Table
					bordered={true}
					dataSource={filteredData}
					columns={createCardColumns}
					pagination={cardTableParams.pagination}
					onChange={handleCardTableChange}
				/>
			</div>
		</div>
	);
};

export default Create;
