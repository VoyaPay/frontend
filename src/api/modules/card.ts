import { PORT3 } from "@/api/config/servicePort";

import { ResultData } from "@/api/interface/index";

import http from "@/api";

interface CardData {
  key: string,
	cardName: string,
	cardOwner: string,
	cardGroup: string,
	cardNo: string, 
	cardStatus: string,
	banlance: string, 
	createCardTime: string,
	address?:string,
	expirationDate?:string,
	cvv2?:string,
}

export const CardInformationApi = (id: string) => {
	const token = localStorage.getItem("access_token"); 
	console.log("Using token:", token); 
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` 
	};

	return http.get<ResultData>(PORT3 + "/Cards/"+id+ "/details", undefined, { headers });
};

export const ChangeCardInformationApi= (id:string, params:CardData) =>{
	console.log(params);
	const token = localStorage.getItem("access_token"); 
	console.log("Using token:", token); 
	if (!token) {
		throw new Error("No token found. Please login first.");
	}

	const headers = {
		Authorization: `Bearer ${token}` 
	};

	return http.patch<ResultData>(PORT3 + "/Cards/"+id, params, { headers});

}

