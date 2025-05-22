import { PORT3 } from "@/api/config/servicePort";

import { ResultData } from "@/api/interface/index";

import { downloadCSV } from "./csv";
import http from "@/api";

interface CardData {
	key: string;
	cardName: string;
	cardOwner: string;
	cardGroup: string;
	cardNo: string;
	cardStatus: string;
	balance: string;
	createCardTime: string;
	address?: string;
	expirationDate?: string;
	cvv2?: string;
}

export interface CardTransactionRecordParams {
	where: {
		createdAt: {
			start?: string;
			end?: string;
		};
		type?: string;
		merchantName?: string;
		status?: string;
	};
	pageNum: number;
	pageSize: number;
}

export const CardInformationApi = (id: string) => {
	return http.get<ResultData>(PORT3 + "/Cards/" + id + "/details", undefined);
};

export const enableCardDetail = (params: object) => {
	return http.post<ResultData>(PORT3 + "/Auth/enableCardDetail", params);
};

export const CardbinApi = () => {
	return http.get<ResultData>(PORT3 + "/Cards/bins", undefined);
};

export const ChangeCardInformationApi = (id: string, params: CardData) => {
	return http.patch<ResultData>(PORT3 + "/Cards/" + id, params);
};

export const CardTransactionRecordApi = (id: string, params: CardTransactionRecordParams) => {
	return http.postPage<ResultData>(PORT3 + `/cards/${id}/statement/search`, params);
};

export const CardTransactionRecordCSVApi = (id: string, params: CardTransactionRecordParams) => {
	return downloadCSV(PORT3 + `/cards/${id}/statement/csv`, "CardTransactionRecord.csv", params);
};

export const CardInformationChangeRecordApi = (id: string, params: { pageNum: number; pageSize: number }) => {
	return http.get<ResultData>(PORT3 + `/audit-log/cards/${id}/change-history`, params);
};
