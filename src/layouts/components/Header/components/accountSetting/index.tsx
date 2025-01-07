import { useRef } from "react";
import "./index.less";
import { Button } from "antd";
import PasswordModal from "@/layouts/components/Header/components/PasswordModal";
import { store } from "@/redux";

interface ModalProps {
	showModal: (params: { name: number }) => void;
}

const AccountSetting = () => {
	const userInfo = store.getState().global.userInfo;
	const passRef = useRef<ModalProps>(null);

	return (
		<div className="accountSetting-wrap">
			<div className="title">账户信息</div>
			<div className="content">
				<div className="row">
					<div className="label">公司名称：</div>
					<div className="value">{userInfo ? userInfo.companyName : "Loading..."}</div>
				</div>
				<div className="row">
					<div className="label">个人姓名：</div>
					<div className="value">{userInfo ? userInfo.fullName : "Loading..."}</div>
				</div>
				<div className="row">
					<div className="label">绑定邮箱：</div>
					<div className="value">{userInfo ? userInfo.email : "Loading..."}</div>
				</div>
				<div>
					<Button type="primary" onClick={() => passRef.current?.showModal({ name: 11 })}>
						修改密码
					</Button>
				</div>
			</div>

			<PasswordModal innerRef={passRef} />
		</div>
	);
};

export default AccountSetting;
