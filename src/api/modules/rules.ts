import { PORT3 } from "@/api/config/servicePort";
import { ResultData } from "@/api/interface/index";

import http from "@/api";

export interface GetRulesParams {
	where: {
		name?: string;
		trigger?: string;
	};
}

export interface PostRulesParams {
	name: string;
	rule: {
		attributes: Array<{
			name: string;
			type: string;
		}>;
		decisions: Array<{
			conditions: {
				all: Array<{
					fact: string;
					operator: string;
					value: number | number[];
				}>;
			};
			event: {
				params: {
					amount: number;
				};
				type: string;
			};
		}>;
	};
	trigger: string;
	isEnable: boolean;
}

export const GetRulesApi = (params: GetRulesParams): Promise<ResultData<any>> => {
	return http.post(PORT3 + "/rules/search", params);
};

export const DeleteRuleApi = async (id: string): Promise<ResultData<any>> => {
	return http.delete(PORT3 + `/rules/${id}`);
};

export const AddRuleApi = async (params: PostRulesParams): Promise<ResultData<any>> => {
	return http.post(PORT3 + `/rules`, params);
};

export const UpdateRuleApi = async (id: string, params: PostRulesParams): Promise<ResultData<any>> => {
	return http.put(PORT3 + `/rules/${id}`, params);
};

export const UpdateRuleStatusApi = async (id: string, isEnable: boolean): Promise<ResultData<any>> => {
	return http.patch(PORT3 + `/rules/${id}`, { isEnable });
};
