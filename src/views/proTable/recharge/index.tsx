// import { useEffect } from "react";
// import { Breadcrumb } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import back from "@/assets/images/return.png";
import "./index.less";
// const Authname = localStorage.getItem("username");
const Authemail = localStorage.getItem("useremail");
const Authid= localStorage.getItem("userid");
const Authcompany= localStorage.getItem("companyName");

const Recharge = () => {

	return (
		// <div className="card content-box">
		// </div>
		<div className="recharge-wrap">
			<div className="nav">
				<NavLink to="/proTable/account" className="myAccount">
					<img src={back} alt="" className="returnIcon" />
					我的账户
				</NavLink>
				-&gt; 充值
			</div>
			<div className="firstCol">
			
				<div className="userInfo">
					<span className="title">当前登录账户</span>
					<div className="content">
					<div className="left">
						<div className="pre">登录手机号:</div>
						<div className="pre">登录邮箱:</div>
						<div className="pre">账户ID: </div>
						<div className="pre">公司名称：</div>
					</div>
					<div className="middle">
						<div className="pre">17131354267</div>
						<div className="pre">{Authemail}</div>
						<div className="pre">{Authid}</div>
						<div className="pre">{Authcompany}</div>
					
					</div>
					</div>
					
				</div>
				<div className="accountInfo">
					<span className="title">Voyapay收款账户</span>
					<div className="content">
						<div className="left">
							<div className="pre">
								<div className="sub-pre">银行所在国家/地区：</div>
								<div className="sub-pre">Bank Location:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">账户持有人姓名:</div>
								<div className="sub-pre">Account Holder Name:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">银行名称:</div>
								<div className="sub-pre">Bank Name:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">9位汇款路线号码:</div>
								<div className="sub-pre">9-Digit Routing Number:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">银行账号:</div>
								<div className="sub-pre">Bank Account Number:</div>
							</div>
						</div>
						<div className="middle">
							<div className="pre">United States</div>
							<div className="pre">Cara</div>
							<div className="pre">JP Mongan</div>
							<div className="pre">02800024</div>
							<div className="pre">20000043421506</div>
						</div>
					</div>
				</div>

			</div>
			<div className="chargeTips">
				<span className="title">充值说明</span>
				<div className="content">
					<span className="pre">
						&nbsp;&nbsp;&nbsp;&nbsp;1.
						Voyapay会根据您提供的付款账户信息为您入账，如需修改付款账户信息，请提前与专属客户经理联系，以免造成不必要的资金延误。
					</span>
					<span className="pre">&nbsp;&nbsp;&nbsp;&nbsp;2. 由于地区监管等原因，VoyaPay暂时仅接受美金充值。</span>
					<span className="pre">&nbsp;&nbsp;&nbsp;&nbsp;3. 如有充值资金在途，请耐心等待，并联系您的付款银行。</span>
					<span className="pre">&nbsp;&nbsp;&nbsp;&nbsp;4. 实际入账金额以Voyapay账户的实收金额为准。</span>
					<span className="pre">
						&nbsp;&nbsp;&nbsp;&nbsp;5. VoyaPay充分保障您的钱包账户资金安全，如遇异常请联系您的专属7*24小时客户经理团队。
					</span>
				</div>
			</div>
		</div>
	);
};

export default Recharge;