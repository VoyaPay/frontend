import { useEffect } from "react";
import { Form } from "antd";
import LoginComponent from "./Login";
import ForgotPasswordComponent from "./ForgotPassword";
import RegisterComponent from "./Register";
import ActivationComponent from "./Activation";
import SetPasswordComponent from "./SetPassword";
import logo from "@/assets/images/voya.png";
import "./index.less";

const LoginForm = (props: any) => {
	const { loginRouterType } = props;
	const [form] = Form.useForm();
	let loginType: number | string = "1";
	loginType = Number(loginType);

	useEffect(() => {
		form.resetFields();
	}, [loginRouterType]);

	return (
		<div className="loginform-container">
			<a href="https://www.voyapay.com/zh" target="_blank" rel="noopener noreferrer">
				<img src={logo} alt="logo" className="logo-img" />
			</a>
			{loginRouterType === "login" ? (
				<LoginComponent form={form} loginType={loginType} />
			) : loginRouterType === "forgotPassword" ? (
				<ForgotPasswordComponent form={form} />
			) : loginRouterType === "register" ? (
				<RegisterComponent form={form} />
			) : loginRouterType === "activation" ? (
				<ActivationComponent />
			) : loginRouterType === "setPassword" ? (
				<SetPasswordComponent />
			) : null}
		</div>
	);
};

export default LoginForm;
