import NProgress from "@/config/nprogress";
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
import { ResPage, ResultData } from "@/api/interface";
import { ResultEnum } from "@/enums/httpEnum";
import { checkStatus } from "./helper/checkStatus";
import { AxiosCanceler } from "./helper/axiosCancel";
import { setToken } from "@/redux/modules/global/action";
import { message } from "antd";
import { store } from "@/redux";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	isGlobalLoading?: boolean;
}

interface ErrorResponse {
	message: string;
}

const axiosCanceler = new AxiosCanceler();

const config = {
	// 默认地址请求地址，可在 .env 开头文件中修改
	baseURL: import.meta.env.VITE_API_URL as string,
	// 设置超时时间（10s）
	timeout: 10000,
	// 跨域时候允许携带凭证
	// withCredentials: true
	isGlobalLoading: true
};

class RequestHttp {
	service: AxiosInstance;
	public constructor(config: AxiosRequestConfig) {
		this.service = axios.create(config);

		/**
		 * @description 请求拦截器
		 * 客户端发送请求 -> [请求拦截器] -> 服务器
		 * token校验(JWT) : 接受服务器返回的token,存储到redux/本地储存当中
		 */
		this.service.interceptors.request.use(
			(config: CustomAxiosRequestConfig) => {
				NProgress.start();
				axiosCanceler.addPending(config);
				config?.isGlobalLoading && showFullScreenLoading();
				const token: string = store.getState().global.token;
				return { ...config, headers: { ...config.headers, "x-access-token": token } };
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		/**
		 * @description 响应拦截器
		 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
		 */
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
				return data;
			},
			async (error: AxiosError) => {
				const { response } = error;
				NProgress.done();
				tryHideFullScreenLoading();
				if (response?.status === 401) {
					if (!response?.request?.responseURL.includes("/auth/login")) {
						store.dispatch(setToken(""));
						message.error("您的会话已过期，请重新登录。");
						window.location.hash = "/login";
					} else {
						checkStatus(response.status);
					}
					return Promise.reject(error);
				} else if (response && response.status >= 400 && response.status < 500) {
					message.error((response.data as ErrorResponse).message);
				} else if (response && response.status >= 500) {
					checkStatus(response.status);
				} else if (!window.navigator.onLine) window.location.hash = "/500";
				return Promise.reject(error);
			}
		);
	}

	// * 常用请求方法封装
	get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
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
