import Layout from "@/layouts/index";
import FromLayout from "@/layouts/index2"

// 懒加载 Layout
// import React from "react";
// import lazyLoad from "@/routers/utils/lazyLoad";
// const Layout = lazyLoad(React.lazy(() => import("@/layouts/index")));

/**
 * @description: default layout
 */
export const LayoutIndex = () => <Layout />;
export const LayoutForm= () => <FromLayout />
