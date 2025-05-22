import { Login, UserSafeOperation } from "@/api/interface";
import { PORT1, PORT3 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 登录模块
 */
export const loginApi = (params: Login.ReqLoginForm) => {
	return http.post<Login.ResLogin>(PORT3 + `/auth/login`, params, { isToken: false });
};

export const loginSecondVerify = (params: Login.ReqLoginForm) => {
	return http.post<Login.ResLogin>(PORT3 + `/auth/secondVerify`, params, { isToken: false });
};

export const safeOperation = (params: UserSafeOperation) => {
	return http.get<Login.ResLogin>(PORT3 + `/auth/safeOperation`, params);
};

export const registerApi = (params: Login.ReqRegister) => {
	return http.post<string>(PORT3 + `/users`, params, { isToken: false });
};

export const activateAccountApi = (params: Login.ReqActivateAccount) => {
	return http.post<string>(PORT3 + `/users/activate`, params, { isToken: false });
};

export const resetPasswordApi = (params: Login.ReqResetPassword) => {
	return http.post<string>(PORT3 + `/users/reset-password`, params, { isToken: false });
};

export const getCaptchaApi = (params: Login.ReqCaptcha) => {
	return http.get<string>(PORT3 + `/captcha`, params, { isGlobalLoading: false, isToken: false });
};

export const sendResetPasswordEmailApi = (params: Login.ReqForgotPassword) => {
	return http.post<string>(PORT3 + `/users/forgot-password`, params, { isToken: false });
};

// * 获取按钮权限
export const getAuthorButtons = () => {
	return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`);
};

// * 获取菜单列表
export const getMenuList = () => {
	return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
};
