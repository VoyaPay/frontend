import { Form, Input, Button, message, FormInstance, Modal } from "antd";
import { UserOutlined, LockOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Login } from "@/api/interface";
import { loginApi, loginSecondVerify } from "@/api/modules/login";
import { getKYCApi } from "@/api/modules/kyc";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUserInfo } from "@/redux/modules/global/action";
import { ResultEnum } from "@/enums/httpEnum";

interface LoginComponentProps {
	form: FormInstance<any>;
	loginType: number;
}

const LoginComponent = (props: LoginComponentProps) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { form, loginType: initLoginType } = props;
	const [loading, setLoading] = useState<boolean>(false);
	const [currentLoginType, setCurrentLoginType] = useState<number>(initLoginType);

	const onFinish = async (loginForm: Login.ReqLoginForm) => {
		try {
			setLoading(true);
			if (loginForm.email) {
				loginForm.email = loginForm.email.toLowerCase();
			}
			const response = currentLoginType === 2 ? await loginSecondVerify(loginForm) : await loginApi(loginForm);

			const access_token = response.data?.access_token;
			if (!access_token) {
				const code = response?.code;
				if (code) {
					if (code === 400) {
						const msg = response?.msg ?? "系统错误，请稍后重试!";
						message.error(msg);
						throw new Error(msg);
					}
					if (code === ResultEnum.SUCCESS) {
						//邮箱发送成功，弹窗提示输入验证码
						Modal.confirm({
							title: "二次验证",
							content: `为了您的账户安全，我们已向您的邮箱发送了6位验证码。请在15分钟内查收并输入验证码完成登录。`,
							onOk() {
								// form.resetFields();
								form.setFieldsValue({
									password: undefined
								});
								setCurrentLoginType(2);
							},
							onCancel() {
								console.log("取消");
							}
						});
					}
					return;
				}
				throw new Error("No access token received");
			}
			dispatch(setToken(access_token));
			dispatch(setUserInfo(null));
			localStorage.setItem("access_token", access_token);
			if (loginForm.email) {
				const kycResponse = await getKYCApi(); // approved unfilled underReview rejected
				if (kycResponse.status === "approved") {
					message.success("登录成功！");
					navigate("/tradeQuery");
					return;
				} else if (kycResponse.status === "unfilled") {
					navigate("/form/product");
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
		<div>
			<div className="login-type" style={{ fontSize: "20px", fontWeight: "bold" }}>
				{currentLoginType == 2 ? "请进行邮箱二次验证" : "登录VoyaPay账户"}
			</div>
			<Form
				form={form}
				name="basic"
				labelCol={{ span: 5 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				size="large"
				autoComplete="on"
			>
				{currentLoginType == 0 ? (
					<Form.Item name="username" rules={[{ required: true, message: `请输入手机号` }]}>
						<Input placeholder="手机号" prefix={<UserOutlined />} />
					</Form.Item>
				) : (
					<Form.Item name="email" rules={[{ required: true, message: `请输入邮箱` }]}>
						<Input
							placeholder="邮箱"
							prefix={<UserOutlined />}
							autoComplete="email"
							onChange={e => {
								e.target.value = e.target.value.toLowerCase();
							}}
						/>
					</Form.Item>
				)}
				{currentLoginType == 2 ? (
					<div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
						<Form.Item name="verifyCode" rules={[{ required: true, message: "请输入邮箱验证码" }]}>
							<Input autoComplete="current-password" placeholder="邮箱验证码" prefix={<LockOutlined />} />
						</Form.Item>
					</div>
				) : (
					<div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
						<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
							<Input.Password autoComplete="current-password" placeholder="密码" prefix={<LockOutlined />} />
						</Form.Item>
						<a
							onClick={() => {
								navigate("/forgot-password");
							}}
							style={{ position: "absolute", bottom: "8px", right: "0" }}
						>
							忘记密码
						</a>
					</div>
				)}

				<Form.Item className="login-btn">
					<Button
						onClick={() => {
							form.resetFields();
						}}
						icon={<CloseCircleOutlined />}
					>
						重置
					</Button>
					<span className="space" />
					<Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined />}>
						登录
					</Button>
				</Form.Item>
			</Form>
			{currentLoginType == 1 ? (
				<div className="otherText-wrap">
					<a onClick={() => navigate("/register")} style={{ marginRight: 10 }}>
						没有账号？立即注册
					</a>
				</div>
			) : (
				<div className="otherText-wrap">
					<a onClick={() => setCurrentLoginType(1)} style={{ marginRight: 10 }}>
						返回登录页面
					</a>
				</div>
			)}
		</div>
	);
};

export default LoginComponent;
