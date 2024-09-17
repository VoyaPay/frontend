// import { useState } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Button } from "antd";
import ApplySuccessImg from "@/assets/images/applySuccess.png";
import "./index.less";

const ApplySuccess = () => {

	return (
		<div className="applySuccess-wrap">
			<div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">
					预充卡{" "}
				</NavLink>
				-&gt; 新增预充卡
			</div>
			<div className="contentWrap">
				<div className="tipsWrap">
					<img src={ApplySuccessImg} alt="" className="icon" />
					<span className="tips">卡片申请成功</span>
				</div>
				<Button type="primary" className="return">
					<NavLink to="/proTable/prepaidCard" className="myAccount">
						返回
					</NavLink>
				</Button>
			</div>
		</div>
	);
};

export default ApplySuccess;
