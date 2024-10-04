import { PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";
import { ResPage, ResultData, SearchTransactionRequest, TransactionListItem } from "@/api/interface";
import axios, { AxiosResponse } from "axios";
import http from "@/api";

// * 获取按钮权限
export const UserTransactionApi = () => {
	const token = localStorage.getItem("access_token");
	console.log("Using token:", token);
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}`
	};

	return http.get<ResultData>(PORT3 + "/Transactions", undefined, { headers });
};

export const SearchTransactionApi = (req: SearchTransactionRequest) => {
	const token = localStorage.getItem("access_token");
	console.log("Using token:", token);
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}`
	};

	return http.postPage<ResultData<ResPage<TransactionListItem>>>(PORT3 + "/transactions/search", req, { headers });
};

// export function SearchTransactionApi(req: SearchTransactionRequest): Promise<ResPage<TransactionListItem>>{
// 	const token = localStorage.getItem("access_token");
// 	console.log("Using token:", token);
// 	if (!token) {
// 		throw new Error("No token found. Please login first.");
// 	}
//
// 	const headers = {
// 		Authorization: `Bearer ${token}`
// 	};
//
// 	return http.post<ResPage<TransactionListItem>>(PORT3 + "/transactions/search", req, { headers });
// };

export const TransactionsCSVApi = async (req: SearchTransactionRequest): Promise<void> => {
	const token = localStorage.getItem("access_token");
	console.log("Using token:", token);

	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}`
	};

	try {
		// Make the axios request with responseType as 'blob'
		const response: AxiosResponse<Blob> = await axios.post<Blob>(import.meta.env.VITE_API_URL + "/transactions/csv", req, {
			headers,
			responseType: "blob" // Ensure we receive a Blob response
		});

		// Create a URL for the Blob and trigger download
		const url = window.URL.createObjectURL(response.data);
		const link = document.createElement("a");
		link.href = url;

		// Set the downloaded file name
		link.setAttribute("download", "transactions.csv");

		// Append the link to the document and trigger the download
		document.body.appendChild(link);
		link.click();

		// Clean up by removing the link
		document.body.removeChild(link);
	} catch (error) {
		console.error("Error downloading the CSV file:", error);
		throw new Error("Failed to download CSV file.");
	}
};
