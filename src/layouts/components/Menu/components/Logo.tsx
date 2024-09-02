import { connect } from "react-redux";
import logo from "@/assets/images/voya.png";
const Logo = (props: any) => {
	const { isCollapse } = props;
	return (
		<div className="logo-box">
			{!isCollapse ? (
				<img src={logo} alt="logo" className="logo-img" />
			) : (
				<img src={logo} alt="logo" className="logo-img-small" />
			)}
		</div>
	);
};

const mapStateToProps = (state: any) => state.menu;
export default connect(mapStateToProps)(Logo);
