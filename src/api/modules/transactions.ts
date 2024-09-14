import { PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";
import { ResultData } from "@/api/interface/index";
import axios, { AxiosResponse } from 'axios';
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

export const TransactionsCSVApi = async (): Promise<void> => {
	const token = localStorage.getItem("access_token");
	console.log("Using token:", token);
	
	if (!token) {
	  throw new Error("No token found. Please login first.");
	}
  
	const headers = {
	  Authorization: `Bearer ${token}`,
	};
  
	try {
	  // Make the axios request with responseType as 'blob'
	  const response: AxiosResponse<Blob> = await axios.get<Blob>('http://n8wws4sc40gogwwg84og4wgc.47.253.146.52.sslip.io/ledger/csv', {
		headers,
		responseType: 'blob', // Ensure we receive a Blob response
	  });
  
	  // Create a URL for the Blob and trigger download
	  const url = window.URL.createObjectURL(response.data);
	  const link = document.createElement('a');
	  link.href = url;
  
	  // Set the downloaded file name
	  link.setAttribute('download', 'transfers.csv');
	  
	  // Append the link to the document and trigger the download
	  document.body.appendChild(link);
	  link.click();
  
	  // Clean up by removing the link
	  document.body.removeChild(link);
	} catch (error) {
	  console.error('Error downloading the CSV file:', error);
	  throw new Error('Failed to download CSV file.');
	}
  };