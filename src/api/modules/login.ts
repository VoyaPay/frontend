import { Login } from "@/api/interface/index";
import { PORT1, PORT3 } from "@/api/config/servicePort";
// import { PORT1 } from "@/api/config/servicePort";
// import qs from "qs";

import http from "@/api";

/**
 * @name 登录模块
 */
// * 用户登录接口
export const loginApi = (params: Login.ReqLoginForm) => {
	return http.post<Login.ResLogin>(PORT3 + `/auth/login`, params);
};

// * 获取按钮权限
export const getAuthorButtons = () => {
	const token = localStorage.getItem("access_token"); // 从localStorage中获取token
	console.log;
	if (!token) {
		throw new Error("No token found. Please login first.");
	}
	return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {
		headers: {
			Authorization: `Bearer ${token}` // 在请求头中添加token
		}
	});
};

// * 获取菜单列表
export const getMenuList = () => {
	const token = localStorage.getItem("access_token"); // 从localStorage中获取token
	if (!token) {
		throw new Error("No token found. Please login first.");
	}
	return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`, {
		headers: {
			Authorization: `Bearer ${token}` // 在请求头中添加token
		}
	});
};
