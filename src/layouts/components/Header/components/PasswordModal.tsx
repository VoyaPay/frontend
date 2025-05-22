import { useState, useImperativeHandle, Ref } from "react";
import { Modal, message, Input, Form } from "antd";
import { findPayConfig, PasswordApi, sendPayConfigEmailCode } from "@/api/modules/user";
import { LockOutlined } from "@ant-design/icons";
import { ResultEnum } from "@/enums/httpEnum";

interface Props {
	innerRef: Ref<{ showModal: (params: { type: number }) => void }>;
}

const PasswordModal = (props: Props) => {
	const [isPayType, setIsPayType] = useState<number>(11);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	useImperativeHandle(props.innerRef, () => ({
		showModal
	}));

	const showModal = async (params: any) => {
		let type = params.type;
		//去找是否设置过支付密码
		if (type == 12) {
			const payConfig = await findPayConfig();
			if (!payConfig.data?.payPwd) {
				//发送邮件 然后设置初始密码
				const res = await sendPayConfigEmailCode();
				if (res.code == ResultEnum.SUCCESS) {
					Modal.confirm({
						title: "初始密码设置",
						content: `为了您的账户安全，我们已向您的邮箱发送了6位验证码。请在10分钟内查收并输入验证码完成初始密码设置。`,
						onOk() {
							type = 13;
							setIsModalVisible(true);
							setIsPayType(type);
						},
						onCancel() {
							console.log("取消");
						}
					});
				}
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
				if (isPayType == 11 || isPayType == 12) {
					if (newPassword !== confirmNewPassword) {
						message.error("新密码和确认密码不一致！");
						return;
					} else if (oldPassword === newPassword) {
						message.error("新旧密码不能一样！");
						return;
					}
				}
				PasswordApi({
					type: isPayType,
					oldPassword: oldPassword,
					newPassword: newPassword,
					newPasswordConfirmation: newPassword
				}).then(() => {
					message.success("修改成功！");
					setIsModalVisible(false);
					form.resetFields();
				});
			})
			.catch(errorInfo => {
				console.error("验证失败：", errorInfo);
			});
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
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
					<Input autoComplete="current-password" placeholder="邮箱验证码" />
				</Form.Item>
				<Form.Item label="初始密码" name="newPassword" rules={[{ required: true, message: "请输入初始密码" }]}>
					<Input.Password placeholder="初始密码" prefix={<LockOutlined />} />
				</Form.Item>
			</Form>
		</Modal>
	) : (
		<Modal title="修改支付密码" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
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
	);
};

export default PasswordModal;
