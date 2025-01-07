import { CardInformationChangeRecordApi } from "@/api/modules/card";
import { useContext, useEffect, useState } from "react";
import { Table } from "antd";
import { formatDate } from "@/utils/util";
import { CardContext } from "@/views/proTable/detail";
interface CardInformationChangeRecordList {
	id: number;
	action: string;
	sourceType: string;
	sourceId: string;
	actionDesc: string;
	notes: string | null;
	payload: {
		[k: string]: {
			new: string;
			old: string;
		};
	};
	actionUserType: string;
	createdBy: string;
	createdByIp: string;
	createdAt: string;
}

const CardInformationChangeRecord = ({ id }: { id: string }) => {
	const cardData = useContext(CardContext) || { cardName: "", cardStatus: "" };
	const [list, setList] = useState<CardInformationChangeRecordList[]>([]);
	const payloadMapping = {
		alias: "卡昵称",
		status: "状态"
	};
	const statusMapping = {
		Active: "活跃",
		Inactive: "已冻结",
		Closed: "已注销",
		PreClose: "待注销"
	};
	const [pageObj, setPageObj] = useState<any>({
		current: 1,
		pageSize: 10,
		total: 0,
		showSizeChanger: true,
		pageSizeOptions: ["10", "20", "50"]
	});

	useEffect(() => {
		fetchData();
	}, [cardData.cardName, cardData.cardStatus]);

	const fetchData = (pageNum: number = 1, pageSize: number = 10) => {
		CardInformationChangeRecordApi(id, { pageNum, pageSize }).then((res: any) => {
			const list = res.datalist
				.filter((item: CardInformationChangeRecordList) => item.actionDesc === "UpdateCard")
				.map((item: CardInformationChangeRecordList) => ({
					...item,
					createdAt: formatDate(item.createdAt),
					alias: Object.keys(item.payload)
						.map(key => payloadMapping[key as keyof typeof payloadMapping] || key)
						.join(","),
					oldAlias: Object.keys(item.payload)
						.map((key: string) => {
							if (key === "status") {
								return statusMapping[item.payload[key].old as keyof typeof statusMapping] || item.payload[key].old;
							}
							return item.payload[key].old;
						})
						.join(","),
					newAlias: Object.keys(item.payload)
						.map((key: string) => {
							if (key === "status") {
								return statusMapping[item.payload[key].new as keyof typeof statusMapping] || item.payload[key].new;
							}
							return item.payload[key].new;
						})
						.join(",")
				}));
			setList(list);
			setPageObj({
				...pageObj,
				current: pageNum,
				pageSize,
				total: res.total
			});
		});
	};

	const columns = [
		{ title: "变更项目", render: (record: any) => record.alias || "--", key: "alias" },
		{ title: "变更前", render: (record: any) => record.oldAlias || "--", key: "oldAlias" },
		{ title: "变更后", render: (record: any) => record.newAlias || "--", key: "newAlias" },
		{ title: "操作人", render: (record: any) => record.actionBy.fullName || "--", key: "createdBy" },
		{ title: "时间", dataIndex: "createdAt", key: "createdAt" }
	];

	return (
		<div>
			<Table
				bordered={true}
				columns={columns}
				dataSource={list.map(item => ({ ...item, key: item.id }))}
				pagination={pageObj}
				onChange={pagination => {
					setPageObj(pagination);
					fetchData(pagination.current, pagination.pageSize);
				}}
			/>
		</div>
	);
};

export default CardInformationChangeRecord;
