import { PORT3 } from "@/api/config/servicePort";
import {
	CardsCSVRequest,
	ResPage,
	ResultData,
	SearchTransactionRequest,
	TransactionData,
	TransactionListItem,
	TransactionStatisticRequest
} from "@/api/interface";
import http from "@/api";
import { downloadCSV } from "./csv";

// * 获取按钮权限
export const UserTransactionApi = () => {
	return http.get<ResultData>(PORT3 + "/Transactions", undefined);
};

export const SearchTransactionApi = (req: SearchTransactionRequest) => {
	return http.postPage<ResultData<ResPage<TransactionListItem>>>(PORT3 + "/transactions/search", req);
};

export const TransactionsCSVApi = async (req: SearchTransactionRequest): Promise<void> => {
	return downloadCSV(PORT3 + "/transactions/csv", "bills.csv", req);
};

export const CardsCSVApi = async (req: CardsCSVRequest): Promise<void> => {
	return downloadCSV(PORT3 + "/cards/csv", "cards.csv", req);
};

export const TransactionStatisticApi = (req: TransactionStatisticRequest) => {
	return http.post<ResultData<TransactionData>>(PORT3 + "/transactions/statistics", {}, { params: req });
};
