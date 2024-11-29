import { Form, Input, Button, Space, InputNumber, Modal, Col, message, Tooltip } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";
import { KYCData } from "@/api/interface";
interface Shareholder {
	entityName: string;
	nationalityOrLocation: string;
	position: string;
	ssnOrItin?: string;
	ownershipPercentage: number;
}
interface FormValues {
	shareholders: Shareholder[];
}

const ControllingShareholderInfo = () => {
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const [kycStatus, setKycStatus] = useState<string>("");
	const navigate = useNavigate();

	const handleCancel = () => {
		setOpen(false);
	};

	const handleOk = async () => {
		navigate("/form/beneficical");
	};

	const getKYCData = async () => {
		const res: KYCData = await getKYCApi();
		setKycStatus(res.status || "unfilled");
		return res.fields;
	};

	useEffect(() => {
		getKYCData().then(storedData => {
			if (storedData) {
				form.setFieldsValue({
					shareholders: storedData.controllingShareholderInfo?.shareholders || []
				});
			}
		});
	}, [form]);

	const saveFormData = async (values: FormValues) => {
		const controllingShareholdersPayload = {
			shareholders: values.shareholders
		};
		const combinedPayload = {
			controllingShareholderInfo: controllingShareholdersPayload
		};

		await setKYCApi({
			fields: combinedPayload,
			status: "unfilled",
			updateKeys: ["controllingShareholderInfo"]
		});
	};

	const onSubmit = async (values: FormValues) => {
		if (values.shareholders.length < 1) {
			message.error("至少需要填写一名控权股东");
			return;
		}
		await saveFormData(values);
		setOpen(true);
	};

	const handlePrevStep = () => {
		navigate("/form/hkEntityContact");
	};

	return (
		<div className="detail-wrap">
			<div className="recharge-wrap">
				<div className="nav">
					<NavLink to="/login" className="myAccount">
						<img src={back} alt="" className="returnIcon" />
						VoyaPay{" "}
					</NavLink>
					-&gt; KYC 填写
				</div>
				<div className="chargeTips">
					<div className="title">VoyaPay入驻企业合规尽职调查表</div>
					<div className="title">VoyaPay Compliance & KYC Form</div>

					<div className="content">
						<span className="pre">
							&nbsp;&nbsp;&nbsp;&nbsp;*Voyapay合规及风控团队，将结合问卷填写内容，随机开展对客户的风控合规面试、会谈、现场走访等工作。
						</span>
						<span className="pre">
							&nbsp;&nbsp;&nbsp;&nbsp;*The Voyapay Compliance and Risk Control Team will randomly conduct risk control and
							compliance interviews, meetings, and on-site visits with customers based on the content provided in the
							questionnaire.
						</span>
					</div>
				</div>
				<div className="firstCol">
					<div className="accountInfo">
						<div className="title">
							<span style={{ color: "red", marginRight: "10px" }}>*</span>控股股东或实控人信息
						</div>
						<div className="title">
							<span style={{ color: "red", marginRight: "10px" }}>*</span>Controlling Shareholder or Actual Controller Information
						</div>
						<Form
							form={form}
							name="controllingShareholderForm"
							layout="vertical"
							onFinish={onSubmit}
							disabled={kycStatus === "approved"}
						>
							<Form.List name="shareholders">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<Space key={key} style={{ marginBottom: "50px" }} align="baseline">
												{/* Controlling Party/Entity Name */}
												<div className="row">
													<Col span={20}>
														<Form.Item
															{...restField}
															name={[name, "entityName"]}
															label="控股股东或实控人名称 / Controlling Party/Entity Name:"
															rules={[
																{ required: true, message: "控股股东或实际控制人名称或企业名称 / Please enter party/entity name" }
															]}
														>
															<Input placeholder="控股股东或实际控制人名称或企业名称 / Please enter party/entity name" />
														</Form.Item>
													</Col>
													{/* Nationality or Company Location */}
													<Col span={20}>
														<Form.Item
															{...restField}
															name={[name, "nationalityOrLocation"]}
															label="国籍或企业所在地 / Nationality or Company Location:"
															rules={[
																{
																	required: true,
																	message: "请输入国籍或企业所在地 / Please enter nationality or company location"
																}
															]}
														>
															<Input placeholder="请输入国籍或企业所在地 / Please enter nationality or company location" />
														</Form.Item>
													</Col>
													<Col span={20}>
														{/* Position */}
														<Form.Item
															{...restField}
															name={[name, "position"]}
															label="职位 / Position:"
															rules={[{ required: true, message: "请输入职位 / Please enter the position" }]}
														>
															<Input placeholder="请输入职位 / Please enter position" />
														</Form.Item>
													</Col>
												</div>
												<div className="row">
													<Col span={15}>
														{/* SSN/ITIN */}
														<Form.Item {...restField} name={[name, "ssnOrItin"]} label="SSN/ITIN（如有） / SSN/ITIN (if any):">
															<Input placeholder="SSN/ITIN" />
														</Form.Item>
													</Col>
													<Col span={15}>
														{/* Ownership Percentage */}
														<Form.Item
															{...restField}
															name={[name, "ownershipPercentage"]}
															label="股权占比（%） / Ownership Percentage (%):"
															rules={[{ required: true, message: "请输入股权占比 / Please enter ownership percentage" }]}
														>
															<InputNumber
																min={0}
																max={100}
																placeholder="股权占比（%） / Ownership Percentage:"
																style={{ width: "100%" }}
															/>
														</Form.Item>
													</Col>
												</div>
												<Col>
													<Tooltip title="删除此控股股东">
														<DeleteOutlined
															onClick={() => remove(name)}
															style={{ color: "red", cursor: "pointer", fontSize: "20px" }}
														/>
													</Tooltip>
												</Col>
											</Space>
										))}

										{/* Add more fields */}
										<Form.Item>
											<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
												添加控股股东或实控人信息 / Add Controlling Shareholder
											</Button>
										</Form.Item>
									</>
								)}
							</Form.List>

							<div className="btns">
								<Button type="primary" htmlType="submit" style={{ marginRight: "10px" }} onClick={handlePrevStep}>
									上一步 / Prev Step
								</Button>
								<Button type="primary" htmlType="submit">
									下一步 / Next Step
								</Button>
							</div>
						</Form>
						<Modal title="股东" visible={open} onOk={handleOk} onCancel={handleCancel}>
							<p>确认已经填完所有股东?</p>
							<p>Confirm that all shareholders have been filled in?</p>
						</Modal>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ControllingShareholderInfo;
