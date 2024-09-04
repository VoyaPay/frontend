import { PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";
import { ResultData } from "@/api/interface/index";

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
