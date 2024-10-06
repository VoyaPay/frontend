// ? 全局不动配置项 只做导出不做修改

// * 首页地址（默认）
export const HOME_URL: string = "/home/index";
export const CHARGE_URL: string = "/proTable/account";

// * Tabs（黑名单地址，不需要添加到 tabs 的路由地址，暂时没用）
export const TABS_BLACK_LIST: string[] = ["/403", "/404", "/500", "/layout", "/login", "/dataScreen"];
// * 高德地图key
export const MAP_KEY: string = "";

export const menu: any = [
	{
		icon: "HomeOutlined",
		title: "首页",
		path: "/home/index",
		hide: true
	},
	{
		icon: "CreditCardOutlined",
		title: "沃易卡账户",
		path: "/proTable/account"
	},
	{
		icon: "AreaChartOutlined",
		title: "充值",
		path: "/recharge/index",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "查看详情",
		path: "/detail/index",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "预付卡充值",
		path: "/prepaidRecharge/index",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "新增预付卡",
		path: "/addPrepaidCard/index",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "卡片申请成功",
		path: "/applySuccess/index",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "账户设置",
		path: "/accountSetting/index",
		hide: true
	},
	{
		icon: "ShoppingOutlined",
		title: "预充卡",
		path: "/proTable/prepaidCard"
	},
	{
		icon: "BugOutlined",
		title: "交易查询",
		path: "/proTable/tradeQuery"
	}
];

// 在组件外部获取 formStatus 并保证其初始化
export const formStatus = JSON.parse(localStorage.getItem('data') || '{}');

// 动态菜单配置
export const menu2: any = [
	{
		icon: "AppstoreOutlined",
		title: "企业联系人信息",
		path: "/company",
		hide: false
	},
	{
		icon: "AppstoreOutlined",
		title: "入驻企业美国主体主要信息",
		path: "/form/usEntityinfo",
		disabled: !formStatus['CompanyContractInfo'], // 如果联系人信息未填写，则禁用
		hide: false,
		meta: {
			requiresAuth: false,
			key: "usEntityinfo"
		}
	},
	{
		icon: "AppstoreOutlined",
		title: "入驻企业香港主体主要信息",
		path: "/form/hkEntityContact",
		disabled: !formStatus['CompanyContractInfo'], // 如果联系人信息未填写，则禁用
		hide: false,
		meta: {
			requiresAuth: false,
			key: "hongkongEntityContact"
		}
	},
	{
		icon: "AppstoreOutlined",
		title: "企业展业情况",
		path: "/form/companyBusiness",
		disabled: !formStatus['usEntityInfo'] || !formStatus['hkEntityInfo'], // 确保美国和香港实体信息已填写
		hide: false,
		meta: {
			requiresAuth: false,
			key: "Company Business Activities"
		}
	},
	{
		icon: "AppstoreOutlined",
		title: "开通场景信息",
		path: "/form/product",
		disabled: !formStatus['companyBusinessInfo'], // 确保展业信息已填写
		hide: false,
		meta: {
			requiresAuth: false,
			key: "Products Use Case Information"
		}
	},
	{
		icon: "AppstoreOutlined",
		title: "控股股东或实控人信息",
		path: "/form/shareholder",
		disabled: !formStatus['productsUseCaseInfo'], // 确保开通场景信息已填写
		hide: false,
		meta: {
			requiresAuth: false,
			key: "Controlling Shareholder or Actual Controller Information"
		}
	},
	{
		icon: "AppstoreOutlined",
		title: "受益所有人信息",
		path: "/form/beneficical",
		disabled: !formStatus['chineseParentCompanyInfo'], // 确保中国母公司信息已填写
		hide: false,
		meta: {
			requiresAuth: false,
			key: "Beneficial Owner Information"
		}
	},
	{
		icon: "AppstoreOutlined",
		title: "入驻企业中国母公司主要信息",
		path: "/form/chinesecompany",
		disabled: !formStatus['CompanyContractInfo'], // 确保联系人信息已填写
		hide: false,
		meta: {
			requiresAuth: false,
			key: "Chinese Parent Company Information"
		}
	}
];

