import { Layout } from "antd";
import AvatarIcon from "./components/AvatarIcon";
import CollapseIcon from "./components/CollapseIcon";
import BreadcrumbNav from "./components/BreadcrumbNav";
// import AssemblySize from "./components/AssemblySize";
// import Language from "./components/Language";
// import Theme from "./components/Theme";
import Fullscreen from "./components/Fullscreen";
import "./index.less";
import OpeningDetail from "./components/openingDetail/openingDetail";

const LayoutHeader = () => {
	const { Header } = Layout;

	return (
		<Header>
			<div className="header-lf">
				<CollapseIcon />
				<BreadcrumbNav />
			</div>
			<div className="header-ri">
				{/* <AssemblySize /> */}
				{/* <Language /> */}
				{/* <Theme /> */}
				<Fullscreen />
				{/* <span className="username">Hooks</span> */}
				<OpeningDetail/>
				<AvatarIcon />
			</div>
		</Header>
	);
};

export default LayoutHeader;
