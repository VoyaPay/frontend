import { Form, Input, Button, Space, Modal, Col, message, Tooltip, Divider, Upload, Row, Select } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { useState, useEffect, Fragment } from "react";
import { FileApi, getKYCApi, setKYCApi } from "@/api/modules/kyc";
import { KYCData } from "@/api/interface";
import KycNav from "../kycNav";
interface Shareholder {
	entityName: string;
	nationalityOrLocation: string;
	directorPassportFile: string;
	documentType: string;
	idNumber: string;
}
interface FormValues {
	shareholders: Shareholder[];
}

const ControllingShareholderInfo = () => {
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const [kycStatus, setKycStatus] = useState<string>("");
	const navigate = useNavigate();
	const [uploadSuccess, setUploadSuccess] = useState({
		passportUpload: true
	});

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
				console.log("storedData", storedData?.controllingShareholderInfo);
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

	const onUploadFileChange = (fileType: string) => (event: { file: any }) => {
		if (event.file.status === "done") {
			console.log("upload success, fileId=", event.file.response.fileId);
			setUploadSuccess(prev => ({ ...prev, [fileType]: true }));
		} else if (event.file.status === "error") {
			console.log("upload failed");
			setUploadSuccess(prev => ({ ...prev, [fileType]: false }));
			message.error("文件传输失败，请重试");
		}
	};

	const onSubmit = async (values: FormValues) => {
		if (!uploadSuccess.passportUpload) {
			message.error("请确保董事护照上传成功 / Please ensure the director passport is uploaded successfully");
			return;
		}
		if (values.shareholders.length < 1) {
			message.error("至少需要填写一名董事");
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
				<KycNav />

				<div className="firstCol">
					<div className="accountInfo">
						<div className="title">董事信息 / Director Information</div>
						<Form
							form={form}
							layout="vertical"
							onFinish={onSubmit}
							name="controllingShareholderForm"
							className="controlling-shareholder-info-form"
							disabled={kycStatus === "approved" || kycStatus === "underReview"}
						>
							<div className="content">
								<div className="left" style={{ alignItems: "initial" }}>
									<Form.List name="shareholders">
										{(fields, { add, remove }) => (
											<>
												{fields.map(({ key, name, ...restField }, index) => (
													<Fragment key={key}>
														<Space style={{ marginBottom: "50px" }} align="start">
															<Row gutter={[16, 0]} style={{ width: "100%" }}>
																<Col span={12}>
																	<Form.Item
																		{...restField}
																		name={[name, "entityName"]}
																		label="董事名称 / Director Name:"
																		rules={[{ required: true, message: "请输入董事名称 / Please enter director name" }]}
																	>
																		<Input />
																	</Form.Item>
																</Col>
																<Col span={12}>
																	<Form.Item
																		{...restField}
																		name={[name, "nationalityOrLocation"]}
																		label="国籍所在地 / Nationality:"
																		rules={[
																			{
																				required: true,
																				message: "请输入国籍所在地 / Please enter nationality"
																			}
																		]}
																	>
																		<Input />
																	</Form.Item>
																</Col>
																<Col span={12}>
																	<Form.Item
																		{...restField}
																		name={[name, "documentType"]}
																		label="证件类型 / Document Type:"
																		rules={[{ required: true, message: "请选择证件类型 / Please select document type" }]}
																	>
																		<Select
																			getPopupContainer={(triggerNode?: HTMLElement | undefined) =>
																				triggerNode?.parentElement as HTMLElement
																			}
																		>
																			<Select.Option value="护照">护照 / Passport</Select.Option>
																			<Select.Option value="身份证">身份证 / National ID</Select.Option>
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
																		<Input />
																	</Form.Item>
																</Col>
																<Col span={12}>
																	<Form.Item
																		name={[name, "directorPassportFile"]}
																		label="董事护照上传 / Director Passport Upload:"
																		valuePropName="fileList"
																		getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
																		rules={[{ required: true, message: "请上传文件 / Please upload the document" }]}
																	>
																		<Upload
																			customRequest={async ({ file, onSuccess, onError }) => {
																				const formData = new FormData();
																				formData.append("file", file);
																				formData.append("usage", "kyc");

																				try {
																					const response = await FileApi(formData);
																					console.log("File uploaded successfully, file ID:", response.fileID);

																					if (onSuccess) {
																						onSuccess(response);
																					}
																				} catch (error: any) {
																					message.error("文件传输失败");
																					console.error("File upload failed:", error);

																					if (onError) {
																						onError(error);
																					}
																				}
																			}}
																			onChange={onUploadFileChange("directorPassportFile")}
																		>
																			<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
																		</Upload>
																	</Form.Item>
																</Col>
															</Row>
															<Row>
																<Col span={12}>
																	<Tooltip title="删除此董事">
																		<DeleteOutlined
																			onClick={() => remove(name)}
																			style={{ color: "red", cursor: "pointer", fontSize: "20px" }}
																		/>
																	</Tooltip>
																</Col>
															</Row>
														</Space>
														{index < fields.length - 1 && <Divider key={`divider-${index}`} />}
													</Fragment>
												))}
												{/* Add more fields */}
												<Form.Item>
													<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
														添加董事 / Add Director
													</Button>
												</Form.Item>
											</>
										)}
									</Form.List>
								</div>
							</div>
							<div className="btns">
								<Button type="primary" style={{ marginRight: "10px", marginLeft: "0px" }} onClick={handlePrevStep}>
									上一步 / Prev Step
								</Button>
								<Button type="primary" htmlType="submit">
									下一步 / Next Step
								</Button>
							</div>
						</Form>
						<Modal title="董事" visible={open} onOk={handleOk} onCancel={handleCancel}>
							<p>确认已经填完所有董事信息?</p>
							<p>Confirm that all directors have been filled in?</p>
						</Modal>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ControllingShareholderInfo;
