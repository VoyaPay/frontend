import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { rootRouter } from "@/routers";
import React from "react";

const BreadcrumbNav = (props: any) => {
	const { pathname } = useLocation();
	const { themeConfig } = props.global;
	const mainRouter = rootRouter.find((item: any) => item.meta?.title === "主页面")?.children;
	const routerPath = pathname.split("/");
	const renderBreadcrumb = (router: any) => {
		const fullPath = `/${routerPath.filter(Boolean).join("/")}`;
		if (fullPath.startsWith(router.path)) {
			// if (routerPath.includes(router.path.split("/").pop())) {
			return (
				<React.Fragment key={router.path}>
					<Breadcrumb.Item
						href={router.children ? `#${router.path}` : undefined}
						className={routerPath.includes(router.path.split("/").pop()) ? "ant-breadcrumb-link-active" : ""}
					>
						{router.meta?.title}
					</Breadcrumb.Item>
					{router.children && router.children.map((child: any) => renderBreadcrumb(child))}
				</React.Fragment>
			);
		}
		return null;
	};
	return (
		<>
			{themeConfig.breadcrumb && (
				<Breadcrumb>{mainRouter ? <>{mainRouter.map((router: any) => renderBreadcrumb(router))}</> : null}</Breadcrumb>
			)}
		</>
	);
};

const mapStateToProps = (state: any) => state;
export default connect(mapStateToProps)(BreadcrumbNav);
