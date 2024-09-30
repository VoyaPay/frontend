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
				}
			},
			{
				path: "/proTable/tradeQuery",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/tradeQuery/index"))),
				meta: {
					requiresAuth: true,
					title: "交易查询",
					key: "tradeQuery"
				}
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
				path: "/prepaidRecharge/index",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/prepaidRecharge/index"))),
				meta: {
					requiresAuth: true,
					title: "预付卡充值",
					key: "prepaidRecharge"
				}
			},
			{
				path: "/addPrepaidCard/index",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/addPrepaidCard/index"))),
				meta: {
					requiresAuth: true,
					title: "新增预付卡",
					key: "addPrepaidCard"
				}
			},
			{
				path: "/applySuccess/index",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/applySuccess/index"))),
				meta: {
					requiresAuth: true,
					title: "卡片申请成功",
					key: "applySuccess"
				}
			},
			{
				path: "/accountSetting/index",
				element: lazyLoad(React.lazy(() => import("@/layouts/components/Header/components/accountSetting/index"))),
				meta: {
					requiresAuth: true,
					title: "账户设置",
					key: "accountSetting"
				}
			},
			{
				path: "/compangContractInfo",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/prepaidCard/index"))),
				meta: {
					requiresAuth: true,
					title: "预付卡",
					key: "prepaidCard"
				}
			}
		]
	}
];

export default proTableRouter;
