import { useEffect, useState } from "react";
import { Form, Input, Button, FormInstance, message, Checkbox } from "antd";
import { getCaptchaApi, registerApi } from "@/api/modules/login";
import { UserOutlined, LockOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Captcha.less";

const RegisterComponent = ({ form }: { form: FormInstance }) => {
	const [captcha, setCaptcha] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);
	const [agree, setAgree] = useState<boolean>(false);

	useEffect(() => {
		handleCaptchaRefresh();
	}, []);

	const handleRegister = async () => {
		const values = await form.validateFields();
		setLoading(true);
		await registerApi(values)
			.then(() => {
				message.success("注册成功，请前往邮箱激活。");
			})
			.catch(() => {
				handleCaptchaRefresh();
			});
		setLoading(false);
	};

	const handleCaptchaRefresh = async () => {
		// @ts-ignore
		const response: string = await getCaptchaApi({ usage: "RegisterCaptcha" });
		setCaptcha(response);
	};

	const navigate = useNavigate();

	return (
		<div className="register-container">
			<div className="login-type" style={{ fontSize: "20px", fontWeight: "bold" }}>
				注册VoyaPay
			</div>
			<Form
				form={form}
				name="basic"
				labelCol={{ span: 5 }}
				initialValues={{ remember: true }}
				onFinish={handleRegister}
				size="middle"
				autoComplete="off"
				className="register-form"
			>
				<Form.Item name="fullName" validateTrigger="onBlur" rules={[{ required: true, message: `请输入姓名`, max: 40 }]}>
					<Input placeholder="姓名" prefix={<UserOutlined />} />
				</Form.Item>
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
				<Form.Item
					name="password"
					validateTrigger="onBlur"
					rules={[
						{ required: true, message: "请输入密码" },
						{
							pattern:
								// eslint-disable-next-line
								/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/,
							message: "密码至少8位，包含大小写字母、数字和特殊字符"
						}
					]}
				>
					<Input.Password autoComplete="new-password" placeholder="密码" prefix={<LockOutlined />} />
				</Form.Item>
				<Form.Item
					name="repeatPassword"
					validateTrigger="onBlur"
					rules={[
						{ required: true, message: "请再次输入密码" },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue("password") === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error("两次输入的密码不匹配"));
							}
						})
					]}
				>
					<Input.Password autoComplete="new-password" placeholder="确认密码" prefix={<LockOutlined />} />
				</Form.Item>
				<Form.Item name="companyName" rules={[{ required: true, message: "请输入公司名称", max: 80 }]}>
					<Input placeholder="公司名称" prefix={<UserOutlined />} />
				</Form.Item>
				<Form.Item name="captcha" rules={[{ required: true, message: "请输入验证码" }]}>
					<Input
						className="captcha-input"
						placeholder="验证码"
						maxLength={6}
						suffix={
							!captcha ? (
								<ReloadOutlined onClick={handleCaptchaRefresh} />
							) : (
								<div className="captcha-svg" onClick={handleCaptchaRefresh} dangerouslySetInnerHTML={{ __html: captcha }} />
							)
						}
					/>
				</Form.Item>
				<Form.Item valuePropName="checked" style={{ minHeight: "50px" }}>
					<Checkbox id="agree-checkbox" onChange={e => setAgree(e.target.checked)} />
					<label> 我已阅读并同意 </label>
					<span>
						<a
							onClick={e => {
								e.stopPropagation();
								window.open(`${window.location.origin}/#/terms-and-conditions`, "_blank");
							}}
						>
							{" "}
							General Terms and Conditions
						</a>{" "}
						和
						<a
							onClick={e => {
								e.stopPropagation();
								window.open(`${window.location.origin}/#/privacy-policies`, "_blank");
							}}
						>
							{" "}
							Privacy Policies
						</a>
					</span>
				</Form.Item>
				<Form.Item className="login-btn">
					<Button type="primary" htmlType="submit" disabled={!agree} loading={loading} style={{ width: "100%" }}>
						注册
					</Button>
				</Form.Item>
			</Form>
			<div className="otherText-wrap" style={{ marginTop: "0" }}>
				<a
					onClick={() => {
						navigate("/login");
					}}
				>
					已有账号？立即登录
				</a>
			</div>
		</div>
	);
};

export default RegisterComponent;
