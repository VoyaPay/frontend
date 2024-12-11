import { useState, useImperativeHandle, Ref } from "react";
import { Modal, message, Input, Form } from "antd";
import { PasswordApi } from "@/api/modules/user";

interface Props {
	innerRef: Ref<{ showModal: (params: any) => void }>;
}

const PasswordModal = (props: Props) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	useImperativeHandle(props.innerRef, () => ({
		showModal
	}));

	const showModal = (params: { name: number }) => {
		console.log(params);
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form
			.validateFields()
			.then(values => {
				const { oldPassword, newPassword, confirmNewPassword } = values;
				if (newPassword !== confirmNewPassword) {
					message.error("新密码和确认密码不一致！");
				} else if (oldPassword === newPassword) {
					message.error("新旧密码不能一样！");
				} else {
					const ChangePassword = async () => {
						try {
							const response = await PasswordApi({
								oldPassword: oldPassword,
								newPassword: newPassword,
								newPasswordConfirmation: newPassword
							});
							console.log(response);
							message.success("修改成功！");
							setIsModalVisible(false);
							form.resetFields();
						} catch (error: any) {
							if (error.response.data.message === "Old password is incorrect") {
								message.error("旧密码不正确， 请重新输入！");
							}
						}
					};
					const response = ChangePassword();
					console.log(response);
				}
			})
			.catch(errorInfo => {
				console.error("验证失败：", errorInfo);
			});
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

	return (
		<Modal title="修改密码" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
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
