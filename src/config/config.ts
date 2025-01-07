// ? 全局不动配置项 只做导出不做修改

// * 首页地址（默认）
export const HOME_URL: string = "/home/index";
export const CHARGE_URL: string = "/account";

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
		path: "/account"
	},
	{
		title: "充值",
		path: "/account/recharge",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "账户设置",
		path: "/accountSetting/index",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "成功",
		path: "/applySuccess/index",
		hide: true
	},
	{
		icon: "ShoppingOutlined",
		title: "预充卡",
		path: "/prepaidCard"
	},
	{
		icon: "AreaChartOutlined",
		title: "查看详情",
		path: "/prepaidCard/detail",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "新增预付卡",
		path: "/prepaidCard/addPrepaidCard",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "预付卡充值",
		path: "/prepaidCard/prepaidRecharge",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "预付卡提现",
		path: "/prepaidCard/cashback",
		hide: true
	},
	{
		icon: "AreaChartOutlined",
		title: "自动充值",
		path: "/prepaidCard/autoRecharge",
		hide: true
	},
	{
		icon: "BugOutlined",
		title: "交易查询",
		path: "/tradeQuery"
	}
];

// 在组件外部获取 formStatus 并保证其初始化
export const formStatus = JSON.parse(localStorage.getItem("data") || "{}");

// 动态菜单配置
export const menu2: any = [
	{
		icon: "AppstoreOutlined",
		title: "开通场景信息",
		path: "/form/product",
		hide: false
	},
	{
		icon: "AppstoreOutlined",
		title: "企业展业情况",
		path: "/form/companyBusiness",
		hide: false
	},
	{
		icon: "AppstoreOutlined",
		title: "境外入驻企业信息",
		path: "/form/hkEntityContact",
		hide: false
	},
	{
		icon: "AppstoreOutlined",
		title: "董事信息",
		path: "/form/shareholder",
		hide: false
	},
	{
		icon: "AppstoreOutlined",
		title: "受益所有人信息",
		path: "/form/beneficical",
		hide: false
	},
	{
		icon: "AppstoreOutlined",
		title: "企业负责人信息",
		path: "/company",
		hide: false
	},
	{
		icon: "AppstoreOutlined",
		title: "入驻企业母公司信息",
		path: "/form/chinesecompany",
		hide: false
	}
];
