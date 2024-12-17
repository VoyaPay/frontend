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
	totalBalance?: string;
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

export interface KYCData extends Result {
	createdAt?: string;
	fields?: KYCFields;
	lastUpdateAt?: string;
	status?: string;
}

export interface KYCFields extends KYCData {
	[key: string]: any;
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
	export interface ReqRegister {
		fullName: string;
		email: string;
		password: string;
		repeatPassword: string;
		companyName: string;
		captcha: string;
	}

	export interface ReqActivateAccount {
		token: string;
	}

	export interface ReqResetPassword {
		token: string;
		password: string;
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
	cardType?: string;
	startDate?: Date;
	endDate?: Date;
	status?: string;
	merchant?: string;
}

export interface CardsCSVWhere {
	ids?: number[];
	externalIds?: string[];
	last4?: string[];
	alias?: string[];
	bin?: string;
	cardType?: string;
	createdAt?: {
		min?: Date;
		max?: Date;
	};
}

export interface SearchTransactionRequest extends ReqPage {
	where?: SearchTransactionWhere;
	sortBy: string;
	asc: boolean;
}

export interface CardsCSVRequest extends ReqPage {
	where?: CardsCSVWhere;
}

export class SearchTransferWhere {
	type?: string;
	startDate?: Date;
	endDate?: Date;
}

export interface SearchTransferRequest extends ReqPage {
	where?: SearchTransferWhere;
}
