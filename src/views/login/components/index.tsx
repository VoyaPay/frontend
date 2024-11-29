import { useEffect } from "react";
import { Form } from "antd";
import LoginComponent from "./Login";
import ForgotPasswordComponent from "./ForgotPassword";
import RegisterComponent from "./Register";
import ActivationComponent from "./Activation";
import SetPasswordComponent from "./SetPassword";
import logo from "@/assets/images/voya.png";
import "./index.less";

interface LoginFormProps {
	loginRouterType: "login" | "forgotPassword" | "register" | "activation" | "setPassword";
}

const LoginForm = (props: LoginFormProps) => {
	const { loginRouterType } = props;
	const [form] = Form.useForm();
	let loginType: number | string = "1";
	loginType = Number(loginType);

	useEffect(() => {
		if (form) {
			form.resetFields();
		}
	}, [loginRouterType, form]);

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
				<SetPasswordComponent form={form} />
			) : null}
		</div>
	);
};

export default LoginForm;
