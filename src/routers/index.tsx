import { Navigate, useRoutes } from "react-router-dom";
import Login from "@/views/login/index";
import TermsAndConditions from "@/components/RegisterFiles/TermsAndConditions";
import PrivacyPolicies from "@/components/RegisterFiles/PrivacyPolicies";

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
		path: "/activation",
		element: <Login loginRouterType="activation" />
	},
	{
		path: "/forgot-password",
		element: <Login loginRouterType="forgotPassword" />
	},
	{
		path: "/set-password",
		element: <Login loginRouterType="setPassword" />
	},
	{
		path: "/terms-and-conditions",
		element: <TermsAndConditions />
	},
	{
		path: "/privacy-policies",
		element: <PrivacyPolicies />
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
