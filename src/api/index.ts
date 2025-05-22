import NProgress from "@/config/nprogress";
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
import { ResPage, ResultData } from "@/api/interface";
import { ResultEnum } from "@/enums/httpEnum";
import { checkErrorCode, checkStatus } from "./helper/checkStatus";
import { AxiosCanceler } from "./helper/axiosCancel";
import { setToken } from "@/redux/modules/global/action";
import { message } from "antd";
import { store } from "@/redux";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	isGlobalLoading?: boolean;
}

interface ErrorResponse {
	message: string;
	errorCode: number;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	isGlobalLoading?: boolean;
	isToken?: boolean;
}

interface ErrorResponse {
	message: string;
}

export class PageRequest<T> {
	where?: T = {} as T;
	pageNum: number = 1;
	pageSize: number = 10;

	constructor(src: Partial<PageRequest<T>>) {
		Object.assign(this, src);
	}
}

export class PageResponse<T> {
	datalist: T[] = [];
	total: number = 0;
	pageNum: number = 1;
	pageSize: number = 10;
	totalPage: number = 0;

	constructor(src: Partial<PageResponse<T>>) {
		Object.assign(this, src);
	}
}

const axiosCanceler = new AxiosCanceler();

const config = {
	baseURL: import.meta.env.VITE_API_URL as string,
	timeout: 60000,
	isGlobalLoading: true,
	isToken: true
};

class RequestHttp {
	service: AxiosInstance;
	public constructor(config: AxiosRequestConfig) {
		this.service = axios.create(config);

		this.service.interceptors.request.use(
			(config: CustomAxiosRequestConfig) => {
				NProgress.start();
				axiosCanceler.addPending(config);
				config?.isGlobalLoading && showFullScreenLoading();
				const token: string = store.getState().global.token;
				if (config?.isToken) {
					const Authorization = `Bearer ${token}`;
					return { ...config, headers: { ...config.headers, Authorization } };
				}
				return { ...config };
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				const { data, config } = response;
				NProgress.done();
				axiosCanceler.removePending(config);
				tryHideFullScreenLoading();
				if (data.code && data.code !== ResultEnum.SUCCESS) {
					message.error(data.msg);
					return Promise.reject(data);
				}
				return Promise.resolve(data);
			},
			async (error: AxiosError) => {
				const response = error.response;
				NProgress.done();
				tryHideFullScreenLoading();
				if (response?.status === 0) {
					message.error("网络无响应或已超时");
				} else if (response?.status === 401) {
					if (!response?.request?.responseURL.includes("/auth/login")) {
						store.dispatch(setToken(""));
						message.error("您的会话已过期，请重新登录。");
						window.location.hash = "/login";
					} else {
						checkStatus(response.status);
					}
				} else if (response && response.status >= 400 && response.status < 500) {
					const errorData = response.data as ErrorResponse;
					if ([1001, 1002].includes(errorData.errorCode)) {
						checkErrorCode(errorData.errorCode);
					} else if (errorData.errorCode === 11005) {
						message.error("卡片余额与WEX系统不一致，无法注销。");
						return Promise.reject(errorData.message);
					}
					message.error(errorData.message);
					return Promise.reject(errorData.message);
				} else if (response && response.status >= 500) {
					checkStatus(response.status);
				} else if (!window.navigator.onLine) window.location.hash = "/500";
				return Promise.reject(error.response?.data);
			}
		);
	}

	get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object | null, _object = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _object);
	}
	postPage<T>(url: string, params?: object, _object = {}): Promise<ResPage<T>> {
		return this.service.post(url, params, _object);
	}
	put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.put(url, params, _object);
	}
	delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
		return this.service.delete(url, { params, ..._object });
	}
	patch<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.patch(url, params, _object);
	}
}

export default new RequestHttp(config);
