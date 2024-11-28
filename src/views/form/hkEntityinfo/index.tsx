import { Button, Form, Input, InputNumber, DatePicker, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { FileApi } from "@/api/modules/kyc";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";

// Define the types for form values
interface FormValues {
	hkEntityName: string;
	companyWebsite: string;
	certificateNo: string;
	commencementDate: string;
	expiryDate: string;
	registeredAddress: string;
	totalEmployees: number;
	businessRegistration: any;
	companyIncorporation: any;
	incorporationForm: any;
	annualReturn: any;
	companyArticles: any;
}

const HKEntityInfo = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [uploadSuccess, setUploadSuccess] = useState({
		businessRegistration: true,
		companyIncorporation: true,
		incorporationForm: true,
		annualReturn: true,
		companyArticles: true
	});

	// Load saved data from localStorage when the component is mounted
	useEffect(() => {
		getKYCData();
		const storedData = localStorage.getItem("data");
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			// Set form values if data exists
			form.setFieldsValue({
				hkEntityName: parsedData.hkEntityInfo?.hkEntityName || "",
				companyWebsite: parsedData.hkEntityInfo?.companyWebsite || "",
				certificateNo: parsedData.hkEntityInfo?.certificateNo || "",
				commencementDate: parsedData.hkEntityInfo?.commencementDate
					? moment(parsedData.hkEntityInfo?.commencementDate) // Convert date to moment
					: null,
				expiryDate: parsedData.hkEntityInfo?.expiryDate
					? moment(parsedData.hkEntityInfo?.expiryDate) // Convert date to moment
					: null,
				registeredAddress: parsedData.hkEntityInfo?.registeredAddress || "",
				totalEmployees: parsedData.hkEntityInfo?.totalEmployees || "",
				businessRegistration: parsedData.hkEntityInfo?.businessRegistration,
				companyIncorporation: parsedData.hkEntityInfo?.companyIncorporation,
				incorporationForm: parsedData.hkEntityInfo?.incorporationForm,
				annualReturn: parsedData.hkEntityInfo?.annualReturn,
				companyArticles: parsedData.hkEntityInfo?.companyArticles
			});
		}
	}, [form]);

	const getKYCData = async () => {
		await getKYCApi();
	};

	const saveFormData = async (values: FormValues) => {
		const existingData = localStorage.getItem("data") || "";
		const parsedData = existingData ? JSON.parse(existingData) : {};

		const updatedData = {
			...parsedData,
			hkEntityInfo: values
		};

		await setKYCApi({ fields: updatedData, status: "unfilled" }).then(() => {
			localStorage.setItem("data", JSON.stringify(updatedData));
		});
	};

	// Handle form submission
	const onSubmit = async (values: FormValues) => {
		if (!Object.values(uploadSuccess).every(success => success)) {
			message.error("请确保所有文件上传成功 / Please ensure all files are successfully uploaded.");
			return;
		}
		await saveFormData(values); // Save the form data to localStorage
		navigate("/form/shareholder");
	};

	// Handle navigating to the previous step
	const handlePrevStep = () => {
		const values = form.getFieldsValue();
		saveFormData(values); // Save the current form data
		navigate("/form/companyBusiness"); // Navigate to the previous step
	};

	// Handle form submission failure
	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	// Handle file upload
	const onUploadFileChange = (fileType: string) => (event: { file: any }) => {
		if (event.file.status === "done") {
			setUploadSuccess(prev => ({ ...prev, [fileType]: true }));
		} else if (event.file.status === "error") {
			setUploadSuccess(prev => ({ ...prev, [fileType]: false }));
			message.error("文件传输失败 / File upload failed.");
		}
	};

	// Alphanumeric validation
	const validateAlphanumeric = (_: any, value: string) => {
		const regex = /^[a-zA-Z0-9\s]*$/;
		if (value && !regex.test(value)) {
			return Promise.reject(new Error("只能输入英语和数字 / Only English letters and numbers are allowed."));
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
						<div className="title">入驻企业香港主体主要信息</div>
						<div className="title">HK Entity Information</div>

						<Form form={form} name="hkEntityForm" layout="vertical" onFinish={onSubmit} onFinishFailed={onFinishFailed}>
							<Form.Item
								name="hkEntityName"
								label="香港主体全称 / HK Entity Legal Name:"
								rules={[
									{ required: true, message: "请输入香港主体全称 / Please enter the entity legal name" },
									{ validator: validateAlphanumeric }
								]}
							>
								<Input placeholder="请输入香港主体全称 / Please enter the legal name" />
							</Form.Item>

							<Form.Item
								name="companyWebsite"
								label="入网企业企业网站链接 / Company Website:"
								rules={[{ required: true, message: "请输入公司网站链接 / Please enter the website link" }]}
							>
								<Input placeholder="请输入公司网站链接 / Please enter company website" />
							</Form.Item>

							<Form.Item
								name="certificateNo"
								label="商业登记证号码 / Certificate No.:"
								rules={[
									{ required: true, message: "请输入商业登记证号码 / Please enter certificate number" },
									{ validator: validateAlphanumeric }
								]}
							>
								<Input placeholder="请输入商业登记证号码 / Please enter certificate number" />
							</Form.Item>

							<Form.Item
								name="commencementDate"
								label="生效日期 / Date of Commencement:"
								rules={[{ required: true, message: "请输入生效日期 / Please enter the date of commencement" }]}
							>
								<DatePicker placeholder="请选择成立时间 / Select Formation Date" style={{ width: "100%" }} />
							</Form.Item>

							<Form.Item
								name="expiryDate"
								label="届满日期 / Date of Expiry:"
								rules={[{ required: true, message: "请输入届满日期 / Please enter the expiry date" }]}
							>
								<DatePicker placeholder="请选择成立时间 / Select Formation Date" style={{ width: "100%" }} />
							</Form.Item>

							<Form.Item
								name="registeredAddress"
								label="香港主体注册地址 / HK Entity Registered Address:"
								rules={[
									{ required: true, message: "请输入注册地址 / Please enter registered address" },
									{ validator: validateAlphanumeric }
								]}
							>
								<Input placeholder="请输入香港主体注册地址 / Please enter the registered address" />
							</Form.Item>

							<Form.Item
								name="totalEmployees"
								label="企业总员工人数 / Total Number of Employees:"
								rules={[{ required: true, message: "请输入员工总人数 / Please enter total number of employees" }]}
							>
								<InputNumber placeholder="请输入员工总人数 / Please enter total number of employees" style={{ width: "100%" }} />
							</Form.Item>

							{/* File Uploads */}
							{["businessRegistration", "companyIncorporation", "incorporationForm", "annualReturn", "companyArticles"].map(
								fileType => (
									<Form.Item
										key={fileType}
										name={fileType}
										label={`${fileType === "businessRegistration"
											? "商业登记证（BR）"
											: fileType === "companyIncorporation"
												? "公司注册书（CI）"
												: fileType === "incorporationForm"
													? "法团成立表（NNC1）"
													: fileType === "annualReturn"
														? "周年申报表（NAR1）"
														: "公司章程（M&A）"
											}`}
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
													message.error("文件传输失败 / File upload failed");
													onError?.(error);
												}
											}}
											onChange={onUploadFileChange(fileType)}
										>
											<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
										</Upload>
									</Form.Item>
								)
							)}

							<div className="btns">
								<Button type="primary" htmlType="submit" style={{ marginRight: "10px" }} onClick={handlePrevStep}>
									上一步 / Prev Step
								</Button>
								<Button type="primary" htmlType="submit" disabled={!Object.values(uploadSuccess).every(success => success)}>
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

export default HKEntityInfo;
