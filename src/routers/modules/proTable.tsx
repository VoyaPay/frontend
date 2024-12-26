import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

const proTableRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "主页面"
		},
		children: [
			{
				path: "/account",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/account/index"))),
				meta: {
					requiresAuth: true,
					title: "沃易卡账户",
					key: "account"
				},
				children: [
					{
						path: "recharge",
						element: lazyLoad(React.lazy(() => import("@/views/proTable/recharge/index"))),
						meta: {
							requiresAuth: true,
							title: "充值",
							key: "recharge"
						}
					}
				]
			},
			{
				path: "/tradeQuery",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/tradeQuery/index"))),
				meta: {
					requiresAuth: true,
					title: "交易查询",
					key: "tradeQuery"
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
				path: "/prepaidCard",
				element: lazyLoad(React.lazy(() => import("@/views/proTable/prepaidCard/index"))),
				meta: {
					requiresAuth: true,
					title: "预充卡",
					key: "prepaidCard"
				},
				children: [
					{
						path: "detail",
						element: lazyLoad(React.lazy(() => import("@/views/proTable/detail/index"))),
						meta: {
							requiresAuth: true,
							title: "查看详情",
							key: "detail"
						}
					},
					{
						path: "addPrepaidCard",
						element: lazyLoad(React.lazy(() => import("@/views/proTable/addPrepaidCard/index"))),
						meta: {
							requiresAuth: true,
							title: "新增预付卡",
							key: "addPrepaidCard"
						}
					},
					{
						path: "prepaidRecharge",
						element: lazyLoad(React.lazy(() => import("@/views/proTable/prepaidRecharge/index"))),
						meta: {
							requiresAuth: true,
							title: "预付卡充值",
							key: "prepaidRecharge"
						}
					},
					{
						path: "cashback",
						element: lazyLoad(React.lazy(() => import("@/views/proTable/cashback/index"))),
						meta: {
							requiresAuth: true,
							title: "预付卡提现",
							key: "cashback"
						}
					}
				]
			}
		]
	}
];

export default proTableRouter;
