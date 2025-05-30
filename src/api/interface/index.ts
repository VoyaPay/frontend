import { PageRequest } from "..";

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
	cardAlias: string;
}

export interface configDetail {
	id: number;
	userid: number;
	cardCreationFee: string;
	maximumCardsAllowed: number;
}
export interface Result {
	code: number;
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
	cardNumber?: number;
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

export interface UserSafeOperation {
	isVerify?: number;
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

export interface PayConfig {
	payPwd: string;
	showCardDetail: number;
	isOpen: number;
	lastShowCardTime: Date;
}
// * 登录
export namespace Login {
	export interface ReqLoginForm {
		username?: string;
		password?: string;
		verifyCode?: string;
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
		message: string;
		code: number;
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
	cardId?: number;
	cardAlias?: string;
	cardExternalId?: string;

	cardType?: string;
	startDate?: Date;
	endDate?: Date;
	status?: string;
	merchantName?: string;
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

export class SearchTransactionRequest extends PageRequest<SearchTransactionWhere> {
	sortBy?: string;
	asc: boolean = false;

	constructor(src: Partial<SearchTransactionRequest>) {
		super(src);
		Object.assign(this, src);
	}
}

export class CardsCSVRequest extends PageRequest<CardsCSVWhere> {}

export class SearchTransferWhere {
	startDate?: Date;
	endDate?: Date;
	type?: string;
	cardId?: number;
	cardExternalId?: string;
	cardLast4?: string;
	cardAlias?: string;
	externalId?: string;
}

export class SearchTransferRequest extends PageRequest<SearchTransferWhere> {}

export interface TransactionStatisticRequest {
	startDate?: string;
	endDate?: string;
}

export interface TransactionItem {
	groupBy: string;
	totalAmount: number;
	totalTransactions?: number;
}

export interface TransactionData {
	mccGroup: TransactionItem[];
	merchantCountryGroup: TransactionItem[];
	monthGroup: TransactionItem[];
}
