import { PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";
import { ResultData, SearchTransferRequest } from "@/api/interface/index";
import axios, { AxiosResponse } from "axios";
import http from "@/api";

// * 获取按钮权限
export const UserTransfersApi = () => {
	const token = localStorage.getItem("access_token");
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}`
	};
	return http.get<ResultData>(PORT3 + "/ledger", undefined, { headers });
};

export const GetBalanceApi = () => {
	const token = localStorage.getItem("access_token");
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};

	return http.get<ResultData>(PORT3 + "/Ledger/balance", undefined, { headers });
};

export const LedgerCSVApi = async (req: SearchTransferRequest): Promise<void> => {
	const token = localStorage.getItem("access_token");

	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}`
	};

	try {
		// Make the axios request with responseType as 'blob'
		const response: AxiosResponse<Blob> = await axios.post<Blob>(import.meta.env.VITE_API_URL + "/ledger/csv", req, {
			headers,
			responseType: "blob" // Ensure we receive a Blob response
		});

		// Create a URL for the Blob and trigger download
		const url = window.URL.createObjectURL(response.data);
		const link = document.createElement("a");
		link.href = url;

		// Set the downloaded file name
		link.setAttribute("download", "transfers.csv");

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
