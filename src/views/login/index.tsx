import LoginForm from "./components/LoginForm";
// import SwitchDark from "@/components/SwitchDark";
// import loginLeft from "@/assets/images/login_left.png";
import bg from "@/assets/images/bg.png";
import "./index.less";

const Login = () => {
	return (
		<div className="login-container">
			{/* <SwitchDark /> */}
			<div className="login-box">
				<div className="login-left">
					<img src={bg} alt="login" />
				</div>
				<div className="login-form">
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default Login;
