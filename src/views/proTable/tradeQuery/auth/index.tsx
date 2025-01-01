import { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space, Input, Select, TableProps, TablePaginationConfig, Tooltip } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { SearchTransactionApi, TransactionsCSVApi } from "@/api/modules/transactions";
import { SearchTransactionRequest, TransactionListItem } from "@/api/interface";
import { formatDate } from "@/utils/util";

interface TableParams {
	pagination?: TablePaginationConfig;
	sortField?: SorterResult<any>["field"];
	sortOrder?: SorterResult<any>["order"];
}

interface FormattedTransaction extends TransactionListItem {
	key: string;
	wrongReason?: string;
}

const TRANSACTION_DEFAULT_PAGE_SIZE = 10;
const TRANSACTION_DEFAULT_SORT_FIELD = "transactionTime";

const StatusMapping = {
	Authorized: "已授权",
	Settled: "已结算",
	Declined: "失败",
	Reversed: "退款",
	AuthDeleted: "撤销授权"
};

const CardTypeMapping = {
	PrefundCredit: "预充卡",
	Shared: "共享卡"
};

const Auth = () => {
	const { RangePicker } = DatePicker;
	const [transactionPage, setTransactionPage] = useState<FormattedTransaction[]>([]);
	const [selectedTimeRange, setSelectedTimeRange] = useState<any[]>([]);
	const [cardNoSearch, setCardNoSearch] = useState("");
	const [merchant, setMerchant] = useState("");
	const [tranStatus, setTranStatus] = useState(undefined);
	const [transactionTableParams, setTransactionTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: TRANSACTION_DEFAULT_PAGE_SIZE,
			showSizeChanger: false
		},
		sortField: TRANSACTION_DEFAULT_SORT_FIELD,
		sortOrder: "descend"
	});

	const accountColumns: any[] = [
		{
			title: "时间",
			dataIndex: TRANSACTION_DEFAULT_SORT_FIELD,
			key: TRANSACTION_DEFAULT_SORT_FIELD,
			align: "center",
			sorter: true
		},
		{
			title: "卡号",
			dataIndex: "cardNum",
			key: "cardNum",
			align: "center"
		},
		{
			title: "卡片类型",
			dataIndex: "cardType",
			key: "cardType",
			align: "center",
			width: "90px"
		},
		{
			title: "商户名称",
			dataIndex: "merchantName",
			key: "merchantName",
			align: "center"
		},
		{
			title: "支付状态",
			dataIndex: "status",
			key: "status",
			align: "center",
			width: 100
		},
		{
			title: "交易金额",
			dataIndex: "merchantAmount",
			key: "merchantAmount",
			align: "center",
			width: 120,
			sorter: true,
			render: (amount: string, row: any) => {
				if (!amount) {
					return "0";
				}
				const numericAmount = parseFloat(amount);
				const formattedAmount = numericAmount >= 0 ? `${numericAmount}` : `-${Math.abs(numericAmount)}`;
				if (row.conversionRate != 1) {
					return <Tooltip title={`汇率: ${row.conversionRate}`}>{formattedAmount + " " + row.currencyCode}</Tooltip>;
				}
				return formattedAmount + " " + row.currencyCode;
			}
		},
		{
			title: "授权金额(USD)",
			dataIndex: "amount",
			key: "amount",
			align: "center",
			sorter: true,
			render: (amount: string) => {
				if (!amount) {
					return "0";
				}
				return parseFloat(amount);
			}
		},
		{
			title: "结算金额(USD)",
			dataIndex: "totalAmount",
			key: "totalAmount",
			align: "center",
			sorter: true,
			render: (amount: string) => {
				if (!amount) {
					return "--";
				}
				return parseFloat(amount);
			}
		},
		{
			title: "授权ID",
			dataIndex: "orderNumber",
			key: "orderNumber",
			align: "center",
			render: (record: any) => {
				return record ? record : "--";
			}
		},
		{
			title: "失败原因",
			dataIndex: "wrongReason",
			key: "wrongReason",
			align: "center",
			width: "90px"
		},
		{
			title: "索引号",
			dataIndex: "id",
			key: "id",
			align: "center",
			width: "120px"
		}
	];

	useEffect(() => {
		searchTransaction(1, TRANSACTION_DEFAULT_PAGE_SIZE);
	}, []);

	const handleTimeChange = (dates: any) => {
		setSelectedTimeRange(dates ? [dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")] : []);
	};

	const handleTransactionTableChange: TableProps<FormattedTransaction>["onChange"] = (pagination, filters, sorter) => {
		const sortField = Array.isArray(sorter) ? TRANSACTION_DEFAULT_SORT_FIELD : sorter.field?.toString();
		const sortOrder = Array.isArray(sorter) ? "ascend" : sorter.order;
		setTransactionTableParams({
			pagination: {
				...transactionTableParams.pagination,
				current: pagination.current,
				pageSize: pagination.pageSize
			},
			sortField,
			sortOrder
		});
		searchTransaction(
			pagination.current ?? 1,
			pagination.pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE,
			sortField,
			sortOrder === "ascend"
		);
	};

	const searchTransaction = (
		current: number,
		pageSize: number,
		sortBy: string = TRANSACTION_DEFAULT_SORT_FIELD,
		asc: boolean = false
	) => {
		const requestBody: SearchTransactionRequest = {
			where: {
				startDate: selectedTimeRange && selectedTimeRange.length > 0 ? selectedTimeRange[0] : undefined,
				endDate: selectedTimeRange && selectedTimeRange.length > 0 ? selectedTimeRange[1] : undefined,
				status: tranStatus,
				merchantName: merchant,
				cardNumber: cardNoSearch
			},
			sortBy: sortBy,
			asc: asc,
			pageNum: current ?? 1,
			pageSize: pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE
		};
		SearchTransactionApi(requestBody).then(res => {
			const formattedData = res.datalist?.map((tran: any) => {
				const t: FormattedTransaction = {
					...tran,
					key: tran.id,
					amount: tran.amount,
					transactionTime: formatDate(tran.transactionTime),
					status: StatusMapping[tran.status as keyof typeof StatusMapping] || "--",
					cardType: CardTypeMapping[tran.cardType as keyof typeof CardTypeMapping] || "--",
					wrongReason: tran.status === "Declined" ? tran.notes : "--"
				};
				return t;
			});
			setTransactionTableParams({
				pagination: {
					...transactionTableParams.pagination,
					current: res.pageNum,
					total: res.total
				}
			});
			if (formattedData) {
				setTransactionPage(formattedData);
			}
		});
	};

	const getBillCSV = async (): Promise<void> => {
		try {
			await TransactionsCSVApi({
				where: {
					startDate: selectedTimeRange ? selectedTimeRange[0] : undefined,
					endDate: selectedTimeRange ? selectedTimeRange[1] : undefined,
					status: tranStatus,
					merchantName: merchant,
					cardNumber: cardNoSearch
				},
				sortBy: TRANSACTION_DEFAULT_SORT_FIELD,
				asc: false,
				pageNum: 1,
				pageSize: TRANSACTION_DEFAULT_PAGE_SIZE
			});
		} catch (e: any) {
			console.log(e);
		}
	};

	const onClickSearch = () => {
		setTransactionTableParams({
			pagination: {
				...transactionTableParams.pagination,
				current: 1
			}
		});
		searchTransaction(1, transactionTableParams.pagination?.pageSize ?? TRANSACTION_DEFAULT_PAGE_SIZE);
	};

	return (
		<div className="auth-container">
			<div className="actionWrap">
				<Space>
					<RangePicker onChange={handleTimeChange} style={{ width: 250 }} />
					<Input
						placeholder="商户名称"
						style={{ width: 200 }}
						onPressEnter={onClickSearch}
						allowClear
						onChange={(e: any) => {
							setMerchant(e.target.value);
						}}
					/>
					<Select
						placeholder="支付状态"
						allowClear
						style={{ width: 120 }}
						onChange={value => {
							setTranStatus(value);
						}}
						options={Object.entries(StatusMapping).map(([key, label]) => ({ value: key, label }))}
						className="transactionType"
					/>
					<Input
						placeholder="卡号"
						style={{ width: 200 }}
						value={cardNoSearch}
						onPressEnter={onClickSearch}
						allowClear
						onChange={(e: any) => {
							const value = e.target.value;
							const filteredValue = value.replace(/[^0-9*]/g, "");
							setCardNoSearch(filteredValue);
						}}
					/>
					<Button type="primary" onClick={onClickSearch}>
						查询
					</Button>
				</Space>
				<Button type="primary" onClick={getBillCSV}>
					导出账单明细
				</Button>
			</div>
			<Table
				bordered={true}
				dataSource={transactionPage}
				columns={accountColumns}
				pagination={transactionTableParams.pagination}
				onChange={handleTransactionTableChange}
			/>
		</div>
	);
};

export default Auth;
