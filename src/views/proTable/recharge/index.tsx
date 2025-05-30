import "./index.less";
const Authemail = localStorage.getItem("useremail");
const Authid = localStorage.getItem("userid");
const Authcompany = localStorage.getItem("companyName");

const Recharge = () => {
	return (
		<div className="recharge-wrap">
			<div className="firstCol">
				<div className="userInfo">
					<span className="title">当前登录账户</span>
					<div className="content">
						<div className="left">
							<div className="pre">登录邮箱:</div>
							<div className="pre">账户ID: </div>
							<div className="pre">公司名称：</div>
						</div>
						<div className="middle">
							<div className="pre">{Authemail}</div>
							<div className="pre">{Authid}</div>
							<div className="pre">{Authcompany}</div>
						</div>
					</div>
				</div>
				<div className="accountInfo">
					<span className="title">VoyaPay收款账户</span>
					<div className="content">
						<div className="left">
							<div className="pre">
								<div className="sub-pre">银行所在国家/地区：</div>
								<div className="sub-pre">Bank Location:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">账户持有者名称:</div>
								<div className="sub-pre">Account Holder Name:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">银行名称:</div>
								<div className="sub-pre">Bank Name:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">银行账号:</div>
								<div className="sub-pre">Account Number:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">银行地址:</div>
								<div className="sub-pre">Bank Address:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">SWIFT银行代码:</div>
								<div className="sub-pre">SWIFT Code:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">Wire汇款路线号:</div>
								<div className="sub-pre">Wire Routing Number:</div>
							</div>
							<div className="pre">
								<div className="sub-pre">ACH 汇款路线号:</div>
								<div className="sub-pre">ACH Routing Number:</div>
							</div>
						</div>
						<div className="middle">
							<div className="pre">United States</div>
							<div className="pre">ZN Holding LLC</div>
							<div className="pre">Chase Bank</div>
							<div className="pre">659619103</div>
							<div className="pre">
								<div className="sub-pre"> 5252 Peachtree Pkwy, </div>
								<div className="sub-pre">Peachtree Corners, GA 30092</div>
							</div>
							<div className="pre">CHASUS33</div>
							<div className="pre">021000021</div>
							<div className="pre"> 061092387</div>
						</div>
					</div>
				</div>
			</div>
			<div className="chargeTips">
				<span className="title">充值说明</span>
				<div className="content">
					<span className="pre">
						&nbsp;&nbsp;&nbsp;&nbsp;1.
						VoyaPay会根据您提供的付款账户信息为您入账，如需修改付款账户信息，请提前与专属客户经理联系，以免造成不必要的资金延误。
					</span>
					<span className="pre">&nbsp;&nbsp;&nbsp;&nbsp;2. 由于地区监管等原因，VoyaPay暂时仅接受美金充值。</span>
					<span className="pre">&nbsp;&nbsp;&nbsp;&nbsp;3. 如有充值资金在途，请耐心等待，并联系您的付款银行。</span>
					<span className="pre">&nbsp;&nbsp;&nbsp;&nbsp;4. 实际入账金额以VoyaPay账户的实收金额为准。</span>
					<span className="pre">
						&nbsp;&nbsp;&nbsp;&nbsp;5. VoyaPay充分保障您的钱包账户资金安全，如遇异常请联系您的专属7*24小时客户经理团队。
					</span>
				</div>
			</div>
		</div>
	);
};

export default Recharge;
