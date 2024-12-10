import {
	Form,
	Input,
	Button,
	Space,
	InputNumber,
	Checkbox,
	Upload,
	Modal,
	Col,
	Row,
	message,
	Tooltip,
	Select,
	Divider
} from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { useState, useEffect, useRef, Fragment } from "react";
import { FileApi } from "@/api/modules/kyc";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";
import { KYCData } from "@/api/interface";
import KycTitleNotification from "../kycTitleNotification";
import KycNav from "../kycNav";
import moment from "moment";

const BeneficialOwnerInfo = () => {
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const [totalOwnership, setTotalOwnership] = useState<number>(0);
	const [kycStatus, setKycStatus] = useState<string>("");
	const refStoredData = useRef<any | null>(null);
	const navigate = useNavigate();

	const handleCancel = () => {
		setOpen(false);
	};

	const getKYCData = async () => {
		const res: KYCData = await getKYCApi();
		setKycStatus(res.status || "unfilled");
		return res.fields;
	};

	useEffect(() => {
		getKYCData().then(storedData => {
			refStoredData.current = storedData;
			if (storedData?.beneficialOwnerInfo?.beneficialOwners) {
				const beneficialOwners = storedData.beneficialOwnerInfo.beneficialOwners.map(
					(owner: { expirationDate: moment.MomentInput }) => ({
						...owner,
						expirationDate: owner.expirationDate ? moment(owner.expirationDate) : null
					})
				);
				form.setFieldsValue({
					beneficialOwners
				});
			}
		});
	}, [form]);

	const handleOk = async () => {
		setOpen(false);
		navigate("/company");
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

	const onSubmit = async (values: any) => {
		const combinedPayload = {
			beneficialOwnerInfo: {
				beneficialOwners: values.beneficialOwners
			}
		};
		if (values.beneficialOwners?.length < 1) {
			message.error(
				"需要填写所有直接或者间接拥有25%及以上公司股权的受益人信息 / Please provide information for all beneficial owners who directly or indirectly own 25% or more of the company's shares or voting rights."
			);
			return;
		}

		await setKYCApi({
			fields: combinedPayload,
			status: "unfilled",
			updateKeys: ["beneficialOwnerInfo"]
		}).then(() => {
			setOpen(true);
		});
	};
	const handlePrevStep = () => {
		const isUSEntity = refStoredData.current?.companyBusinessInfo?.isUSEntity === "us";
		if (isUSEntity) {
			navigate("/form/usEntityinfo");
		} else {
			navigate("/form/shareholder");
		}
	};

	return (
		<div className="detail-wrap">
			<div className="recharge-wrap">
				<KycNav />
				<KycTitleNotification />
				<div className="firstCol">
					<div className="accountInfo">
						<div className="title">受益所有人信息 / Beneficial Owner Information</div>

						<Form
							form={form}
							layout="vertical"
							onFinish={onSubmit}
							name="beneficialOwnerForm"
							className="beneficial-owner-info-form"
							disabled={kycStatus === "approved" || kycStatus === "underReview"}
							onValuesChange={(_, allValues) => {
								const totalOwnershipPercentage = allValues.beneficialOwners
									? allValues.beneficialOwners.reduce((sum: number, owner: any) => {
											return sum + (owner?.ownershipPercentage || 0);
									  }, 0)
									: 0;
								setTotalOwnership(totalOwnershipPercentage);
							}}
						>
							<Form.List name="beneficialOwners">
								{(fields, { add, remove }) => (
									<Fragment>
										{fields.map(({ key, name, ...restField }, index) => (
											<Fragment key={key}>
												<Space style={{ display: "flex", marginBottom: 16 }} align="baseline">
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
																name={[name, "documentType"]}
																label="证件类型 / Document Type:"
																rules={[{ required: true, message: "请输入证件类型 / Please enter document type" }]}
															>
																<Select placeholder="请输入证件类型 / Please enter document type">
																	<Select.Option value="Passport">护照 / Passport</Select.Option>
																	<Select.Option value="National ID">身份证 / National ID</Select.Option>
																</Select>
															</Form.Item>
														</Col>

														<Col span={12}>
															<Form.Item
																{...restField}
																name={[name, "idNumber"]}
																label="证件号码 / ID Number:"
																rules={[{ required: true, message: "请输入证件号码 / Please enter ID number" }]}
															>
																<Input placeholder="请输入证件号码 / Please enter ID number" />
															</Form.Item>
														</Col>

														<Col span={12}>
															<Form.Item
																{...restField}
																name={[name, "ssnTin"]}
																label="SSN / ITIN:"
																rules={[{ required: false, message: "请输入SSN / TIN / Please enter SSN / TIN" }]}
															>
																<Input placeholder="请输入SSN / ITIN / Please enter SSN / ITIN" />
															</Form.Item>
														</Col>

														<Col span={12}>
															<Form.Item
																{...restField}
																name={[name, "position"]}
																label="职位 / Position:"
																rules={[{ required: true, message: "请输入职位 / Please enter position" }]}
															>
																<Input placeholder="请输入职位 / Please enter position" />
															</Form.Item>
														</Col>

														<Col span={12}>
															<Form.Item
																{...restField}
																name={[name, "votingRights"]}
																label="是否有投票权 / Voting Rights？:"
																rules={[{ required: true, message: "请选择是否有投票权 / Please select if has voting rights" }]}
															>
																<Select placeholder="请选择是否有投票权 / Please select if has voting rights">
																	<Select.Option value="Yes">是 / Yes</Select.Option>
																	<Select.Option value="No">否 / No</Select.Option>
																</Select>
															</Form.Item>
														</Col>

														<Col span={24}>
															<Form.Item
																name={[name, "uploadFile"]}
																label="持股25%以上股东护照:"
																valuePropName="fileList"
																getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
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
												{index < fields.length - 1 && <Divider key={`divider-${index}`} />}
											</Fragment>
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
									</Fragment>
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
								<Checkbox aria-hidden="true">
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
