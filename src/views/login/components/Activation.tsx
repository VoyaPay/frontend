import { useEffect, useState } from "react";
import { activateAccountApi } from "@/api/modules/login";
import useUrlParams from "@/hooks/useUrlParams";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import SvgIcon from "@/components/svgIcon";
import "./Activation.less";

const ActivationComponent = () => {
	const [activationStatus, setActivationStatus] = useState<string>("");
	const token = useUrlParams("tk");

	useEffect(() => {
		if (token) {
			activateAccount();
		}
	}, [token]);

	const navigate = useNavigate();

	const activateAccount = async () => {
		await activateAccountApi({ token })
			.then(() => {
				setActivationStatus("激活成功!");
			})
			.catch(() => {
				setActivationStatus("激活失败!");
			});
	};

	return (
		<>
			{activationStatus && (
				<div className="activation-container">
					<h1 className={activationStatus === "激活成功!" ? "activation-title" : "activation-fail"}>{activationStatus}</h1>
					<SvgIcon
						className="activation-icon"
						name={activationStatus === "激活成功!" ? "success" : "fail"}
						iconStyle={{ width: "60px", height: "60px" }}
					/>
					<Button className="activation-button" size="large" onClick={() => navigate("/login")}>
						返回登录
					</Button>
				</div>
			)}
		</>
	);
};

export default ActivationComponent;
