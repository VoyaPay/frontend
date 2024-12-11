import { PORT3 } from "@/api/config/servicePort";
import { ResultData, SearchTransferRequest } from "@/api/interface/index";
import http from "@/api";

// * 获取按钮权限
export const UserTransfersApi = () => {
	return http.get<ResultData>(PORT3 + "/ledger", undefined);
};

export const GetBalanceApi = () => {
	return http.get<ResultData>(PORT3 + "/Ledger/balance", undefined);
};

export const GetTotalBalanceApi = () => {
	return http.get<ResultData>(PORT3 + "/cards/totalBalance", undefined);
};

export const LedgerCSVApi = async (req: SearchTransferRequest): Promise<void> => {
	return http
		.post<Blob>(PORT3 + "/ledger/csv", req, {
			responseType: "blob"
		})
		.then(response => {
			// @ts-ignore
			const url = window.URL.createObjectURL(response);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "transfers.csv");
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch(error => {
			console.error("Error downloading the CSV file:", error);
			throw new Error("Failed to download CSV file.");
		});
};
