import { PORT3 } from "@/api/config/servicePort";
import { ResPage, ResultData, SearchTransactionRequest, TransactionListItem } from "@/api/interface";
import http from "@/api";

// * 获取按钮权限
export const UserTransactionApi = () => {
	return http.get<ResultData>(PORT3 + "/Transactions", undefined);
};

export const SearchTransactionApi = (req: SearchTransactionRequest) => {
	return http.postPage<ResultData<ResPage<TransactionListItem>>>(PORT3 + "/transactions/search", req);
};
export const TransactionsCSVApi = async (req: SearchTransactionRequest): Promise<void> => {
	return http
		.post<Blob>(PORT3 + "/transactions/csv", req, {
			responseType: "blob"
		})
		.then(response => {
			// @ts-ignore
			const url = window.URL.createObjectURL(response);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "transactions.csv");
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch(error => {
			console.error("Error downloading the CSV file:", error);
			throw new Error("Failed to download CSV file.");
		});
};
