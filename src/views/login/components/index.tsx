import { useEffect, useState } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Login } from "@/api/interface";
import { loginApi } from "@/api/modules/login";
import { KYCStateApi } from "@/api/modules/form";
import { connect } from "react-redux";
import { setToken } from "@/redux/modules/global/action";
import { setTabsList } from "@/redux/modules/tabs/action";
import LoginComponent from "./Login";
import ForgotPasswordComponent from "./ForgotPassword";
import RegisterComponent from "./Register";
import ActivationComponent from "./Activation";
import SetPasswordComponent from "./SetPassword";
import logo from "@/assets/images/voya.png";
import "./index.less";

const LoginForm = (props: any) => {
	const { setToken, setTabsList, loginRouterType } = props;
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	let loginType: number | string = "1";
	loginType = Number(loginType);

	useEffect(() => {
		form.resetFields();
	}, [loginRouterType]);

	const onFinish = async (loginForm: Login.ReqLoginForm) => {
		try {
			setLoading(true);
			if (loginForm.email) {
				loginForm.email = loginForm.email.toLowerCase();
			}
			const response = await loginApi(loginForm);

			const access_token = response.data?.access_token;
			if (!access_token) {
				throw new Error("No access token received");
			}
			setToken("access token is " + access_token);
			setTabsList([]);
			localStorage.setItem("access_token", access_token);
			if (loginForm.email) {
				const kycResponse = await KYCStateApi(); // unreviewed underReview rejected
				if (kycResponse.status === "approved") {
					console.log(kycResponse.status);
					message.success("登录成功！");
					navigate("/proTable/account");
					return;
				} else if (kycResponse.status === "unfilled") {
					navigate("/company");
					return;
				} else {
					navigate("/form/kycprocess");
					return;
				}
			}
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className="loginform-container">
			<a href="https://www.voyapay.com/zh" target="_blank" rel="noopener noreferrer">
				<img src={logo} alt="logo" className="logo-img" />
			</a>
			{loginRouterType === "login" ? (
				<LoginComponent form={form} loginType={loginType} onFinish={onFinish} onFinishFailed={onFinishFailed} loading={loading} />
			) : loginRouterType === "forgotPassword" ? (
				<ForgotPasswordComponent form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} loading={loading} />
			) : loginRouterType === "register" ? (
				<RegisterComponent form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} loading={loading} />
			) : loginRouterType === "activation" ? (
				<ActivationComponent />
			) : loginRouterType === "setPassword" ? (
				<SetPasswordComponent />
			) : null}
		</div>
	);
};

const mapDispatchToProps = { setToken, setTabsList };
export default connect(null, mapDispatchToProps)(LoginForm);
