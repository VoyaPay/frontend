import { PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";
import { ResultData } from "@/api/interface/index";

import http from "@/api";

export const createKYCapi = async (): Promise<ResultData<any>> => {
	const storedData = JSON.parse(localStorage.getItem("data") || "{}");
	const requestData = {
		email: localStorage.getItem("login_email"),
		fields: storedData
	};
	console.log("send data is " + localStorage.getItem("data"));
	// 使用封装的http实例发送POST请求
	try {
		const response = await http.post(PORT3 + `/kyc`, requestData, { headers: { "Content-Type": "application/json" } });
		return response;
	} catch (error) {
		console.error("API request failed:", error);
		throw error; // 记录错误后重新抛出
	}
};

export const KYCStateApi = () => {
	const token = localStorage.getItem("access_token");
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

export const UpdateKYCInfo = (info: any) => {
	const token = localStorage.getItem("access_token");
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};
	const requestData = {
		fields: info,
		status: "unfilled"
	};

	return http.patch<ResultData>(PORT3 + "/kyc", requestData, { headers });
};
