// import { useState } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
// import { NavLink } from "react-router-dom";
// import { Button } from "antd";
import "./index.less";

const AccountSetting = () => {
	return (
		<div className="accountSetting-wrap">
			<div className="title">账户信息</div>
			<div className="content">
				<div className="left">
					<div className="pre">公司名称：</div>
					<div className="pre">绑定手机号：</div>
					<div className="pre">绑定邮箱：</div>
				</div>
				<div className="middle">
					<div className="pre">阿尔法有限公司</div>
					<div className="pre">136xxxxxx33333</div>
					<div className="pre">xxxx@xxxx.com</div>
				</div>
				<div className="right">
					<div className="action">修改密码</div>
					<div className="action">修改绑定手机号</div>
					<div className="action">修改绑定邮箱</div>
				</div>
			</div>
			{/* <div className="nav">
				<NavLink to="/proTable/prepaidCard" className="myAccount">
					预付卡{" "}
				</NavLink>
				-&gt; 新增预付卡
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
			</div> */}
		</div>
	);
};

export default AccountSetting;
