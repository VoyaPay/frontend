import { PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";
import { ResultData } from "@/api/interface/index";

import http from "@/api";

// * 获取按钮权限
export const UserTransfersApi = () => {
	const token = localStorage.getItem("access_token"); // 从localStorage中获取token
	console.log("Using token:", token); // 确认token被正确获取
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};

	return http.get<ResultData>(PORT3 + "/Ledger", undefined, { headers });
};
