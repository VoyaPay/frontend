import LoginForm from "./components";
import bg from "@/assets/images/bg.png";
import "./index.less";

interface LoginProps {
	loginRouterType: "login" | "forgotPassword" | "register" | "activation" | "setPassword";
}

const Login = (props: LoginProps) => {
	return (
		<div className="login-container">
			<div className="login-box">
				<div className="login-left">
					<img src={bg} alt="login" />
				</div>
				<div className={`login-form ${props.loginRouterType === "activation" ? "active" : ""}`}>
					<LoginForm loginRouterType={props.loginRouterType} />
				</div>
			</div>
			<div className="login-footer">
				<span>&copy; {new Date().getFullYear()} VoyaPay Rights Reserved</span>
				<span style={{ margin: "0 10px" }}>|</span>
				<span>info@voyapay.com</span>
			</div>
		</div>
	);
};

export default Login;
