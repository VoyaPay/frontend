// import { useEffect } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import back from "@/assets/images/return.png";
import "./index.less";

const Recharge = () => {
	// 按钮权限
	// const { BUTTONS } = useAuthButtons();
	// const { RangePicker } = DatePicker;
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	console.log(BUTTONS);
	// }, []);

	return (
		// <div className="card content-box">
		// </div>
		<div className="recharge-wrap">
			<div className="nav">
				<NavLink to="/proTable/account" className="myAccount">
					<img src={back} alt="" className="returnIcon" /> 我的账户
				</NavLink>
				-&gt; 充值
			</div>
			<div className="firstCol">
				<div className="userInfo">
					<span className="title">当前登录账户</span>
					<div className="content">
						<span>登录手机号：17131354267</span>
						<span>登录邮箱: 223232323@gmail.com</span>
						<span>账户ID: 666777777</span>
						<span>客户名称: xxxxxxxxx</span>
					</div>
				</div>
				<div className="accountInfo">
					<span className="title">客户预留账户</span>
					<div className="content">
						<span>银行所在国家/地区：United States</span>
						<span className="enPre">Bank Location</span>
						<span>账户持有人姓名：Cara</span>
						<span className="enPre">Account Holder Name</span>
						<span>银行名称：JP Mongan</span>
						<span className="enPre">Bank Name</span>
						<span>9位汇款路线号码：02800024</span>
						<span className="enPre">9-Digit Routing Number</span>
						<span>银行账号：20000043421506</span>
						<span className="enPre">Bank Account Number</span>
					</div>
				</div>
			</div>
			<div className="firstCol">
				<div className="charge">
					<span className="title">充值说明</span>
					<div className="content">
						<span>
							1.
							Voyapay会根据您提供的付款账户信息为您入账，如需修改付款账户信息，请提前与专属客户经理联系，以免造成不必要的资金延误。
						</span>
						<span>2. 由于地区监管等原因，VoyaPay暂时仅接受美金充值。</span>
						<span>3. 如有充值资金在途，请耐心等待，并联系您的付款银行。</span>
						<span>4. 实际入账金额以Voyapay账户的实收金额为准。</span>
						<span>5. VoyaPay充分保障您的钱包账户资金安全，如遇以下异常请联系您的专属7*24小时客户经理。</span>
					</div>
				</div>
				<div className="accountInfo">
					<span className="title">Voyapay收款账户账户</span>
					<div className="content">
						<span>银行所在国家/地区：United States</span>
						<span className="enPre">Bank Location</span>
						<span>账户持有人姓名：Cara</span>
						<span className="enPre">Account Holder Name</span>
						<span>银行名称：JP Mongan</span>
						<span className="enPre">Bank Name</span>
						<span>9位汇款路线号码：02800024</span>
						<span className="enPre">9-Digit Routing Number</span>
						<span>银行账号：20000043421506</span>
						<span className="enPre">Bank Account Number</span>
					</div>
				</div>
			</div>
			{/* <div className="chargeTips">
				<span className="title">充值说明</span>
				<div className="content">
					<span>1. Voyapay会根据您提供的付款账户信息为您入账，如需修改付款账户信息，请提前与专属客户经理联系，以免造成不必要的资金延误</span>
					<span>2. 由于地区监管原因，VoyaPay暂时仅接受来自银行所在国家为United States的资金</span>
					<span>3. 如有充值资金在途，请耐心等待，并联系您的付款银行</span>
					<span>4. VoyaPay充分保障您的钱包账户资金安全，如遇以下异常请联系您的专属7*24小时客户经理：12345678（微信同号）</span>
					<span>&nbsp;&nbsp;a. 登录账户信息有误</span>
					<span>&nbsp;&nbsp;b. 修改付款账户信息</span>
				</div>
			</div> */}
		</div>
	);
};

export default Recharge;
