import { CardInformationChangeRecordApi } from "@/api/modules/card";
import { useEffect, useState } from "react";
import { Table } from "antd";
import { formatDate } from "@/utils/util";
// import { CardContext } from "@/views/proTable/detail";

interface CardInformationChangeRecordList {
	id: number;
	action: string;
	sourceType: string;
	sourceId: string;
	actionDesc: string;
	notes: string | null;
	payload: {
		alias: {
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
	// const cardData = useContext(CardContext);
	const [list, setList] = useState<CardInformationChangeRecordList[]>([]);
	const [pageObj, setPageObj] = useState<any>({
		current: 1,
		pageSize: 5,
		total: 0
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = (pageNum: number = 1, pageSize: number = 5) => {
		CardInformationChangeRecordApi(id, { pageNum, pageSize }).then((res: any) => {
			const list = res.datalist
				.filter((item: CardInformationChangeRecordList) => item.actionDesc === "UpdateCard")
				.map((item: CardInformationChangeRecordList) => ({
					...item,
					createdAt: formatDate(item.createdAt)
				}));
			setList(list);
			setPageObj({
				current: pageNum,
				pageSize,
				total: res.total
			});
		});
	};

	const columns = [
		{ title: "时间", dataIndex: "createdAt", key: "createdAt" },
		{ title: "变更项目", dataIndex: "action", key: "action" },
		{ title: "变更前", render: (record: any) => record.payload.alias.old, key: "oldAlias" },
		{ title: "变更后", render: (record: any) => record.payload.alias.new, key: "newAlias" },
		{ title: "操作人", dataIndex: "createdBy", key: "createdBy" }
	];

	return (
		<div>
			<Table
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
