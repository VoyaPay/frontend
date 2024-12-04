import { PORT3 } from "@/api/config/servicePort";
import { ResultData } from "@/api/interface/index";

import http from "@/api";

// * 获取按钮权限
export const UserCardApi = () => {
	return http.get<ResultData>(PORT3 + "/Cards", undefined);
};

export const AddCardApi = async (params: object): Promise<ResultData<any>> => {
	try {
		const response = await http.post(PORT3 + `/cards`, params, { headers: { "Content-Type": "application/json" } });
		return response;
	} catch (error) {
		console.error("API request failed:", error);
		throw error;
	}
};

export const RechargeCardApi = async (id: string, params: object): Promise<ResultData<any>> => {
	try {
		const response = await http.post(PORT3 + `/cards/recharge/` + id, params, {
			headers: { "Content-Type": "application/json" }
		});
		return response;
	} catch (error) {
		console.error("API request failed:", error);
		throw error;
	}
};
