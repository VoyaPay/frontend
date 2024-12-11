import { PORT3 } from "@/api/config/servicePort";
import { ResultData, KYCData } from "@/api/interface/index";

import http from "@/api";

export const getKYCApi = () => {
	return http.get<KYCData>(PORT3 + "/kyc", undefined);
};

export const setKYCApi = (data: any) => {
	return http.patch<ResultData>(PORT3 + "/kyc", data);
};

export const FileApi = (formData: FormData) => {
	return http.post<ResultData>(PORT3 + "/file/upload", formData);
};
