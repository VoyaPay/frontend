import { NavLink } from "react-router-dom";
import { Button } from "antd";
import ApplySuccessImg from "@/assets/images/applySuccess.png";
import "./index.less";
import { useEffect, useState } from "react";
import { getKYCApi } from "@/api/modules/kyc";
const KycProcess = () => {
	const [kycStatus, setKycStatus] = useState<string>(""); // unfilled underReview approved rejected
	const [kycStatusMessage, setKycStatusMessage] = useState<string>("");
	useEffect(() => {
		const fetchData = async () => {
			const kycResponse = await getKYCApi();
			setKycStatus(kycResponse.status || "unfilled");
			if (kycStatus === "unfilled") {
				setKycStatusMessage("您的 KYC 信息需要修改");
			} else if (kycStatus === "underReview") {
				setKycStatusMessage("您的 KYC 信息已提交，请耐心等待审核完成");
			} else if (kycStatus === "rejected") {
				setKycStatusMessage("您的 KYC 信息需要修改，请前往注册邮箱查看修改建议");
			} else if (kycStatus === "approved") {
				setKycStatusMessage("您的 KYC 信息审核通过");
			}
		};
		fetchData();
	}, [kycStatus]);
	return (
		<div className="applySuccess-wrap">
			{kycStatusMessage && (
				<div className="contentWrap">
					<div className="tipsWrap">
						{(kycStatus === "approved" || kycStatus === "underReview") && <img src={ApplySuccessImg} alt="" className="icon" />}
						<span className="tips">{kycStatusMessage}</span>
					</div>
					<div className="buttonWrap">
						{(kycStatus === "unfilled" || kycStatus === "rejected") && (
							<Button type="primary" className="return" style={{ marginRight: "10px" }}>
								<NavLink to="/form/product" className="myAccount">
									修改
								</NavLink>
							</Button>
						)}
						{kycStatus === "approved" ? (
							<Button type="primary" className="return">
								<NavLink to="/account" className="myAccount">
									首页
								</NavLink>
							</Button>
						) : (
							<Button type="primary" className="return">
								<NavLink to="/login" className="myAccount">
									返回
								</NavLink>
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default KycProcess;
