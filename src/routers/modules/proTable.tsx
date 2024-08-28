import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 超级表格模块
const proTableRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "表格"
		},
		children: [
			{
				path: "/proTable/account",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/account/index"))),
				meta: {
					requiresAuth: true,
					title: "沃易卡账户",
					key: "account"
				},
			},
			{
				path: "/recharge/index",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/recharge/index"))),
				meta: {
					requiresAuth: true,
					title: "充值",
					key: "recharge"
				}
			},
			{
				path: "/detail/index",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/detail/index"))),
				meta: {
					requiresAuth: true,
					title: "查看详情",
					key: "detail"
				}
			},
			{
				path: "/proTable/prepaidCard",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/prepaidCard/index"))),
				meta: {
					requiresAuth: true,
					title: "预付卡",
					key: "prepaidCard"
				}
			},
			{
				path: "/proTable/useHooks",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/useHooks/index"))),
				meta: {
					requiresAuth: true,
					title: "使用 Hooks",
					key: "useHooks"
				}
			},
			{
				path: "/proTable/useComponent",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/useComponent/index"))),
				meta: {
					requiresAuth: true,
					title: "使用 Component",
					key: "useComponent"
				}
			}
		]
	}
];

export default proTableRouter;
