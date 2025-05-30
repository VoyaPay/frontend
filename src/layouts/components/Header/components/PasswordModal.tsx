import { useState, useImperativeHandle, Ref } from "react";
import { Modal, message, Input, Form, Button } from "antd";
import { findPayConfig, PasswordApi, sendPayConfigEmailCode, changePayPwd, enablePay } from "@/api/modules/user";
import { LockOutlined } from "@ant-design/icons";

interface Props {
	innerRef: Ref<{ showModal: (params: { type: number }) => void }>;
	onRefresh?: () => void;
}

const PasswordModal = (props: Props) => {
	const [isPayType, setIsPayType] = useState<number>(11);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [countdown, setCountdown] = useState(0); // 倒计时时间

	useImperativeHandle(props.innerRef, () => ({
		showModal
	}));

	const showModal = async (params: any) => {
		let type = params.type;
		//去找是否设置过支付密码
		if (type == 12) {
			const payConfig = await findPayConfig();
			if (!payConfig.data?.payPwd) {
				type = 13;
				setIsModalVisible(true);
				setIsPayType(type);
			} else {
				setIsModalVisible(true);
				setIsPayType(type);
			}
		} else if (type == 11) {
			setIsModalVisible(true);
			setIsPayType(type);
		}
	};

	const handleOk = () => {
		form
			.validateFields()
			.then(values => {
				const { oldPassword, newPassword, confirmNewPassword } = values;
				if (isPayType == 11) {
					if (newPassword !== confirmNewPassword) {
						message.error("新密码和确认密码不一致！");
						return;
					} else if (oldPassword === newPassword) {
						message.error("新旧密码不能一样！");
						return;
					}
					PasswordApi({
						oldPassword: oldPassword,
						newPassword: newPassword,
						newPasswordConfirmation: newPassword
					}).then(() => {
						message.success("修改成功！");
						setIsModalVisible(false);
						form.resetFields();
					});
				} else {
					changePayPwd({
						oldPassword: oldPassword,
						newPassword: newPassword,
						newPasswordConfirmation: newPassword
					}).then(() => {
						message.success("修改成功！");
						setIsModalVisible(false);
						form.resetFields();
					});
				}
			})
			.catch(errorInfo => {
				console.error("验证失败：", errorInfo);
			});
	};
	// 倒计时函数
	const startCountdown = () => {
		let timeLeft = 60;
		setCountdown(timeLeft);
		const timer = setInterval(() => {
			timeLeft--;
			setCountdown(timeLeft);
			if (timeLeft <= 0) {
				clearInterval(timer);
			}
		}, 1000);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
		//如果是设置初始密码取消了，那么支付开关也要关闭
		if (isPayType == 13) {
			enablePay({ enable: 1 }).then(() => {
				if (props.onRefresh) {
					props.onRefresh(); // 调用父组件刷新方法
				}
			});
		}
	};

	return isPayType == 11 ? (
		<Modal title="修改登录密码" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
			<Form form={form} layout="vertical">
				<Form.Item label="旧密码" name="oldPassword" rules={[{ required: true, message: "请输入旧密码" }]}>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label="新密码"
					name="newPassword"
					rules={[
						{ required: true, message: "请输入新密码" },
						{
							pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
							message: "密码必须包含至少一个大写字母、小写字母、特殊符号，并且不少于8个字符"
						}
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item label="再次输入新密码" name="confirmNewPassword" rules={[{ required: true, message: "请再次输入新密码" }]}>
					<Input.Password />
				</Form.Item>
			</Form>
		</Modal>
	) : isPayType === 13 ? (
		<Modal title="设置初始密码" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
			<Form form={form} layout="vertical">
				<Form.Item label="邮箱验证码" name="oldPassword" rules={[{ required: true, message: "请输入邮箱验证码" }]}>
					<div style={{ display: "flex" }}>
						<Form.Item name="oldPassword" noStyle>
							<Input autoComplete="current-password" placeholder="邮箱验证码(默认发往注册邮箱)" style={{ flex: 1 }} />
						</Form.Item>
						<Button
							type="primary"
							disabled={countdown > 0}
							onClick={async () => {
								try {
									// 调用发送验证码接口
									const res = await sendPayConfigEmailCode();
									if (res.code === 200) {
										message.success("邮箱验证码已发送");
										startCountdown();
									} else {
										message.error(res.message || "发送失败");
									}
								} catch (error) {
									// message.error('邮箱验证码发送失败');
								}
							}}
							style={{ marginLeft: 8, height: "32px", alignSelf: "center" }}
						>
							{countdown > 0 ? `重新发送(${countdown}s)` : "发送验证码"}
						</Button>
					</div>
				</Form.Item>
				<Form.Item
					label="初始密码"
					name="newPassword"
					rules={[
						{ required: true, message: "请输入初始密码" },
						{ pattern: /^\d{6}$/, message: "请输入正确的6位数字密码" }
					]}
				>
					<Input.Password placeholder="初始密码" prefix={<LockOutlined />} />
				</Form.Item>
			</Form>
		</Modal>
	) : (
		<Modal title="修改支付密码" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
			<Form form={form} layout="vertical">
				<Form.Item
					label="旧密码"
					name="oldPassword"
					rules={[
						{ required: true, message: "请输入旧密码" },
						{ pattern: /^\d{6}$/, message: "请输入正确的6位数字密码" }
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label="新密码"
					name="newPassword"
					rules={[
						{ required: true, message: "请输入新密码" },
						{ pattern: /^\d{6}$/, message: "请输入正确的6位数字密码" }
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item label="再次输入新密码" name="confirmNewPassword" rules={[{ required: true, message: "请再次输入新密码" }]}>
					<Input.Password />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default PasswordModal;
