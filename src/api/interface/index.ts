// * 请求响应参数(不包含data)
export interface NewRecharge {
	when?: string;
	amount: number;
	transactionId: number;
}

export interface NewTransaction {
	transferId?: number;
	newBalance?: number;
	status?: boolean;
}
export interface TransactionDetail {
	id: string;
	type: string;
	origin: string;
	amount: string;
	processedAt: string;
	externalId: string;
}

export interface TransactionListItem {
	id: string;
	orderNumber: string;
	status: string;
	// transactionTime: string;
	currencyCode: string;
	amount: string;
	merchantName: string;
	// merchantCountry: string;
	// merchantId: string;
	mcc: string;
	// merchantCity: string;
	isReversal: boolean;
	userId: number;
	// cardId: number;
	createdAt: string;
	cardNum: string;
	notes: string;
}

export interface configDetail {
	id: number;
	userid: number;
	cardCreationFee: string;
	maximumCardsAllowed: number;
}
export interface Result {
	code: string;
	msg: string;
	card?: { number: string; alias: string };
	transaction?: NewTransaction;
	currentBalance?: string;
	cvc?: string;
	expiration?: string;
	pan?: string;
	id?: number;
	fullName?: string;
	email?: string;
	companyName?: string;
	recharges?: NewRecharge;
	headers?: string;
	statusCode?: string;
	message?: string;
	bin?: string;
	balance?: number;
	userConfig: configDetail;
	number?: string;
	status?: string;
	fileID?: string;
	length?: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data?: T;
}

// * 分页响应参数
export interface ResPage<T> {
	datalist: T[];
	pageNum: number;
	pageSize: number;
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	pageNum: number;
	pageSize: number;
}

// * 登录
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		password: string;
		email?: string;
	}
	export interface ResLogin {
		access_token: string;
	}

	export interface ReqCaptcha {
		usage: string;
	}

	export interface ReqForgotPassword {
		email: string;
		captcha: string;
	}

	export interface ResAuthButtons {
		[propName: string]: any;
	}
}

export class SearchTransactionWhere {
	cardNumber?: string;
	startDate?: Date;
	endDate?: Date;
	status?: string;
	merchant?: string;
}

export interface SearchTransactionRequest extends ReqPage {
	where?: SearchTransactionWhere;
	sortBy: string;
	asc: boolean;
}

export class SearchTransferWhere {
	type?: string;
	startDate?: Date;
	endDate?: Date;
}

export interface SearchTransferRequest extends ReqPage {
	where?: SearchTransferWhere;
}
