import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUrlParams from "@/hooks/useUrlParams";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { resetPasswordApi } from "@/api/modules/login";

const SetNewPasswordComponent = (props: any) => {
	const { form } = props;
	const [email, setEmail] = useState<string>("");
	const [token, setToken] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const emailParam = useUrlParams("email");
	const tokenParam = useUrlParams("tk");

	const navigate = useNavigate();

	useEffect(() => {
		if (emailParam && tokenParam) {
			setEmail(emailParam);
			setToken(tokenParam);
		}
	}, [tokenParam]);

	const handleResetPassword = async () => {
		setLoading(true);
		const values = await form.validateFields();
		await resetPasswordApi({ token, password: values.password })
			.then(() => {
				message.success("密码重置成功。");
				setLoading(false);
				navigate("/login");
			})
			.catch(() => {
				setLoading(false);
			});
	};

	return (
		<div className="reset-password-container">
			<div style={{ fontSize: "20px", fontWeight: "bold" }}>重置以下账号的密码：</div>
			<p>{email}</p>
			<Form form={form} name="resetPassword" labelCol={{ span: 5 }} size="large" onFinish={handleResetPassword}>
				<Form.Item
					name="password"
					validateTrigger="onBlur"
					rules={[
						{ required: true, message: "设置密码" },
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
					rules={[
						{ required: true, message: "确认密码" },
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
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
						重置密码
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

export default SetNewPasswordComponent;
