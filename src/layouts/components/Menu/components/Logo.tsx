import { connect } from "react-redux";
import logo from "@/assets/images/voya.png";
const Logo = () => {
	// const { isCollapse } = props;
	return (
		<div className="logo-box">
			<img src={logo} alt="logo" className="logo-img" />
			{/* {!isCollapse ? <h2 className="logo-text">Voyapay</h2> : null} */}
		</div>
	);
};

const mapStateToProps = (state: any) => state.menu;
export default connect(mapStateToProps)(Logo);
