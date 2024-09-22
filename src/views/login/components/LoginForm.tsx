// import md5 from "js-md5";
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Login } from "@/api/interface";
import { loginApi } from "@/api/modules/login";
// import { HOME_URL } from "@/config/config";
import { connect } from "react-redux";
import { setToken } from "@/redux/modules/global/action";
// import { useTranslation } from "react-i18next";
import { setTabsList } from "@/redux/modules/tabs/action";
import { UserOutlined, LockOutlined, CloseCircleOutlined } from "@ant-design/icons";
import "./index.less";
import logo from "@/assets/images/voya.png";

const LoginForm = (props: any) => {
	// const { t } = useTranslation();
	const { setToken, setTabsList } = props;
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	let loginType: number | string = "1"; 
	loginType = Number(loginType);
	// const [loginType, setLoginType] = useState<Number>(0); //0: 手机号登录  1：邮箱登录

	// 登录
	const onFinish = async (loginForm: Login.ReqLoginForm) => {
		try {
			setLoading(true);
			console.log("loginForm", loginForm);
			// loginForm.password = md5(loginForm.password);
			const response = await loginApi(loginForm);
			
			console.log(response.data);

			const access_token = response.data?.access_token; 
			console.log(access_token);
			if (!access_token) {
				throw new Error("No access token received");
			}
			console.log("Received token:", access_token);
			setToken("access token is " + access_token);
			setTabsList([]);
			message.success("登录成功！");
			localStorage.setItem("access_token", access_token);
			navigate("/proTable/account");
			
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
			{/* <div className="login-type">
				<span className={`text ${loginType == 0 ? "selected" : ""}`} onClick={changeToPhone}>
					手机{" "}
				</span>
				<span className="text">|</span>
				<span className={`text ${loginType == 1 ? "selected" : ""}`} onClick={changeToEmail}>
					{" "}
					邮箱
				</span>
			</div> */}
			<Form
				form={form}
				name="basic"
				labelCol={{ span: 5 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				size="large"
				autoComplete="off"
			>
				{loginType == 0 ? (
					<Form.Item name="username" rules={[{ required: true, message: `请输入手机号` }]}>
						<Input placeholder="手机号" prefix={<UserOutlined />} />
					</Form.Item>
				) : (
					<Form.Item name="email" rules={[{ required: true, message: `请输入邮箱` }]}>
						<Input placeholder="邮箱" prefix={<UserOutlined />} />
					</Form.Item>
				)}
				<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
					<Input.Password autoComplete="new-password" placeholder="密码" prefix={<LockOutlined />} />
				</Form.Item>
				<Form.Item className="login-btn">
						<Button
							onClick={() => {
								form.resetFields();
							}}
							icon={<CloseCircleOutlined />}
						>
							{/* {t("login.reset")} */}
							重置
						</Button>
						<span className="space"/>
						<Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined />}>
							{/* {t("login.confirm")} */}
							登录
						</Button>
				</Form.Item>
			</Form>
			<div className="otherText-wrap">
				<a href="https://www.voyapay.com/zh/contact-4" target="_blank" rel="noopener noreferrer">
					立即注册
				</a>

				{/* <span>忘记密码</span> */}
			</div>
		</div>
	);
};

const mapDispatchToProps = { setToken, setTabsList };
export default connect(null, mapDispatchToProps)(LoginForm);
