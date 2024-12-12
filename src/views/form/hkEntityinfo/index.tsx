import { Button, Form, Input, InputNumber, DatePicker, Upload, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { useEffect, useState } from "react";
import moment from "moment";
import { FileApi } from "@/api/modules/kyc";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";
import { KYCData } from "@/api/interface";
import KycNav from "../kycNav";

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
	hkEntityOperatingAddress: string;
}

const HKEntityInfo = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [kycStatus, setKycStatus] = useState<string>("");
	const [uploadSuccess, setUploadSuccess] = useState({
		businessRegistration: true,
		companyIncorporation: true,
		incorporationForm: true,
		annualReturn: true,
		companyArticles: true
	});

	useEffect(() => {
		getKYCData().then(storedData => {
			if (storedData) {
				form.setFieldsValue({
					hkEntityName: storedData.hkEntityInfo?.hkEntityName || "",
					companyWebsite: storedData.hkEntityInfo?.companyWebsite || "",
					certificateNo: storedData.hkEntityInfo?.certificateNo || "",
					commencementDate: storedData.hkEntityInfo?.commencementDate
						? moment(storedData.hkEntityInfo?.commencementDate) // Convert date to moment
						: null,
					expiryDate: storedData.hkEntityInfo?.expiryDate
						? moment(storedData.hkEntityInfo?.expiryDate) // Convert date to moment
						: null,
					registeredAddress: storedData.hkEntityInfo?.registeredAddress || "",
					hkEntityOperatingAddress: storedData.hkEntityInfo?.hkEntityOperatingAddress || "",
					totalEmployees: storedData.hkEntityInfo?.totalEmployees || "",
					businessRegistration: storedData.hkEntityInfo?.businessRegistration,
					companyIncorporation: storedData.hkEntityInfo?.companyIncorporation,
					incorporationForm: storedData.hkEntityInfo?.incorporationForm,
					annualReturn: storedData.hkEntityInfo?.annualReturn,
					companyArticles: storedData.hkEntityInfo?.companyArticles
				});
			}
		});
	}, [form]);

	const getKYCData = async () => {
		const res: KYCData = await getKYCApi();
		setKycStatus(res.status || "unfilled");
		return res.fields;
	};

	const saveFormData = async (values: FormValues) => {
		const updatedData = {
			hkEntityInfo: values
		};

		await setKYCApi({ fields: updatedData, status: "unfilled", updateKeys: ["hkEntityInfo"] });
	};

	const onSubmit = async (values: FormValues) => {
		if (!Object.values(uploadSuccess).every(success => success)) {
			message.error("请确保所有文件上传成功 / Please ensure all files are successfully uploaded.");
			return;
		}
		await saveFormData(values);
		navigate("/form/shareholder");
	};

	const handlePrevStep = () => {
		navigate("/form/companyBusiness");
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	const onUploadFileChange = (fileType: string) => (event: { file: any }) => {
		if (event.file.status === "done") {
			setUploadSuccess(prev => ({ ...prev, [fileType]: true }));
		} else if (event.file.status === "error") {
			setUploadSuccess(prev => ({ ...prev, [fileType]: false }));
			message.error("文件传输失败 / File upload failed.");
		}
	};

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
				<KycNav />

				<div className="firstCol">
					<div className="accountInfo">
						<div className="title">入驻企业香港主体信息 / HK Entity Information</div>
						<Form
							form={form}
							name="hkEntityForm"
							layout="vertical"
							onFinish={onSubmit}
							onFinishFailed={onFinishFailed}
							disabled={kycStatus === "approved" || kycStatus === "underReview"}
						>
							<div className="content">
								<div className="left" style={{ alignItems: "initial" }}>
									<Form.Item
										name="hkEntityName"
										label="香港主体全称 / HK Entity Legal Name:"
										rules={[
											{ required: true, message: "请输入香港主体全称 / Please enter the entity legal name" },
											{ validator: validateAlphanumeric }
										]}
									>
										<Input />
									</Form.Item>

									<Form.Item
										name="companyWebsite"
										label="企业网站链接 / Company Website:"
										rules={[{ required: true, message: "请输入公司网站链接 / Please enter the website link" }]}
									>
										<Input />
									</Form.Item>

									<Form.Item
										name="certificateNo"
										label="商业登记证号码 / Certificate No.:"
										rules={[
											{ required: true, message: "请输入商业登记证号码 / Please enter certificate number" },
											{ validator: validateAlphanumeric }
										]}
									>
										<Input />
									</Form.Item>

									<Form.Item
										name="commencementDate"
										label="生效日期 / Date of Commencement:"
										rules={[{ required: true, message: "请输入生效日期 / Please enter the date of commencement" }]}
									>
										<DatePicker
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
											format="YYYY-MM-DD"
											placeholder=""
											style={{ width: "100%" }}
										/>
									</Form.Item>

									<Form.Item
										name="expiryDate"
										label="届满日期 / Date of Expiry:"
										rules={[{ required: true, message: "请输入届满日期 / Please enter the expiry date" }]}
									>
										<DatePicker
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
											format="YYYY-MM-DD"
											placeholder=""
											style={{ width: "100%" }}
										/>
									</Form.Item>

									<Form.Item
										name="registeredAddress"
										label="香港主体注册地址 / HK Entity Registered Address:"
										rules={[{ required: true, message: "请输入注册地址 / Please enter registered address" }]}
									>
										<Input />
									</Form.Item>

									<Form.Item
										name="hkEntityOperatingAddress"
										label="香港主体运营地址 / HK Entity Operating Address:"
										rules={[{ required: true, message: "请输入香港主体运营地址 / Please enter HK Entity Operating Address" }]}
									>
										<Input />
									</Form.Item>

									<Form.Item
										name="totalEmployees"
										label="企业总员工人数 / Total Number of Employees:"
										rules={[{ required: true, message: "请输入员工总人数 / Please enter total number of employees" }]}
									>
										<InputNumber style={{ width: "100%" }} />
									</Form.Item>
									<Row gutter={16}>
										{["businessRegistration", "companyIncorporation", "incorporationForm", "annualReturn", "companyArticles"].map(
											(fileType, index) => (
												<Col span={12} key={fileType}>
													<Form.Item
														name={fileType}
														label={`${
															fileType === "businessRegistration"
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
														rules={[
															{
																required: ["businessRegistration", "companyIncorporation"].includes(fileType),
																message: "请上传文件 / Please upload the document"
															}
														]}
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
													{index % 2 === 1 && <Col span={12}></Col>}
												</Col>
											)
										)}
									</Row>
								</div>
							</div>
							<div className="btns">
								<Button
									type="primary"
									htmlType="submit"
									style={{ marginRight: "10px", marginLeft: "0px" }}
									onClick={handlePrevStep}
								>
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
