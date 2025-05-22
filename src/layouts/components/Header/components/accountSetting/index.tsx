import { useRef, useState } from "react";
import "./index.less";
import { Button, message, Switch } from "antd";
import PasswordModal from "@/layouts/components/Header/components/PasswordModal";
import { store } from "@/redux";
import { safeOperation } from "@/api/modules/login";
import { UserSafeOperation } from "@/api/interface";

interface ModalProps {
	showModal: (params: { type: number }) => void;
}

const AccountSetting = () => {
	const userInfo = store.getState().global.userInfo;
	const passRef = useRef<ModalProps>(null);
	const [verifySwitch, setVerifySwitch] = useState(userInfo.mfaStrategy === 1);

	const handleSwitchChange = async (checked: boolean) => {
		// setAutoRechargeSwitch(!checked);
		// setOpenAutoRechargeModal(true);
		let req: UserSafeOperation = {
			isVerify: checked ? 1 : 0
		};
		const response = await safeOperation(req);
		const code = response.data?.code;
		const msg = response.data?.message ?? "系统错误，请稍后重试!";
		if (code === 400) {
			message.error(msg);
			throw new Error(msg);
		}
		if (code === 200) {
			setVerifySwitch(checked);
			message.success(msg);
		}
	};
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
				<div className="row">
					<div className="label">邮箱二次验证：</div>
					<div className="switch-wrap">
						<Switch size="small" checked={verifySwitch} onChange={checked => handleSwitchChange(checked)} />
						<span className="action"> 是否启用登录二次验证</span>
					</div>
				</div>
				<div className="row">
					<div className="label">登录密码：</div>
					<div className="value">
						<Button type="primary" onClick={() => passRef.current?.showModal({ type: 11 })}>
							修改密码
						</Button>
					</div>
				</div>
				<div className="row">
					<div className="label">支付密码：</div>
					<div className="value">
						<Button type="primary" onClick={() => passRef.current?.showModal({ type: 12 })}>
							修改密码
						</Button>
					</div>
				</div>
			</div>

			<PasswordModal innerRef={passRef} />
		</div>
	);
};

export default AccountSetting;
