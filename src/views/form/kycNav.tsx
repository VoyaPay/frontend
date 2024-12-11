import { NavLink } from "react-router-dom";
import back from "@/assets/images/return.png";

const KycNav = () => (
	<div className="nav">
		<NavLink to="/login" className="myAccount">
			<img src={back} alt="" className="returnIcon" />
			VoyaPay{" "}
		</NavLink>
		-&gt; 入驻企业合规尽职调查表 / Compliance & KYC Form
	</div>
);

export default KycNav;
