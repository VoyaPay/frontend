import { PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";
import { ResultData } from "@/api/interface/index";

import http from "@/api";

// * 获取按钮权限
export const UserTransfersApi = () => {
	const token = localStorage.getItem("access_token");
	console.log("Using token:", token); 
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};

	return http.get<ResultData>(PORT3 + "/Ledger", undefined, { headers });
};

export const GetBalanceApi=() => {
	const token = localStorage.getItem("access_token"); 
	console.log("get balance Using token:", token); 
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};
	console.log('here')

	return http.get<ResultData>(PORT3 + "/Ledger/balance", undefined, { headers });
}
