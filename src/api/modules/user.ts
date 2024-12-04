import { PORT3 } from "@/api/config/servicePort";
import { ResultData } from "@/api/interface/index";

import http from "@/api";

export const AccountApi = () => {
	return http.get<ResultData>(PORT3 + "/auth/me", undefined);
};

export const PasswordApi = async (params: object) => {
	return http.post<ResultData>(PORT3 + "/auth/password", params);
};
