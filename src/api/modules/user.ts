import { PORT3 } from "@/api/config/servicePort";
import { PayConfig, ResultData } from "@/api/interface";

import http from "@/api";

export const AccountApi = () => {
	return http.get<ResultData>(PORT3 + "/auth/me", undefined);
};

export const PasswordApi = async (params: object) => {
	return http.post<ResultData>(PORT3 + "/auth/password", params);
};

export const findPayConfig = () => {
	return http.get<PayConfig>(PORT3 + "/auth/findPayConfig", undefined);
};

export const sendPayConfigEmailCode = () => {
	return http.get<ResultData>(PORT3 + "/auth/sendEmailCode", undefined);
};
