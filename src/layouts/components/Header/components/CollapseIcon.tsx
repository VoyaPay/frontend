import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { updateCollapse } from "@/redux/modules/menu/action";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import logo from "@/assets/images/voya.png";
import "./index.less";

const CollapseIcon = (props: any) => {
	const { isCollapse, updateCollapse } = props;
	const isMobile = useMediaQuery({ maxWidth: 767 });

	useEffect(() => {
		// when isMobile, let isCollapse = true by default
		if (isMobile) {
			updateCollapse(true);
		}
	}, [isMobile, updateCollapse]);

	return (
		<div
			className="collapsed"
			onClick={() => {
				updateCollapse(!isCollapse);
			}}
		>
			{isCollapse ? <MenuUnfoldOutlined id="isCollapse" /> : <MenuFoldOutlined id="isCollapse" />}

			{isMobile && 
				(<img src={logo} alt="logo" className="logo-img-small"/>)
			}
		</div>
	);
};

const mapStateToProps = (state: any) => state.menu;
const mapDispatchToProps = { updateCollapse };
export default connect(mapStateToProps, mapDispatchToProps)(CollapseIcon);
