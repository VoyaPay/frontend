import { PORT3 } from "@/api/config/servicePort";

import { ResultData } from "@/api/interface/index";

import http from "@/api";

interface CardData {
	key: string;
	cardName: string;
	cardOwner: string;
	cardGroup: string;
	cardNo: string;
	cardStatus: string;
	balance: string;
	createCardTime: string;
	address?: string;
	expirationDate?: string;
	cvv2?: string;
}

export const CardInformationApi = (id: string) => {
	return http.get<ResultData>(PORT3 + "/Cards/" + id + "/details", undefined);
};

export const CardbinApi = () => {
	return http.get<ResultData>(PORT3 + "/Cards/bins", undefined);
};

export const ChangeCardInformationApi = (id: string, params: CardData) => {
	return http.patch<ResultData>(PORT3 + "/Cards/" + id, params);
};
