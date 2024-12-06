import { NavLink } from "react-router-dom";
import back from "@/assets/images/return.png";

const KycNav = () => (
	<div className="nav">
		<NavLink to="/login" className="myAccount">
			<img src={back} alt="" className="returnIcon" />
			VoyaPay{" "}
		</NavLink>
		-&gt; KYC 填写
	</div>
);

export default KycNav;
