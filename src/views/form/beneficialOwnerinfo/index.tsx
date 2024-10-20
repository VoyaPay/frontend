import { Form, Input, Button, Space, InputNumber, Checkbox, Upload, Modal, Col, Row, message, Tooltip } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FileApi } from "@/api/modules/form";

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
	const onUploadFileChange = (event: { file: any }) => {
		if (event.file.status === "done") {
			console.log("upload success, fileId=", event.file.response.fileId);
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
		if (beneficialOwnersPayload.beneficialOwners.length < 1) {
			message.error(
				"需要填写所有直接或者间接拥有25%及以上公司股权的受益人信息 / Please provide information for all beneficial owners who directly or indirectly own 25% or more of the company's shares or voting rights."
			);
			return;
		}

		localStorage.setItem("data", JSON.stringify(combinedPayload));
		console.log("Combined Payload:", combinedPayload);

		setOpen(true);
	};
	const handlePrevStep = () => {
		const formData = form.getFieldsValue(); // Get the current form values
		const existingData = localStorage.getItem("data") || "";
		let combinedPayload = {};

		if (existingData) {
			const parsedData = JSON.parse(existingData);
			combinedPayload = {
				...parsedData,
				beneficialOwnerInfo: { beneficialOwners: formData.beneficialOwners }
			};
		} else {
			combinedPayload = {
				beneficialOwnerInfo: { beneficialOwners: formData.beneficialOwners }
			};
		}

		localStorage.setItem("data", JSON.stringify(combinedPayload)); // Save updated data
		const data = JSON.parse(existingData);

		const isUSEntity = data?.companyBusinessInfo?.isUSEntity === "us";

		if (isUSEntity) {
			navigate("/form/usEntityinfo");
		} else {
			navigate("/form/shareholder");
		}
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
							<span style={{ color: "red", marginRight: "10px" }}>*</span>受益所有人信息
						</div>
						<div className="title">
							<span style={{ color: "red", marginRight: "10px" }}>*</span>Beneficial Owner Information
						</div>

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
															name={[name, "uploadFile"]}
															label="持股25%以上股东的身份证或护照（正反面照片） / ID or Passport of Shareholder:"
															valuePropName="fileList"
															getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)} // 确保文件列表正确处理
															rules={[{ required: true, message: "请上传文件 / Please upload the document" }]}
														>
															<Upload
																// 使用 customRequest 自定义上传逻辑
																customRequest={async ({ file, onSuccess, onError }) => {
																	const formData = new FormData();
																	formData.append("file", file); // 将文件添加到 formData
																	formData.append("usage", "kyc"); // 添加其他参数

																	try {
																		const response = await FileApi(formData); // 等待 FileApi 返回结果
																		console.log("File uploaded successfully, file ID:", response.fileID);

																		// 检查 onSuccess 是否存在
																		if (onSuccess) {
																			onSuccess(response); // 成功回调，通知上传成功
																		}
																	} catch (error) {
																		message.error("文件传输失败");
																		console.error("File upload failed:", error);

																		// 检查 onError 是否存在，并将 error 断言为 UploadRequestError 类型
																		if (onError) {
																			message.error("文件传输失败");
																			onError(error as any); // 失败回调，通知上传失败
																		}
																	}
																}}
																onChange={onUploadFileChange} // 处理文件状态变化
															>
																<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
															</Upload>
														</Form.Item>
													</Col>
												</Row>
												<Col>
													<Tooltip title="删除此受益人">
														<DeleteOutlined
															onClick={() => remove(name)}
															style={{ color: "red", cursor: "pointer", fontSize: "20px" }}
														/>
													</Tooltip>
												</Col>
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
									<p>
										<span style={{ color: "red", marginRight: "10px" }}>*</span>
										我确认我已完整如实填写所有直接或者间接拥有25%及以上公司股权或表决权的受益人信息
									</p>
									<p>
										<span style={{ color: "red", marginRight: "10px" }}>*</span>I confirm that I have fully and truthfully
										provided the information of all beneficial owners who directly or indirectly own 25% or more of the company’s
										shares or voting rights.
									</p>
								</Checkbox>
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									disabled={totalOwnership > 100}
									style={{ marginRight: "10px" }}
									onClick={handlePrevStep}
								>
									上一步 / Prev Step
								</Button>

								<Button type="primary" htmlType="submit" disabled={totalOwnership > 100}>
									下一步 / Next Step
								</Button>
							</Form.Item>
						</Form>

						<Modal title="受益人" visible={open} onOk={handleOk} onCancel={handleCancel}>
							<p>
								<span style={{ color: "red", marginRight: "10px" }}>*</span>
								我确认我已完整如实填写所有直接或者间接拥有25%及以上公司股权或表决权的受益人信息
							</p>
							<p>
								<span style={{ color: "red", marginRight: "10px" }}>*</span>I confirm that I have fully and truthfully provided
								the information of all beneficial owners who directly or indirectly own 25% or more of the company’s shares or
								voting rights.
							</p>
						</Modal>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BeneficialOwnerInfo;
