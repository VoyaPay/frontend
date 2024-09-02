// ? 全局不动配置项 只做导出不做修改

// * 首页地址（默认）
export const HOME_URL: string = "/home/index";
export const CHARGE_URL: string = "/proTable/rechage";

// * Tabs（黑名单地址，不需要添加到 tabs 的路由地址，暂时没用）
export const TABS_BLACK_LIST: string[] = ["/403", "/404", "/500", "/layout", "/login", "/dataScreen"];

// * 高德地图key
export const MAP_KEY: string = "";

export const menu: any = [
	{
		icon: "HomeOutlined",
		title: "首页",
		path: "/home/index"
	},
	{
		icon: "AreaChartOutlined",
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
		title: "预付卡",
		path: "/proTable/prepaidCard"
	},
	{
		icon: "AreaChartOutlined",
		title: "账户查询",
		path: "/proTable/tradeQuery"
	},
	{
		icon: "AreaChartOutlined",
		title: "数据大屏",
		path: "/dataScreen/index"
	},
	{
		icon: "TableOutlined",
		title: "超级表格",
		path: "/proTable",
		children: [
			{
				icon: "AppstoreOutlined",
				path: "/proTable/useHooks",
				title: "使用 Hooks"
			},
			{
				icon: "AppstoreOutlined",
				path: "/proTable/useComponent",
				title: "使用 Component"
			}
		]
	},
	{
		icon: "FundOutlined",
		title: "Dashboard",
		path: "/dashboard",
		children: [
			{
				icon: "AppstoreOutlined",
				path: "/dashboard/dataVisualize",
				title: "数据可视化"
			},
			{
				icon: "AppstoreOutlined",
				path: "/dashboard/embedded",
				title: "内嵌页面"
			}
		]
	},
	{
		icon: "FileTextOutlined",
		title: "表单 Form",
		path: "/form",
		children: [
			{
				icon: "AppstoreOutlined",
				path: "/form/basicForm",
				title: "基础 Form"
			},
			{
				icon: "AppstoreOutlined",
				path: "/form/validateForm",
				title: "校验 Form"
			},
			{
				icon: "AppstoreOutlined",
				path: "/form/dynamicForm",
				title: "动态 Form"
			}
		]
	},
	{
		icon: "PieChartOutlined",
		title: "Echarts",
		path: "/echarts",
		children: [
			{
				icon: "AppstoreOutlined",
				path: "/echarts/waterChart",
				title: "水型图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/columnChart",
				title: "柱状图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/lineChart",
				title: "折线图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/pieChart",
				title: "饼图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/radarChart",
				title: "雷达图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/nestedChart",
				title: "嵌套环形图"
			}
		]
	},
	{
		icon: "ShoppingOutlined",
		title: "常用组件",
		path: "/assembly",
		children: [
			{
				icon: "AppstoreOutlined",
				path: "/assembly/guide",
				title: "引导页"
			},
			{
				icon: "AppstoreOutlined",
				path: "/assembly/svgIcon",
				title: "Svg 图标"
			},
			{
				icon: "AppstoreOutlined",
				path: "/assembly/selectIcon",
				title: "Icon 选择"
			},
			{
				icon: "AppstoreOutlined",
				path: "/assembly/batchImport",
				title: "批量导入数据"
			}
		]
	},
	{
		icon: "ProfileOutlined",
		title: "菜单嵌套",
		path: "/menu",
		children: [
			{
				icon: "AppstoreOutlined",
				path: "/menu/menu1",
				title: "菜单1"
			},
			{
				icon: "AppstoreOutlined",
				path: "/menu/menu2",
				title: "菜单2",
				children: [
					{
						icon: "AppstoreOutlined",
						path: "/menu/menu2/menu21",
						title: "菜单2-1"
					},
					{
						icon: "AppstoreOutlined",
						path: "/menu/menu2/menu22",
						title: "菜单2-2",
						children: [
							{
								icon: "AppstoreOutlined",
								path: "/menu/menu2/menu22/menu221",
								title: "菜单2-2-1"
							},
							{
								icon: "AppstoreOutlined",
								path: "/menu/menu2/menu22/menu222",
								title: "菜单2-2-2"
							}
						]
					},
					{
						icon: "AppstoreOutlined",
						path: "/menu/menu2/menu23",
						title: "菜单2-3"
					}
				]
			},
			{
				icon: "AppstoreOutlined",
				path: "/menu/menu3",
				title: "菜单3"
			}
		]
	},
	{
		icon: "ExclamationCircleOutlined",
		title: "错误页面",
		path: "/error",
		children: [
			{
				icon: "AppstoreOutlined",
				path: "/404",
				title: "404页面"
			},
			{
				icon: "AppstoreOutlined",
				path: "/403",
				title: "403页面"
			},
			{
				icon: "AppstoreOutlined",
				path: "/500",
				title: "500页面"
			}
		]
	},
	{
		icon: "PaperClipOutlined",
		title: "外部链接",
		path: "/link",
		children: [
			{
				icon: "AppstoreOutlined",
				path: "/link/gitee",
				title: "Gitee 仓库",
				isLink: "https://gitee.com/laramie/Hooks-Admin"
			},
			{
				icon: "AppstoreOutlined",
				path: "/link/github",
				title: "GitHub 仓库",
				isLink: "https://github.com/HalseySpicy/Hooks-Admin"
			},
			{
				icon: "AppstoreOutlined",
				path: "/link/juejin",
				title: "掘金文档",
				isLink: "https://juejin.cn/user/3263814531551816/posts"
			},
			{
				icon: "AppstoreOutlined",
				path: "/link/myBlog",
				title: "个人博客",
				isLink: "http://www.spicyboy.cn"
			}
		]
	}
];
