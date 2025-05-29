import { useRef, useState } from "react";
import "./index.less";
import { Button, Input, message, Modal, Switch } from "antd";
import PasswordModal from "@/layouts/components/Header/components/PasswordModal";
import { store } from "@/redux";
import { safeOperation } from "@/api/modules/login";
import { UserSafeOperation } from "@/api/interface";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { enablePay, findPayConfig } from "@/api/modules/user";
import { ResultEnum } from "@/enums/httpEnum";
import { encryption } from "@/utils/util";

interface ModalProps {
	showModal: (params: { type: number }) => void;
}

const AccountSetting = () => {
	const userInfo = store.getState().global.userInfo;
	const passRef = useRef<ModalProps>(null);
	const [verifySwitch, setVerifySwitch] = useState(userInfo.mfaStrategy === 1);
	const [payConfigSwitch, setPayConfigSwitch] = useState(false);
	const payPwdRef = useRef("");

	useEffect(() => {
		isOpenPay();
	}, []); // 空数组表示只在组件挂载时执行一次

	const handleSwitchChange = async (checked: boolean) => {
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
			message.success(`${checked ? "关闭成功" : "开启成功"}`);
		}
	};
	const isOpenPay = async () => {
		const payConfig = await findPayConfig();
		//为空、密码没设置、支付开关关闭，均为关闭状态
		if (!payConfig || !payConfig.data?.payPwd || payConfig.data?.isOpen == 1) {
			setPayConfigSwitch(false);
		} else {
			setPayConfigSwitch(payConfig.data?.isOpen == 0);
		}
	};
	const handlePayConfigSwitchChange = async (checked: boolean) => {
		//check 为true，是开启支付密码，false是关闭支付密码
		if (!checked) {
			Modal.confirm({
				title: "请输入支付密码",
				icon: null,
				content: (
					<Input.Password
						onChange={e => {
							payPwdRef.current = e.target.value;
						}}
						placeholder="请输入支付密码..."
					/>
				),
				onOk() {
					let value = payPwdRef.current;
					if (!value) {
						message.error("请输入支付密码！");
						return Promise.reject();
					}
					enablePay({ enable: checked ? 0 : 1, pwd: encryption(value) }).then(async res => {
						if (res.code == ResultEnum.SUCCESS) {
							setPayConfigSwitch(checked);
						}
					});
				},
				onCancel() {}
			});
		} else {
			enablePay({ enable: checked ? 0 : 1 }).then(async res => {
				if (res.code == ResultEnum.SUCCESS) {
					setPayConfigSwitch(checked);
					if (checked) {
						const payConfig = await findPayConfig();
						if (!payConfig.data?.payPwd) {
							passRef.current?.showModal({ type: 12 });
						}
					}
				}
			});
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
					<div className="label">
						邮箱二次验证：
						<Tooltip title="该功能用于登录VoyaPay官网时的二次验证，加强账号安全。开启后，每个IP在登录时，都会向您的注册邮箱发送验证码，用于登录验证； 相同IP在10天内登录无需重复验证。">
							<QuestionCircleOutlined style={{ marginLeft: 8, color: "#999" }} />
						</Tooltip>
					</div>
					<div className="switch-wrap">
						<Switch size="small" checked={verifySwitch} onChange={checked => handleSwitchChange(checked)} />
						<span className="action"> 是否启用登录二次验证</span>
					</div>
				</div>
				<div className="row">
					<div className="label">
						支付密码：
						<Tooltip title="该功能用于隐藏卡详情里的敏感信息，如完整卡号、CVV、有效期等。设置支付密码后，敏感信息将默认隐藏，需输入密码方可查看，15分钟内无需重复输入。">
							<QuestionCircleOutlined style={{ marginLeft: 8, color: "#999" }} />
						</Tooltip>
					</div>
					<div className="switch-wrap">
						<Switch size="small" checked={payConfigSwitch} onChange={checked => handlePayConfigSwitchChange(checked)} />
						{!payConfigSwitch ? (
							<span className="action"> 是否启用支付密码</span>
						) : (
							<Button className="actionBtn" type="primary" onClick={() => passRef.current?.showModal({ type: 12 })}>
								修改密码
							</Button>
						)}
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
			</div>

			<PasswordModal
				innerRef={passRef}
				onRefresh={() => {
					// 在这里写刷新逻辑
					isOpenPay();
				}}
			/>
		</div>
	);
};

export default AccountSetting;
