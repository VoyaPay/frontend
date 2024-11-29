import { NavLink } from "react-router-dom";
import { Button } from "antd";
import ApplySuccessImg from "@/assets/images/applySuccess.png";
import "./index.less";

const KycProcess = () => {
	return (
		<div className="applySuccess-wrap">
			<div className="contentWrap">
				<div className="tipsWrap">
					<img src={ApplySuccessImg} alt="" className="icon" />
					<span className="tips">您提交的 kyc 信息需要修改</span>
				</div>
				<div className="buttonWrap">
					<Button type="primary" className="return" style={{ marginRight: "10px" }}>
						<NavLink to="/company" className="myAccount">
							修改
						</NavLink>
					</Button>
					<Button type="primary" className="return">
						<NavLink to="/login" className="myAccount">
							返回
						</NavLink>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default KycProcess;
