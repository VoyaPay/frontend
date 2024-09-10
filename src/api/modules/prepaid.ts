import { PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";
import { ResultData } from "@/api/interface/index";
import { AxiosRequestConfig } from 'axios';

import http from "@/api";

// * 获取按钮权限
export const UserCardApi = () => {
	const token = localStorage.getItem("access_token"); // 从localStorage中获取token
	console.log("Using token:", token); // 确认token被正确获取
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` // 在请求头中添加 token
	};

	return http.get<ResultData>(PORT3 + "/Cards", undefined, { headers });
};

//* add new card
export const AddCardApi = async (params: object): Promise<ResultData<any>> => {
	console.log(params);

	// 从localStorage中获取token
	const token = localStorage.getItem("access_token");
	console.log("add Using token:", token); // 确认是否正确获取了token

	if (!token) {
			throw new Error("No token found. Please login first.");
	}

	// 定义请求头
	const config: AxiosRequestConfig = {
			headers: {
					Authorization: `Bearer ${token}`, // 在Authorization头中添加token
					'Content-Type': 'application/json' // 确保内容类型为JSON
			}
	};

	// 使用封装的http实例发送POST请求
	try {
			const response = await http.post(PORT3 + `/cards`, params, config);
			return response; // 返回请求结果
	} catch (error) {
			console.error("API request failed:", error);
			throw error; // 记录错误后重新抛出
	}
};

export const RechargeCardApi= async (id:string,params:object): Promise<ResultData<any>> => {
	const token = localStorage.getItem("access_token");
	console.log("recharge card")
	console.log("add Using token:", token); // 确认是否正确获取了token
	if (!token) {
			throw new Error("No token found. Please login first.");
	}

	// 定义请求头
	const config: AxiosRequestConfig = {
			headers: {
					Authorization: `Bearer ${token}`, 
					'Content-Type': 'application/json' 
			}
	};
	try {
			const response = await http.post(PORT3 + `/cards/recharge/`+id, params, config);
			return response; // 返回请求结果
	} catch (error) {
			console.error("API request failed:", error);
			throw error; // 记录错误后重新抛出
	}
};
