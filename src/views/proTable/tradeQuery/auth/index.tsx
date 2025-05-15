import { useEffect, useState } from "react";
import { Button, DatePicker, Input, Select, Space, Table, TableProps, Tooltip } from "antd";
import { SearchTransactionApi, TransactionsCSVApi } from "@/api/modules/transactions";
import { SearchTransactionRequest, TransactionListItem } from "@/api/interface";
import { formatDate } from "@/utils/util";
import { useLocation } from "react-router-dom";
import { Option } from "antd/es/mentions";

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
	const intentCardId = (useLocation().state as any)?.key;
	console.log("intentCardId:", intentCardId);

	const { RangePicker } = DatePicker;
	const [transactionPage, setTransactionPage] = useState<FormattedTransaction[]>([]);

	const allCardFilters = ["cardLast4", "cardAlias", "cardId"];

	const [searchTransactionRequest, setSearchTransactionRequest] = useState<any>(
		new SearchTransactionRequest({
			where: {
				[intentCardId ? "cardId" : allCardFilters[0]]: intentCardId
			},
			sortBy: TRANSACTION_DEFAULT_SORT_FIELD,
			asc: false
		})
	);

	const [cardInput, setCardInput] = useState(intentCardId || "");
	const [cardFilterType, setCardFilterType] = useState(intentCardId ? allCardFilters[2] : allCardFilters[0]);

	const [transactionTablePageNum, setTransactionTablePageNum] = useState<number>(1);

	useEffect(() => {
		searchTransaction();
	}, [transactionTablePageNum]);

	const [transactionTableParams, setTransactionTableParams] = useState<any>({
		pagination: {
			current: transactionTablePageNum,
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
			title: "卡昵称",
			dataIndex: "cardAlias",
			key: "cardAlias",
			align: "center",
			width: "150px",
			ellipsis: false,
			wrap: true
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

	const handleTimeChange = (dates: any) => {
		let startDate = undefined;
		let endDate = undefined;
		if (dates) {
			startDate = new Date(dates[0]);
			startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
			// startDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 0, 0, 0, 0));
			startDate = new Date(startDate.getTime() - 8 * 1000 * 60 * 60);

			endDate = new Date(dates[1]);
			// endDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 23, 59, 59, 999));
			endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);
			endDate = new Date(endDate.getTime() - 8 * 1000 * 60 * 60);
		}
		setSearchTransactionRequest({
			...searchTransactionRequest,
			where: {
				...searchTransactionRequest.where,
				startDate,
				endDate
			}
		});
	};

	const handleTransactionTableChange: TableProps<FormattedTransaction>["onChange"] = (pagination, filters, sorter) => {
		console.log("handleTransactionTableChange, pagination:", pagination, "sorter:", sorter);
		const sortField = Array.isArray(sorter) ? TRANSACTION_DEFAULT_SORT_FIELD : sorter.field?.toString();
		const sortOrder = Array.isArray(sorter) ? "ascend" : sorter.order;
		setTransactionTablePageNum(pagination.current ?? 1);
		setTransactionTableParams({
			...transactionTableParams,
			pagination: {
				...transactionTableParams.pagination,
				current: pagination.current,
				pageSize: pagination.pageSize
			},
			sortField,
			sortOrder
		});
	};

	const onCardFilterChanged = (input: string, type: string) => {
		if (!type) {
			type = allCardFilters[0];
		}
		const filtersToClean = allCardFilters.filter(filter => filter !== type);

		console.log("onCardFilterChanged, input:", input, "type:", type);
		let value: string | number = input;
		if (type === "cardId") {
			value = parseInt(input);
		}
		setSearchTransactionRequest({
			...searchTransactionRequest,
			where: {
				...searchTransactionRequest.where,
				[type]: value,
				...filtersToClean.reduce((acc, filter) => {
					acc[filter] = undefined;
					return acc;
				}, {} as Record<string, undefined>)
			}
		});
	};

	const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardInput(e.target.value);
		onCardFilterChanged(e.target.value, cardFilterType);
	};

	const handleCardFilterTypeChange = (value: string) => {
		console.log("handleCardFilterTypeChange, value:", value);
		setCardFilterType(value);
		onCardFilterChanged(cardInput, value);
	};

	const searchTransaction = () => {
		const query = {
			...searchTransactionRequest,
			// pageNum: transactionTableParams.pagination?.current,
			pageNum: transactionTablePageNum,
			pageSize: transactionTableParams.pagination?.pageSize
		};

		console.log("transactionTablePageNum:", transactionTablePageNum);
		console.log("searchTransaction, query:", query);
		SearchTransactionApi(query).then(res => {
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
			await TransactionsCSVApi(searchTransactionRequest);
		} catch (e: any) {
			console.log(e);
		}
	};

	const onClickSearch = () => {
		if (transactionTablePageNum == 1) {
			searchTransaction();
		} else {
			setTransactionTablePageNum(1);
		}
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
							searchTransactionRequest.where!.merchantName = e.target.value;
							setSearchTransactionRequest({ ...searchTransactionRequest });
						}}
					/>
					<Select
						placeholder="支付状态"
						allowClear
						style={{ width: 120 }}
						onChange={value => {
							searchTransactionRequest.where!.status = value;
							setSearchTransactionRequest({ ...searchTransactionRequest });
						}}
						options={Object.entries(StatusMapping).map(([key, label]) => ({ value: key, label }))}
						className="transactionType"
					/>
					<Input.Group compact>
						<Select
							defaultValue="cardLast4"
							style={{ width: "40%" }}
							onChange={handleCardFilterTypeChange}
							value={cardFilterType}
						>
							<Option value="cardLast4">卡号</Option>
							<Option value="cardAlias">卡昵称</Option>
							<Option value="cardId">卡ID</Option>
						</Select>
						<Input style={{ width: "50%" }} onChange={handleCardInputChange} allowClear value={cardInput} />
					</Input.Group>
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
