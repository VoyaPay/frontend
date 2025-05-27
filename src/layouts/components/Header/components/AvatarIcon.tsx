import { useRef } from "react";
import { Avatar, Modal, Menu, Dropdown, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import PasswordModal from "./PasswordModal";
import avatar from "@/assets/icons/avatar.svg";
import useLogout from "@/hooks/useLogout";
import { store } from "@/redux";
interface ModalProps {
	showModal: (params: { type: number }) => void;
}

const AvatarIcon = () => {
	const logoutHandle = useLogout();
	const navigate = useNavigate();
	const userInfo = store.getState().global.userInfo;
	const passRef = useRef<ModalProps>(null);

	const logout = () => {
		Modal.confirm({
			title: "温馨提示 🧡",
			icon: <ExclamationCircleOutlined />,
			content: "是否确认退出登录？",
			okText: "确认",
			cancelText: "取消",
			onOk: () => {
				logoutHandle();
				message.success("退出登录成功！");
			}
		});
	};

	// Dropdown Menu
	const menu = (
		<Menu
			items={[
				{
					key: "1",
					label: <span className="dropdown-item">首页</span>,
					onClick: () => navigate(HOME_URL)
				},
				{
					key: "2",
					label: <span className="dropdown-item">账户信息</span>,
					onClick: () => navigate("accountSetting/index")
				},
				{
					key: "3",
					label: <span className="dropdown-item">修改密码</span>,
					onClick: () => passRef.current!.showModal({ type: 11 })
				},
				{
					type: "divider"
				},
				{
					key: "4",
					label: <span className="dropdown-item">退出登录</span>,
					onClick: logout
				}
			]}
		></Menu>
	);
	return (
		<>
			<Dropdown overlay={menu} placement="bottom" arrow trigger={["click"]}>
				<span style={{ display: "inline-flex", cursor: "pointer", marginTop: "2px", lineHeight: 1 }}>
					<Avatar src={avatar} className="avatar" style={{ marginRight: "10px" }} />
					<span
						style={{
							display: "inline-block",
							paddingTop: "5px",
							maxWidth: "115px",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						}}
					>
						{userInfo ? userInfo.fullName : "Loading..."}
					</span>
				</span>
			</Dropdown>
			<PasswordModal innerRef={passRef}></PasswordModal>
		</>
	);
};

export default AvatarIcon;
