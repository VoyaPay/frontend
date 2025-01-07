import { CardsCSVRequest, SearchTransactionRequest } from "@/api/interface/index";
import { CardTransactionRecordParams } from "./card";
import http from "@/api";

export const downloadCSV = async (
	url: string,
	fileName: string,
	req: SearchTransactionRequest | CardsCSVRequest | CardTransactionRecordParams
): Promise<void> => {
	return http
		.post<Blob>(url, req, {
			responseType: "blob"
		})
		.then(response => {
			// @ts-ignore
			const url = window.URL.createObjectURL(response);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", fileName);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch(error => {
			console.error("Error downloading the CSV file:", error);
			throw new Error("Failed to download CSV file.");
		});
};
