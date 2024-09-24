// * 请求响应参数(不包含data)
export interface NewRecharge {
	when?: string,
    amount: number,
    transactionId: number,
}

export interface NewTransaction{
	transferId?: number;
	newBalance?:number;
	status?:boolean;
}
export interface TransactionDetail {
  id: string;
  type: string;
  origin: string;
  amount: string;
  processedAt: string;
  externalId: string;
	
}
export interface Result{
	code: string;
	msg: string;
	card?: object;
	transaction?: NewTransaction;
	currentBalance?: string;
	cvc?:string;
	expiration?: string;
	pan?:string;
	id?: number,
	fullName?: string,
	email?: string,
	companyName?: string
	recharges?: NewRecharge
	headers?: string,
	statusCode?: string,
	message?: string, 
	bin?: string,
	balance?:number

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
	}
	export interface ResLogin {
		access_token: string;
	}
	export interface ResAuthButtons {
		[propName: string]: any;
	}
}
