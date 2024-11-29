import { useEffect, useState } from "react";
import { Form, Input, Button, FormInstance, message } from "antd";
import { getCaptchaApi, sendResetPasswordEmailApi } from "@/api/modules/login";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Captcha.less";

const ForgotPasswordComponent = ({ form }: { form: FormInstance }) => {
	const [captcha, setCaptcha] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		handleCaptchaRefresh();
	}, []);

	const handleSendEmail = async () => {
		const values = await form.validateFields();
		setLoading(true);
		await sendResetPasswordEmailApi(values)
			.then(() => {
				message.success("重置密码的链接已发送到您的邮箱。");
			})
			.catch(() => {
				handleCaptchaRefresh();
			});
		setLoading(false);
	};

	const handleCaptchaRefresh = async () => {
		// @ts-ignore
		const response: string = await getCaptchaApi({ usage: "ForgotPasswordCaptcha" });
		setCaptcha(response);
	};

	const navigate = useNavigate();

	return (
		<div className="forgot-password-container">
			<div className="login-type" style={{ fontSize: "20px", fontWeight: "bold" }}>
				找回密码
			</div>
			<Form
				form={form}
				name="basic"
				labelCol={{ span: 5 }}
				initialValues={{ remember: true }}
				onFinish={handleSendEmail}
				size="large"
				autoComplete="off"
			>
				<Form.Item
					name="email"
					validateTrigger="onBlur"
					rules={[
						{ required: true, message: `请输入邮箱` },
						{ type: "email", message: "请输入有效的邮箱地址" }
					]}
				>
					<Input placeholder="邮箱" prefix={<UserOutlined />} />
				</Form.Item>
				<Form.Item name="captcha" rules={[{ required: true, message: "请输入验证码" }]}>
					<Input
						className="captcha-input"
						placeholder="验证码"
						maxLength={6}
						prefix={<LockOutlined />}
						suffix={
							<div className="captcha-svg" onClick={handleCaptchaRefresh} dangerouslySetInnerHTML={{ __html: captcha || "" }} />
						}
					/>
				</Form.Item>
				<Form.Item className="login-btn">
					<Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
						提交
					</Button>
				</Form.Item>
			</Form>
			<div className="otherText-wrap">
				<a
					onClick={() => {
						navigate("/login");
					}}
				>
					立即登录
				</a>
			</div>
		</div>
	);
};

export default ForgotPasswordComponent;
