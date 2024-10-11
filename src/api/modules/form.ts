import { PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";
import { ResultData } from "@/api/interface/index";

import http from "@/api";

export const createKYCapi = async (): Promise<ResultData<any>> => {
	const storedData = JSON.parse(localStorage.getItem("data") || "{}");
	const requestData = {
		email: storedData.CompanyContractInfo?.contactEmail,
		fields: storedData
	};
	// 使用封装的http实例发送POST请求
	try {
		const response = await http.post(PORT3 + `/kyc`, requestData, { headers: { "Content-Type": "application/json" } });
		return response;
	} catch (error) {
		console.error("API request failed:", error);
		throw error; // 记录错误后重新抛出
	}
};

export const KYCStateApi = (email: string) => {
	const token = localStorage.getItem("access_token");
	console.log("Using token:", token);
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};

	return http.get<ResultData>(PORT3 + "/kyc/" + email, undefined, { headers });
};
