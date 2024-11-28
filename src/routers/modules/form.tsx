import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutForm } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";
import CompangContractInfo from "@/views/form/compangContractInfo/index";
// import usEntityInfo from "@/views/form/usEntityinfo";

// 表单 Form 模块
const formRouter: Array<RouteObject> = [
	{
		element: <LayoutForm />,
		meta: {
			title: "表单 Form"
		},
		children: [
			{
				path: "/company",
				element: <CompangContractInfo />,
				meta: {
					requiresAuth: false,
					title: "企业联系人信息",
					key: "companyContractInfo"
				}
			},
			{
				path: "/form/usEntityinfo",
				element: lazyLoad(React.lazy(() => import("@/views/form/usEntityinfo"))),
				meta: {
					requiresAuth: false,
					title: "入驻企业美国主体主要信息",
					key: "usEntityinfo"
				}
			},
			{
				path: "/form/hkEntityContact",
				element: lazyLoad(React.lazy(() => import("@/views/form/hkEntityinfo"))),
				meta: {
					requiresAuth: false,
					title: "入驻企业香港主体主要信息",
					key: "hongkongEntityContact"
				}
			},
			{
				path: "/form/companyBusiness",
				element: lazyLoad(React.lazy(() => import("@/views/form/companyBusinessinfo"))),
				meta: {
					requiresAuth: false,
					title: "企业展业情况",
					key: "Company Business Activities"
				}
			},
			{
				path: "/form/product",
				element: lazyLoad(React.lazy(() => import("@/views/form/productsUseCaseinfo"))),
				meta: {
					requiresAuth: false,
					title: "开通场景信息",
					key: "Products Use Case Information"
				}
			},
			{
				path: "/form/shareholder",
				element: lazyLoad(React.lazy(() => import("@/views/form/controllingShareholderinfo"))),
				meta: {
					requiresAuth: false,
					title: "控股股东或实控人信息",
					key: "Controlling Shareholder or Actual Controller Information"
				}
			},
			{
				path: "/form/beneficical",
				element: lazyLoad(React.lazy(() => import("@/views/form/beneficialOwnerinfo"))),
				meta: {
					requiresAuth: false,
					title: "受益所有人信息",
					key: "Beneficial Owner Information"
				}
			},
			{
				path: "/form/chinesecompany",
				element: lazyLoad(React.lazy(() => import("@/views/form/chineseParentCompanyinfo"))),
				meta: {
					requiresAuth: false,
					title: "入驻企业中国母公司主要信息",
					key: "Chinese Parent Company Information"
				}
			},
			{
				path: "/form/kycprocess",
				element: lazyLoad(React.lazy(() => import("@/views/form/kycprocess"))),
				meta: {
					requiresAuth: false,
					title: "kyc审核中",
					key: "KycProcess"
				}
			},

		]
	}
];

export default formRouter;
