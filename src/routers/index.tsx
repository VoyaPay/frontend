import { Navigate, useRoutes } from "react-router-dom";
// import { RouteObject } from "@/routers/interface";
import Login from "@/views/login/index";

// * 导入所有router
const metaRouters = import.meta.globEager("./modules/*.tsx");

// * 处理路由
export const routerArray: any = [];
Object.keys(metaRouters).forEach(item => {
	Object.keys(metaRouters[item]).forEach((key: any) => {
		routerArray.push(...metaRouters[item][key]);
	});
});

export const rootRouter: any = [
	{
		path: "/",
		element: <Navigate to="/login" />
	},
	{
		path: "/login",
		element: <Login loginRouterType="login" />,
		meta: {
			requiresAuth: false,
			title: "登录页",
			key: "login"
		}
	},
	{
		path: "/register",
		element: <Login loginRouterType="register" />
	},
	{
		path: "/forgotPassword",
		element: <Login loginRouterType="forgotPassword" />
	},
	{
		path: "/setNewPassword",
		element: <Login loginRouterType="setNewPassword" />
	},
	{
		path: "/setNewPasswordSuccess",
		element: <Login loginRouterType="setNewPasswordSuccess" />
	},

	...routerArray,
	{
		path: "*",
		element: <Navigate to="/404" />
	}
];

const Router = () => {
	const routes = useRoutes(rootRouter);
	return routes;
};

export default Router;
