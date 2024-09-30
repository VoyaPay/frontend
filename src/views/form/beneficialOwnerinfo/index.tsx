import { Form, Input, Button, Space, InputNumber, Checkbox, Upload, Modal, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useState } from "react";

// Define the types for form values
interface FormValues {
	industry: string;
	businessDescription: string;
	monthlySpend: string;
}
const beneficialOwnerinfo = () => {
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);

	const navigate = useNavigate();
	const handleCancel = () => {
		setOpen(false);
	};
	const handleOk = async () => {
		navigate("/form/chinesecompany");
	};

	const onSubmit = (values: FormValues) => {
		console.log("Submitted Values:", values);
		setOpen(true);
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
							&nbsp;&nbsp;&nbsp;&nbsp;
							*Voyapay合规及风控团队，将结合问卷填写内容，随机开展对客户的风控合规面试、会谈、现场走访等工作。
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
						<div className="title">控股股东或实控人信息</div>
						<div className="title">Controlling Shareholder or Actual Controller INformation</div>
						<Form form={form} name="beneficialOwnerForm" layout="vertical" onFinish={onSubmit}>
							<Form.List name="beneficialOwners">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											
											<Space key={key} style={{ marginBottom: "50px" }} align="baseline">
												<div className="row">
													{/* Individual Name */}
													<Col span={15}>
														<Form.Item
															{...restField}
															name={[name, "individualName"]}
															label="自然人名称 / Individual Name"
															rules={[{ required: true, message: "请输入自然人名称 / Please enter the individual's name" }]}
														>
															<Input placeholder="请输入自然人名称 / Please enter the individual's name" />
														</Form.Item>
													</Col>

													{/* Nationality */}
													<Col span={15}>
														<Form.Item
															{...restField}
															name={[name, "nationality"]}
															label="国籍 / Nationality"
															rules={[{ required: true, message: "请输入国籍 / Please enter nationality" }]}
														>
															<Input placeholder="请输入国籍 / Please enter nationality" />
														</Form.Item>
													</Col>

													{/* Residential Address */}
													<Col span={15}>
														<Form.Item
															{...restField}
															name={[name, "address"]}
															label="住址 / Residential Address"
															rules={[{ required: true, message: "请输入住址 / Please enter residential address" }]}
														>
															<Input placeholder="请输入住址 / Please enter residential address" />
														</Form.Item>
													</Col>

													{/* Document Type */}
													<Col span={15}>
														<Form.Item
															{...restField}
															name={[name, "documentType"]}
															label="证件类型 / Document Type"
															rules={[{ required: true, message: "请输入证件类型 / Please enter document type" }]}
														>
															<Input placeholder="请输入证件类型 / Please enter document type" />
														</Form.Item>
													</Col>
												</div>

												<div className="row">
													{/* ID Number */}
													<Col span={20}>
														<Form.Item
															{...restField}
															name={[name, "idNumber"]}
															label="证件号码 / ID Number"
															rules={[{ required: true, message: "请输入证件号码 / Please enter ID number" }]}
														>
															<Input placeholder="请输入证件号码 / Please enter ID number" />
														</Form.Item>
													</Col>

													{/* Expiration Date */}
													<Col span={20}>
														<Form.Item
															{...restField}
															name={[name, "expirationDate"]}
															label="证件有效期 / Expiration Date"
															rules={[{ required: true, message: "请输入证件有效期 / Please enter expiration date" }]}
														>
															<Input placeholder="请输入证件有效期 / Please enter expiration date" />
														</Form.Item>
													</Col>

													{/* ID Issuing Country */}
													<Col span={20}>
														<Form.Item
															{...restField}
															name={[name, "idIssuingCountry"]}
															label="证件发放国家 / ID Issuing Country"
															rules={[{ required: true, message: "请输入证件发放国家 / Please enter ID issuing country" }]}
														>
															<Input placeholder="请输入证件发放国家 / Please enter ID issuing country" />
														</Form.Item>
													</Col>

													{/* SSN/ITIN */}
													<Col span={20}>
														<Form.Item {...restField} name={[name, "ssnOrItin"]} label="SSN/ITIN（如有） / SSN/ITIN (if any)">
															<Input placeholder="SSN/ITIN" />
														</Form.Item>
													</Col>
												</div>
												<div className="row">
													{/* Position */}
													<Col span={20}>
														<Form.Item
															{...restField}
															name={[name, "position"]}
															label="职位 / Position"
															rules={[{ required: true, message: "请输入职位 / Please enter position" }]}
														>
															<Input placeholder="请输入职位 / Please enter position" />
														</Form.Item>
													</Col>

													{/* Ownership Percentage */}
													<Col span={20}>
														<Form.Item
															{...restField}
															name={[name, "ownershipPercentage"]}
															label="股权占比（%） / Ownership Percentage (%)"
															rules={[{ required: true, message: "请输入股权占比 / Please enter ownership percentage" }]}
														>
															<InputNumber
																min={0}
																max={100}
																placeholder="股权占比（%） / Ownership Percentage"
																style={{ width: "100%" }}
															/>
														</Form.Item>
													</Col>

													{/* Voting Rights */}
													<Col span={20}>
														<Form.Item
															{...restField}
															name={[name, "votingRights"]}
															label="是否有投票权 / Voting Rights?"
															rules={[{ required: true, message: "请选择是否有投票权 / Please select voting rights status" }]}
														>
															<Checkbox>Yes</Checkbox>
														</Form.Item>
													</Col>

													{/* File Upload */}
													<Col span={20}>
														<Form.Item
															{...restField}
															name={[name, "uploadFile"]}
															label="持股25%以上股东的身份证或护照（正反面照片） / ID or Passport of Shareholder "
															valuePropName="fileList"
															getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
															rules={[{ required: true, message: "请上传文件 / Please upload the document" }]}
														>
															<Upload name="document" action="/upload" listType="picture">
																<Button icon={<UploadOutlined />}>上传文件 / Upload Document</Button>
															</Upload>
														</Form.Item>
													</Col>
												</div>

												<MinusCircleOutlined onClick={() => remove(name)} />
											</Space>
											
										))}

										{/* Add more fields */}
										<Form.Item>
											<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
												添加新的受益人 / Add New Beneficiary
											</Button>
										</Form.Item>
									</>
								)}
							</Form.List>

							{/* Confirmation Checkbox */}
							<Form.Item
								name="confirmation"
								valuePropName="checked"
								rules={[
									{
										validator: (_, value) =>
											value
												? Promise.resolve()
												: Promise.reject(new Error("请确认所有受益人信息已填写 / Please confirm all beneficiaries"))
									}
								]}
							>
								<Checkbox>
									我确认我已完整如实填写所有直接或者间接拥有超过25%公司股权或者表决权的受益人信息 (I confirm that I have fully
									and truthfully provided the information of all beneficial owners who directly or indirectly hold more than 25%
									of the company’s equity or voting rights.)
								</Checkbox>
							</Form.Item>

							<div className="btns">
								<Button type="primary" htmlType="submit">
									下一步 / Next Step
								</Button>
							</div>
						</Form>
						<Modal title="受益人" visible={open} onOk={handleOk} onCancel={handleCancel}>
							<p>我确认我已完整如实填写所有直接或者间接拥有超过25%公司股权或者表决权的受益人信息</p>
							<p>
								I confirm that I have fully and truthfully provided the information of all beneficial owners who directly or
								indirectly hold more than 25% of the company’s equity or voting rights
							</p>
						</Modal>
						;
					</div>
				</div>
			</div>
		</div>
	);
};

export default beneficialOwnerinfo;
