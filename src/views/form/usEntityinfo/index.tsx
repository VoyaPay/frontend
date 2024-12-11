import { Button, Form, Input, Select, Upload, DatePicker, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { useEffect, useState } from "react";
import moment from "moment";
import { FileApi } from "@/api/modules/kyc";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";
import { KYCData } from "@/api/interface";
import KycNav from "../kycNav";
import { states } from "@/routers/utils/dict";

interface FormValues {
	usEntityName: string;
	companyWebsite: string;
	usEntityType: string;
	usEntityEIN: string;
	usEntityFormationDate: any;
	usEntityRegisteredState: string;
	usEntityRegisteredAddress: string;
	usEntityOperatingAddress: string;
	totalEmployees: string;
	companyFormationFile: any;
	einDocumentFile: any;
	operatingAgreementFile: any;
}

const UsEntityInfo = () => {
	const { Option } = Select;
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [kycStatus, setKycStatus] = useState<string>("");
	const [uploadSuccess, setUploadSuccess] = useState({
		companyFormationFile: true,
		einDocumentFile: true,
		operatingAgreementFile: true
	});

	const getKYCData = async () => {
		const res: KYCData = await getKYCApi();
		setKycStatus(res.status || "unfilled");
		return res.fields;
	};

	useEffect(() => {
		getKYCData().then(storedData => {
			if (storedData) {
				form.setFieldsValue({
					usEntityName: storedData.usEntityInfo?.usEntityName || "",
					companyWebsite: storedData.usEntityInfo?.companyWebsite || "",
					usEntityType: storedData.usEntityInfo?.usEntityType || "",
					usEntityEIN: storedData.usEntityInfo?.usEntityEIN || "",
					usEntityFormationDate: storedData.usEntityInfo?.usEntityFormationDate
						? moment(storedData.usEntityInfo?.usEntityFormationDate)
						: null,
					usEntityRegisteredState: storedData.usEntityInfo?.usEntityRegisteredState || "",
					usEntityRegisteredAddress: storedData.usEntityInfo?.usEntityRegisteredAddress || "",
					usEntityOperatingAddress: storedData.usEntityInfo?.usEntityOperatingAddress || "",
					totalEmployees: storedData.usEntityInfo?.totalEmployees || "",
					companyFormationFile: storedData.usEntityInfo?.companyFormationFile || [],
					einDocumentFile: storedData.usEntityInfo?.einDocumentFile || [],
					operatingAgreementFile: storedData.usEntityInfo?.operatingAgreementFile || []
				});
			}
		});
	}, [form]);

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
		if (!uploadSuccess.companyFormationFile || !uploadSuccess.einDocumentFile || !uploadSuccess.operatingAgreementFile) {
			message.error("请确保所有文件上传成功 / Please ensure all files are uploaded successfully");
			return;
		}

		const usEntityPayload = {
			usEntityName: values.usEntityName,
			companyWebsite: values.companyWebsite,
			usEntityType: values.usEntityType,
			usEntityEIN: values.usEntityEIN,
			usEntityFormationDate: values.usEntityFormationDate ? values.usEntityFormationDate.format("YYYY-MM-DD") : "",
			usEntityRegisteredState: values.usEntityRegisteredState,
			usEntityRegisteredAddress: values.usEntityRegisteredAddress,
			usEntityOperatingAddress: values.usEntityOperatingAddress,
			totalEmployees: values.totalEmployees,
			companyFormationFile: values.companyFormationFile,
			einDocumentFile: values.einDocumentFile,
			operatingAgreementFile: values.operatingAgreementFile
		};
		const combinedPayload = {
			usEntityInfo: usEntityPayload
		};
		await setKYCApi({ fields: combinedPayload, status: "unfilled", updateKeys: ["usEntityInfo"] }).then(() => {
			message.success("US Entity Information saved successfully!");
			navigate("/form/beneficical");
		});
	};

	const handlePrevStep = () => {
		navigate("/form/companyBusiness");
	};

	const validateAlphanumeric = (_: any, value: string) => {
		const regex = /^[a-zA-Z0-9\s]*$/;
		if (value && !regex.test(value)) {
			return Promise.reject(new Error("只能输入英语和数字"));
		}
		return Promise.resolve();
	};

	return (
		<div className="detail-wrap">
			<div className="recharge-wrap">
				<KycNav />

				<div className="firstCol">
					<div className="accountInfo">
						<div className="title">入驻企业美国主体信息 / US Entity Information</div>
						<Form
							form={form}
							name="usEntityForm"
							layout="vertical"
							onFinish={onSubmit}
							disabled={kycStatus === "approved" || kycStatus === "underReview"}
						>
							<div className="content">
								<div className="left" style={{ alignItems: "initial" }}>
									<Form.Item
										name="usEntityName"
										label="美国主体全称 / US Entity Legal Name:"
										rules={[
											{ required: true, message: "请输入美国主体全称 / Please enter the US Entity Legal Name" },
											{ validator: validateAlphanumeric }
										]}
									>
										<Input placeholder="请输入美国主体全称 / Please enter US Entity Legal Name" />
									</Form.Item>

									<Form.Item
										name="companyWebsite"
										label="企业网站链接 / Company Website:"
										rules={[{ required: true, message: "请选择企业网站链接 / Please select the US Entity Type" }]}
									>
										<Input placeholder="请输入企业网站链接 / Please enter Company Website" />
									</Form.Item>

									<Form.Item
										name="usEntityType"
										label="美国主体类型 / US Entity Type:"
										rules={[{ required: true, message: "请选择美国主体类型 / Please select the US Entity Type" }]}
									>
										<Select placeholder="请选择美国主体类型 / Select US Entity Type">
											<Option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</Option>
											<Option value="Partnership">Partnership</Option>
											<Option value="Cooperative">Cooperative</Option>
											<Option value="Corporation">Corporation</Option>
											<Option value="Sole Partnership">Sole Partnership</Option>
										</Select>
									</Form.Item>

									<Form.Item
										name="usEntityEIN"
										label="美国主体EIN(9位数) / US Entity EIN:"
										rules={[
											{ required: true, message: "请输入美国主体EIN / Please enter US Entity EIN" },
											{ len: 9, message: "EIN必须是9位数字 / EIN must be 9 digits long" }
										]}
									>
										<Input placeholder="请输入美国主体EIN / Please enter US Entity EIN" />
									</Form.Item>

									<Form.Item
										name="usEntityFormationDate"
										label="美国主体成立时间 / US Entity Formation Date:"
										rules={[{ required: true, message: "请选择美国主体成立时间 / Please select the US Entity Formation Date" }]}
									>
										<DatePicker placeholder="请选择成立时间 / Select Formation Date" style={{ width: "100%" }} />
									</Form.Item>

									<Form.Item
										name="usEntityRegisteredState"
										label="美国主体注册州 / US Entity Registered State:"
										rules={[{ required: true, message: "请选择美国主体注册州 / Please select the US Entity Registered State" }]}
									>
										<Select placeholder="请选择美国主体注册州 / Select US Entity Registered State" showSearch>
											{states.map(state => (
												<Option key={state} value={state}>
													{state}
												</Option>
											))}
										</Select>
									</Form.Item>

									<Form.Item
										name="usEntityRegisteredAddress"
										label="美国主体注册地址 / US Entity Registered Address:"
										rules={[{ required: true, message: "请输入美国主体注册地址 / Please enter US Entity Registered Address" }]}
									>
										<Input placeholder="请输入美国主体注册地址 / Please enter US Entity Registered Address" />
									</Form.Item>

									<Form.Item
										name="usEntityOperatingAddress"
										label="美国主体运营地址 / US Entity Operating Address:"
										rules={[{ required: true, message: "请输入美国主体运营地址 / Please enter US Entity Operating Address" }]}
									>
										<Input placeholder="请输入美国主体运营地址 / Please enter US Entity Operating Address" />
									</Form.Item>

									<Form.Item
										name="totalEmployees"
										label="企业总员工人数 / Total Number of Employees:"
										rules={[
											{ required: true, message: "请输入企业总员工人数 / Please enter Total Number of Employees" },
											{ validator: validateAlphanumeric }
										]}
									>
										<Input placeholder="请输入总员工人数 / Please enter total number of employees" />
									</Form.Item>
									<Form.Item
										name="companyFormationFile"
										label="公司注册文件 / Company Formation Article:"
										valuePropName="fileList" // 使用fileList来传递多个文件
										getValueFromEvent={e => e?.fileList ?? []}
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

													if (onSuccess) {
														onSuccess(response); // 成功回调，通知上传成功
													}
												} catch (error: any) {
													message.error("文件传输失败");
													console.error("File upload failed:", error);

													if (onError) {
														onError(error); // 失败回调，通知上传失败
													}
												}
											}}
											onChange={onUploadFileChange("companyFormationFile")} // 处理文件状态变化
										>
											<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
										</Upload>
									</Form.Item>
									<Form.Item
										name="einDocumentFile"
										label="雇主税号文件（EIN）/ EIN Document:"
										valuePropName="fileList"
										getValueFromEvent={e => e?.fileList ?? []}
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
											onChange={onUploadFileChange("einDocumentFile")}
										>
											<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
										</Upload>
									</Form.Item>
									<Form.Item
										name="operatingAgreementFile"
										label="公司章程 / Operating Agreement:"
										valuePropName="fileList"
										getValueFromEvent={e => e?.fileList ?? []}
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
											onChange={onUploadFileChange("operatingAgreementFile")}
										>
											<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
										</Upload>
									</Form.Item>
								</div>
							</div>
							<div className="btns">
								<Button type="primary" style={{ marginRight: "10px", marginLeft: "0px" }} onClick={handlePrevStep}>
									上一步 / Prev Step
								</Button>
								<Button
									type="primary"
									htmlType="submit"
									disabled={
										!uploadSuccess.companyFormationFile || !uploadSuccess.einDocumentFile || !uploadSuccess.operatingAgreementFile
									}
								>
									下一步 / Next Step
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UsEntityInfo;
