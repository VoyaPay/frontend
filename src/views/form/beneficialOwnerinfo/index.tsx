import { Form, Input, Button, Space, InputNumber, Checkbox, Upload, Modal, Col, Row, message } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const BeneficialOwnerInfo = () => {
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const [totalOwnership, setTotalOwnership] = useState<number>(0);

	const navigate = useNavigate();

	const handleCancel = () => {
		setOpen(false);
	};
	useEffect(() => {
		const storedData = localStorage.getItem("data");
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			// Set form values if beneficial owner info exists
			form.setFieldsValue({
				beneficialOwners: parsedData.beneficialOwnerInfo?.beneficialOwners || []
			});
		}
	}, [form]);

	const handleOk = async () => {
		setOpen(false);
		navigate("/form/chinesecompany");
	};

	const handleOwnershipChange = (value: number) => {
		if (value > 100) {
			message.error("股权占比不能超过100%");
		}
	};

	const onSubmit = (values: any) => {
		const email = localStorage.getItem("data") || "";
		if (!email) {
			console.error("Email not found in localStorage");
			return;
		}

		// Save the beneficial owner data to localStorage
		const beneficialOwnersPayload = {
			beneficialOwners: values.beneficialOwners
		};

		const existingData = localStorage.getItem("data");
		let combinedPayload = {};

		if (existingData) {
			const parsedData = JSON.parse(existingData);
			combinedPayload = {
				...parsedData,
				beneficialOwnerInfo: beneficialOwnersPayload
			};
		} else {
			combinedPayload = {
				beneficialOwnerInfo: beneficialOwnersPayload
			};
		}

		localStorage.setItem("data", JSON.stringify(combinedPayload));
		console.log("Combined Payload:", combinedPayload);

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
						<div className="title">受益所有人信息</div>
						<div className="title">Beneficial Owner Information</div>

						<Form
							form={form}
							name="beneficialOwnerForm"
							layout="vertical"
							onFinish={onSubmit}
							onValuesChange={(_, allValues) => {
								const totalOwnershipPercentage = allValues.beneficialOwners
									? allValues.beneficialOwners.reduce((sum: number, owner: any) => {
											return sum + (owner?.ownershipPercentage || 0); // Safely access ownershipPercentage
									  }, 0)
									: 0; // Default to 0 if beneficialOwners does not exist
								setTotalOwnership(totalOwnershipPercentage);
							}}
						>
							<Form.List name="beneficialOwners">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<Space key={key} style={{ display: "flex", marginBottom: 16 }} align="baseline">
												<Row gutter={[16, 16]} style={{ width: "100%" }}>
													<Col span={12}>
														<Form.Item
															{...restField}
															name={[name, "individualName"]}
															label="自然人名称 / Individual Name:"
															rules={[{ required: true, message: "请输入自然人名称 / Please enter the individual's name" }]}
														>
															<Input placeholder="请输入自然人名称 / Please enter the individual's name" />
														</Form.Item>
													</Col>

													<Col span={12}>
														<Form.Item
															{...restField}
															name={[name, "nationality"]}
															label="国籍 / Nationality:"
															rules={[{ required: true, message: "请输入国籍 / Please enter nationality" }]}
														>
															<Input placeholder="请输入国籍 / Please enter nationality" />
														</Form.Item>
													</Col>

													<Col span={12}>
														<Form.Item
															{...restField}
															name={[name, "address"]}
															label="住址 / Residential Address:"
															rules={[{ required: true, message: "请输入住址 / Please enter residential address" }]}
														>
															<Input placeholder="请输入住址 / Please enter residential address" />
														</Form.Item>
													</Col>

													<Col span={12}>
														<Form.Item
															{...restField}
															name={[name, "ownershipPercentage"]}
															label="股权占比（%） / Ownership Percentage (%):"
															rules={[{ required: true, message: "请输入股权占比 / Please enter ownership percentage" }]}
														>
															<InputNumber
																placeholder="股权占比（%） / Ownership Percentage"
																style={{ width: "100%" }}
																onChange={handleOwnershipChange}
															/>
														</Form.Item>
													</Col>

													<Col span={12}>
														<Form.Item
															{...restField}
															name={[name, "uploadFile"]}
															label="持股25%以上股东的身份证或护照（正反面照片） / ID or Passport of Shareholder:"
															valuePropName="fileList"
															getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)} // Ensure the file list is properly handled
															rules={[{ required: true, message: "请上传文件 / Please upload the document" }]}
														>
															<Upload
																beforeUpload={() => false} // Prevent automatic upload
																listType="picture" // Display file as a picture
															>
																<Button icon={<UploadOutlined />}>上传文件 / Upload Document</Button>
															</Upload>
														</Form.Item>
													</Col>

													<MinusCircleOutlined onClick={() => remove(name)} />
												</Row>
											</Space>
										))}

										{fields.length < 4 && (
											<Form.Item>
												<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
													添加新的受益人 / Add New Beneficiary
												</Button>
											</Form.Item>
										)}

										{fields.length >= 4 && (
											<Form.Item>
												<span style={{ color: "red" }}>
													您最多可以添加四个受益人 / You can add a maximum of four beneficiaries
												</span>
											</Form.Item>
										)}
									</>
								)}
							</Form.List>

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
									我确认我已完整如实填写所有直接或者间接拥有超过25%公司股权或者表决权的受益人信息 (I confirm that I have fully and
									truthfully provided the information of all beneficial owners who directly or indirectly hold more than 25% of
									the company’s equity or voting rights.)
								</Checkbox>
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit" disabled={totalOwnership > 100}>
									下一步 / Next Step
								</Button>
							</Form.Item>
						</Form>

						<Modal title="受益人" visible={open} onOk={handleOk} onCancel={handleCancel}>
							<p>我确认我已完整如实填写所有直接或者间接拥有超过25%公司股权或者表决权的受益人信息</p>
							<p>
								I confirm that I have fully and truthfully provided the information of all beneficial owners who directly or
								indirectly hold more than 25% of the company’s equity or voting rights.
							</p>
						</Modal>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BeneficialOwnerInfo;
