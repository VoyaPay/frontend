import { Form, Input, Button, message, FormInstance } from "antd";
import { UserOutlined, LockOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Login } from "@/api/interface";
import { loginApi } from "@/api/modules/login";
import { KYCStateApi } from "@/api/modules/kyc";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/modules/global/action";
import { setTabsList } from "@/redux/modules/tabs/action";

interface LoginComponentProps {
	setToken: (token: string) => void;
	setTabsList: (tabs: any[]) => void;
	form: FormInstance<any>;
	loginType: number;
}

const LoginComponent = (props: LoginComponentProps) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { form, loginType } = props;
	const [loading, setLoading] = useState<boolean>(false);

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
			dispatch(setToken(access_token));
			dispatch(setTabsList([]));
			localStorage.setItem("access_token", access_token);
			if (loginForm.email) {
				const kycResponse = await KYCStateApi(); // unreviewed underReview rejected
				if (kycResponse.status === "approved") {
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
		<div>
			<div className="login-type" style={{ fontSize: "20px", fontWeight: "bold" }}>
				登录VoyaPay账户
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
				{loginType == 0 ? (
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
			<div className="otherText-wrap">
				<a onClick={() => navigate("/register")} style={{ marginRight: 10 }}>
					没有账号？立即注册
				</a>
			</div>
		</div>
	);
};

export default LoginComponent;
