import { PORT3 } from "@/api/config/servicePort";
import { ResultData, KYCData } from "@/api/interface/index";

import http from "@/api";

export const getKYCApi = () => {
	const token = localStorage.getItem("access_token");
	if (!token) {
		throw new Error("No token found. Please login first.");
	}
	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};

	return http.get<KYCData>(PORT3 + "/kyc", undefined, { headers });
};

export const setKYCApi = (data: any) => {
	const token = localStorage.getItem("access_token");
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};

	return http.patch<ResultData>(PORT3 + "/kyc", data, { headers });
};

export const KYCStateApi = () => {
	const token = localStorage.getItem("access_token");
	console.log("Using token:", token);
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};

	return http.get<ResultData>(PORT3 + "/kyc", undefined, { headers });
};

export const FileApi = (formData: FormData) => {
	return http.post<ResultData>(PORT3 + "/file/upload", formData);
};
