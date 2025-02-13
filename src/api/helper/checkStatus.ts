import { message } from "antd";

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
	switch (status) {
		case 400:
			message.error("请求失败！请您稍后重试");
			break;
		case 401:
			message.error("密码错误，请修改后重试");
			break;
		case 403:
			// message.error("当前账号无权限访问！");
			break;
		case 404:
			message.error("你所访问的资源不存在！");
			break;
		case 405:
			message.error("请求方式错误！请您稍后重试");
			break;
		case 408:
			message.error("请求超时！请您稍后重试");
			break;
		case 500:
			message.error("服务异常！");
			break;
		case 502:
			message.error("网关错误！");
			break;
		case 503:
			message.error("服务不可用！");
			break;
		case 504:
			message.error("网关超时！");
			break;
		default:
			message.error("请求失败！");
	}
};
export const checkErrorCode = (errorCode: number): void => {
	switch (errorCode) {
		case 1001:
			message.error("您的账号暂未激活，请先前往邮箱激活!");
			break;
		case 1002:
			message.error("您的账号已注销，如有疑问，请联系管理员");
			break;
		default:
			message.error("请求失败！");
	}
};
