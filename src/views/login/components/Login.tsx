import { Form, Input, Button, FormInstance } from "antd";
import { UserOutlined, LockOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const LoginComponent = ({
	form,
	loginType,
	onFinish,
	onFinishFailed,
	loading
}: {
	form: FormInstance;
	loginType: number;
	onFinish: any;
	onFinishFailed: any;
	loading: boolean;
}) => {
	const navigate = useNavigate();
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
				autoComplete="off"
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
							onChange={e => {
								e.target.value = e.target.value.toLowerCase();
							}}
						/>
					</Form.Item>
				)}
				<div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
					<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
						<Input.Password autoComplete="new-password" placeholder="密码" prefix={<LockOutlined />} />
					</Form.Item>
					<span
						onClick={() => {
							navigate("/forgotPassword");
						}}
						style={{ position: "absolute", bottom: "8px", right: "0", color: "#bfbfbf", cursor: "pointer" }}
					>
						忘记密码
					</span>
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
				<a href="https://www.voyapay.com/zh/contact-4" style={{ marginRight: 10 }} target="_blank" rel="noopener noreferrer">
					立即注册
				</a>
			</div>
		</div>
	);
};

export default LoginComponent;
