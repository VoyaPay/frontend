import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";

const BreadcrumbNav = (props: any) => {
	const { pathname } = useLocation();
	const { themeConfig } = props.global;

	const breadcrumbMap = [
		{
			title: "新增预充卡",
			path: "/addPrepaidCard/index",
			parentPath: "/proTable/prepaidCard",
			parentTitle: "预充卡"
		},
		{
			title: "查看详情",
			path: "/detail/index",
			parentPath: "/proTable/prepaidCard",
			parentTitle: "预充卡"
		},
		{
			title: "充值",
			path: "/prepaidRecharge/index",
			parentPath: "/proTable/prepaidCard",
			parentTitle: "预充卡"
		},
		{
			title: "提现",
			path: "/cashback/index",
			parentPath: "/proTable/prepaidCard",
			parentTitle: "预充卡"
		},
		{
			title: "充值",
			path: "/recharge/index",
			parentPath: "/proTable/account",
			parentTitle: "沃易卡账户"
		}
	];
	console.log(breadcrumbMap.find(mapItem => mapItem.path === pathname));
	const mapItem = breadcrumbMap.find(mapItem => mapItem.path === pathname);
	return (
		<>
			{themeConfig.breadcrumb && (
				<Breadcrumb>
					{mapItem ? (
						<>
							<Breadcrumb.Item key={mapItem.parentTitle} href={`#${mapItem.parentPath}`}>
								{mapItem.parentTitle}
							</Breadcrumb.Item>
							<Breadcrumb.Item key={mapItem.title} href={`#${mapItem.path}`}>
								{mapItem.title}
							</Breadcrumb.Item>
						</>
					) : null}
				</Breadcrumb>
			)}
		</>
	);
};

const mapStateToProps = (state: any) => state;
export default connect(mapStateToProps)(BreadcrumbNav);
