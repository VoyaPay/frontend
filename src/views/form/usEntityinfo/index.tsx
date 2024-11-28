import { Button, Form, Input, Select, Upload, DatePicker, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { useEffect, useState } from "react";
import moment from "moment";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { FileApi } from "@/api/modules/kyc";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";

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
		const res = await getKYCApi();
		setKycStatus(res.status || "unfilled");
	};

	useEffect(() => {
		getKYCData();
		const storedData = localStorage.getItem("data");
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			form.setFieldsValue({
				usEntityName: parsedData.usEntityInfo?.usEntityName || "",
				companyWebsite: parsedData.usEntityInfo?.companyWebsite || "",
				usEntityType: parsedData.usEntityInfo?.usEntityType || "",
				usEntityEIN: parsedData.usEntityInfo?.usEntityEIN || "",
				usEntityFormationDate: parsedData.usEntityInfo?.usEntityFormationDate
					? moment(parsedData.usEntityInfo?.usEntityFormationDate)
					: null,
				usEntityRegisteredState: parsedData.usEntityInfo?.usEntityRegisteredState || "",
				usEntityRegisteredAddress: parsedData.usEntityInfo?.usEntityRegisteredAddress || "",
				usEntityOperatingAddress: parsedData.usEntityInfo?.usEntityOperatingAddress || "",
				totalEmployees: parsedData.usEntityInfo?.totalEmployees || "",
				companyFormationFile: parsedData.usEntityInfo?.companyFormationFile || [],
				einDocumentFile: parsedData.usEntityInfo?.einDocumentFile || [],
				operatingAgreementFile: parsedData.usEntityInfo?.operatingAgreementFile || []
			});
		}
	}, [form]);

	// Track upload success
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
		// Check if all uploads were successful before proceeding
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

		const prevInfo = localStorage.getItem("data");
		let combinedPayload = {};

		if (prevInfo) {
			const lastInformation = JSON.parse(prevInfo);
			combinedPayload = {
				...lastInformation,
				usEntityInfo: usEntityPayload
			};
		} else {
			combinedPayload = {
				usEntityInfo: usEntityPayload
			};
		}

		await setKYCApi({ fields: combinedPayload, status: "unfilled" }).then(() => {
			localStorage.setItem("data", JSON.stringify(combinedPayload));
		});

		message.success("US Entity Information saved successfully!");
		navigate("/form/beneficical");
	};

	const handlePrevStep = () => {
		const values = form.getFieldsValue();
		const usEntityPayload = {
			...values,
			usEntityFormationDate: values.usEntityFormationDate ? values.usEntityFormationDate.format("YYYY-MM-DD") : ""
		};

		const prevInfo = localStorage.getItem("data");
		let combinedPayload = {};

		if (prevInfo) {
			const lastInformation = JSON.parse(prevInfo);
			combinedPayload = {
				...lastInformation,
				usEntityInfo: usEntityPayload
			};
		} else {
			combinedPayload = {
				usEntityInfo: usEntityPayload
			};
		}

		localStorage.setItem("data", JSON.stringify(combinedPayload));
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
						<div className="title">入驻企业美国主体主要信息</div>
						<div className="title">US Entity Information</div>

						<Form
							form={form}
							name="usEntityForm"
							layout="vertical"
							onFinish={onSubmit}
							disabled={kycStatus === "approved"}
						>
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
								rules={[{ required: true, message: "请输入美国主体注册州 / Please enter US Entity Registered State" }]}
							>
								<Input placeholder="请输入美国主体注册州 / Please enter US Entity Registered State" />
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
									onChange={onUploadFileChange("operatingAgreementFile")}
								>
									<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
								</Upload>
							</Form.Item>

							<div className="btns">
								<Button
									type="primary"
									style={{ marginRight: "10px" }}
									onClick={handlePrevStep}
								>
									上一步 / Prev Step
								</Button>
								<Button
									type="primary"
									htmlType="submit"
									disabled={
										!uploadSuccess.companyFormationFile ||
										!uploadSuccess.einDocumentFile ||
										!uploadSuccess.operatingAgreementFile
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
