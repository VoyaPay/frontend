import { store } from "@/redux/index";
import { searchRoute } from "@/utils/util";
import { rootRouter } from "@/routers/index";
import { HOME_URL } from "@/config/config";
import { useLocation, Navigate } from "react-router-dom";
import { AxiosCanceler } from "@/api/helper/axiosCancel";
import useLogout from "@/hooks/useLogout";
import { useEffect } from "react";
import useInactivityLogout from "@/hooks/useInactivityLogout";
import { AccountApi } from "@/api/modules/user";
import { setUserInfo } from "@/redux/modules/global/action";
import { message } from "antd";
import { useDispatch } from "react-redux";

const axiosCanceler = new AxiosCanceler();

/**
 * @description 路由守卫组件
 * */
const AuthRouter = (props: { children: JSX.Element }) => {
	const dispatch = useDispatch();
	const { pathname } = useLocation();
	const route = searchRoute(pathname, rootRouter);
	const token = store.getState().global.token;
	const logoutHandle = useLogout();
	const isActive = useInactivityLogout(20 * 60 * 1000); // 20分钟

	useEffect(() => {
		if (!isActive && token && route.meta && route.meta.requiresAuth) {
			logoutHandle();
		}
	}, [isActive]);

	axiosCanceler.removeAllPending();

	// * 判断当前路由是否需要访问权限(不需要权限直接放行)
	if (!(route.meta && route.meta.requiresAuth)) return props.children;

	// * 判断是否有Token
	if (!token) return <Navigate to="/login" replace />;

	// * Dynamic Router(动态路由，根据后端返回的菜单数据生成的一维数组)
	const dynamicRouter = store.getState().auth.authRouter;
	// * Static Router(静态路由，必须配置首页地址，否则不能进首页获取菜单、按钮权限等数据)，获取数据的时候会loading，所有配置首页地址也没问题
	const staticRouter = [HOME_URL, "/403"];
	const routerList = dynamicRouter.concat(staticRouter);
	if (routerList.indexOf(pathname) == -1) return <Navigate to="/403" />;

	const userInfo = store.getState().global.userInfo;
	if (!userInfo) {
		AccountApi()
			.then(res => {
				dispatch(setUserInfo(res));
				return props.children;
			})
			.catch(() => {
				message.error("获取用户信息失败!");
			});
		return null;
	} else {
		return props.children;
	}
};

export default AuthRouter;
