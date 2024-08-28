// import { useEffect } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./index.less";

const Detail = () => {
	// 按钮权限
	// const { BUTTONS } = useAuthButtons();
	// const { RangePicker } = DatePicker;
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	console.log(BUTTONS);
	// }, []);

	return (
		<div className="recharge-wrap">
			<div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">预付卡 </NavLink>
				-&gt; 查看详情
				</div>
			<div className="basicInfo">
				<span className="title">基本信息</span>

			</div>
		</div>
	);
};

export default Detail;
