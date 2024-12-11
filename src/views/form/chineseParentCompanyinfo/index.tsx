import { Button, Form, Input, DatePicker, Upload, Modal, message, Select, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { FileApi } from "@/api/modules/kyc";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";
import { KYCData } from "@/api/interface";
import KycNav from "../kycNav";
interface FormValues {
	companyName: string;
	creditCode: string;
	companyType: string;
	registeredCountry: string;
	registeredAddress: string;
	operatingAddress: string;
	establishmentDate: any;
	licenseExpiryDate: any;
	legalRepresentative: string;
	businessLicense: any;
}

interface CombinedPayload {
	chineseParentCompanyInfo: FormValues;
}

const ChineseParentCompanyInfo = () => {
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const [kycStatus, setKycStatus] = useState<string>("");
	const refCombinedPayload = useRef<CombinedPayload | null>(null);
	const getKYCData = async () => {
		const res: KYCData = await getKYCApi();
		setKycStatus(res.status || "unfilled");
		return res.fields;
	};

	useEffect(() => {
		getKYCData().then(storedData => {
			if (storedData?.chineseParentCompanyInfo) {
				form.setFieldsValue({
					...storedData.chineseParentCompanyInfo,
					establishmentDate: storedData.chineseParentCompanyInfo.establishmentDate
						? moment(storedData.chineseParentCompanyInfo.establishmentDate)
						: null,
					licenseExpiryDate: storedData.chineseParentCompanyInfo.licenseExpiryDate
						? moment(storedData.chineseParentCompanyInfo.licenseExpiryDate)
						: null
				});
			}
		});
	}, [form]);

	const onSubmit = async (values: FormValues) => {
		const chineseParentCompanyPayload = {
			companyName: values.companyName,
			creditCode: values.creditCode,
			companyType: values.companyType,
			establishmentDate: values.establishmentDate,
			licenseExpiryDate: values.licenseExpiryDate,
			legalRepresentative: values.legalRepresentative,
			businessLicense: values.businessLicense,
			registeredAddress: values.registeredAddress,
			operatingAddress: values.operatingAddress,
			registeredCountry: values.registeredCountry
		};

		refCombinedPayload.current = {
			chineseParentCompanyInfo: chineseParentCompanyPayload
		};
		setOpen(true);
	};
	const handlePrevStep = () => {
		navigate("/company");
	};
	const onUploadFileChange = (event: { file: any }) => {
		if (event.file.status === "done") {
			console.log("upload success, fileId=", event.file.response.fileId);
		}
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const handleOk = async () => {
		setOpen(false);
		const storedData = refCombinedPayload.current;
		await setKYCApi({ fields: storedData, status: "underReview", updateKeys: ["chineseParentCompanyInfo"] })
			.then(() => {
				navigate("/form/kycprocess");
				message.success("KYC 信息提交成功， 我们将尽快联系您！");
			})
			.catch(error => {
				message.error(error.message || "提交失败，请稍后再试！");
			});
	};

	return (
		<div className="detail-wrap">
			<div className="recharge-wrap">
				<KycNav />

				<div className="firstCol">
					<div className="accountInfo">
						<div className="title">入住企业母公司信息 / Parent Company Information</div>
						<Form
							form={form}
							name="companyInfoForm"
							layout="vertical"
							onFinish={onSubmit}
							className="chinese-parent-company-info-form"
							disabled={kycStatus === "approved" || kycStatus === "underReview"}
						>
							<div className="content">
								<div className="left" style={{ alignItems: "initial" }}>
									<Form.Item
										name="companyName"
										label="企业名称 / Company Name:"
										rules={[{ message: "请输入企业名称 / Please enter the company name" }]}
									>
										<Input placeholder="请输入企业名称 / Please enter the company name" />
									</Form.Item>

									<Form.Item
										name="companyType"
										label="企业类型 / Company Type:"
										rules={[{ message: "请选择企业类型 / Please select the company type" }]}
									>
										<Select
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
											placeholder="请选择企业类型 / Please select the company type"
										>
											<Select.Option value="有限责任公司（自然人独资）">有限责任公司（自然人独资）</Select.Option>
											<Select.Option value="有限责任公司（法人独资）">有限责任公司（法人独资）</Select.Option>
											<Select.Option value="有限责任公司（自然人投资或控股）">有限责任公司（自然人投资或控股）</Select.Option>
											<Select.Option value="有限责任公司（国有独资）">有限责任公司（国有独资）</Select.Option>
											<Select.Option value="有限责任公司（外商投资）">有限责任公司（外商投资）</Select.Option>
											<Select.Option value="有限责任公司（外商独资）">有限责任公司（外商独资）</Select.Option>
											<Select.Option value="股份有限公司（上市公司）">股份有限公司（上市公司）</Select.Option>
											<Select.Option value="股份有限公司（非上市公司）">股份有限公司（非上市公司）</Select.Option>
										</Select>
									</Form.Item>

									<Form.Item name="establishmentDate" label="企业成立日期 / Company Establishment Date:">
										<DatePicker
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
											format="YYYY-MM-DD"
											placeholder="请选择日期 / Select date"
											style={{ width: "100%" }}
										/>
									</Form.Item>

									<Form.Item
										name="legalRepresentative"
										label="法定代表人 / Legal Representative:"
										rules={[{ message: "请输入法定代表人姓名 / Please enter the legal representative name" }]}
									>
										<Input placeholder="请输入法定代表人姓名 / Please enter the legal representative name" />
									</Form.Item>
									<Form.Item
										name="registeredCountry"
										label="企业母公司注册国家 / Parent Company Registered Country:"
										rules={[
											{
												required: true,
												message: "请选择企业母公司注册国家 / Please select the parent company registered country"
											}
										]}
									>
										<Select
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
											placeholder="请选择企业母公司注册国家 / Please select the parent company registered country"
										>
											<Select.Option value="中国">中国 / China</Select.Option>
											<Select.Option value="美国">美国 / US</Select.Option>
											<Select.Option value="香港">香港 / HK</Select.Option>
											<Select.Option value="新加坡">新加坡 / Singapore</Select.Option>
											<Select.Option value="其他">其他 / Others</Select.Option>
										</Select>
									</Form.Item>
									<Form.Item
										name="registeredAddress"
										label="企业注册地址 / Company Registered Location:"
										rules={[{ required: true, message: "请输入注册地址 / Please enter registered address" }]}
									>
										<Input placeholder="请输入企业注册地址 / Please enter the registered address" />
									</Form.Item>

									<Form.Item
										name="operatingAddress"
										label="企业运营地址 / Company Operating Location:"
										rules={[{ required: true, message: "请输入运营地址 / Please enter operating address" }]}
									>
										<Input placeholder="请输入企业运营地址 / Please enter the operating address" />
									</Form.Item>

									<Form.Item
										name="creditCode"
										label="统一社会信用代码（18位数字及字母）/ Unified Social Credit Code (18 digits/letters):"
										rules={[
											{ message: "请输入统一社会信用代码 / Please enter the unified social credit code" },
											{ pattern: /^[A-Za-z0-9]{18}$/, message: "代码应为18位字母和数字 / The code should be 18 characters" }
										]}
									>
										<Input placeholder="请输入统一社会信用代码 / Please enter the unified social credit code" />
									</Form.Item>

									<Form.Item name="licenseExpiryDate" label="执照有效期至 / License Expiry Date:">
										<DatePicker
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
											format="YYYY-MM-DD"
											placeholder="请选择日期 / Select date"
											style={{ width: "100%" }}
										/>
									</Form.Item>

									<Form.Item
										name="businessLicense"
										label="母公司营业执照/Parent Company Business License:"
										valuePropName="fileList"
										getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
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
								</div>
							</div>
							<Form.Item
								name="agreement"
								valuePropName="checked"
								rules={[
									{
										validator: (_, value) =>
											value ? Promise.resolve() : Promise.reject(new Error("必须勾选此选项 / You must check this option"))
									}
								]}
							>
								<Checkbox>
									<div>
										<span>
											<span style={{ color: "red", marginRight: "10px" }}>*</span>
											我作为本公司负责人，确认本调查问卷中填写及提供的信息真实、完整、准确，能够实际反映本公司的合规、反洗钱及反恐怖主义融资相关内容。
										</span>
									</div>
									<div>
										<span>
											<span style={{ color: "red", marginRight: "10px" }}>*</span>
											As the authorized representative of the company, I confirm that the information filled out and provided in
											this questionnaire is true, complete, and accurate, and accurately reflects the company’s compliance,
											anti-money laundering, and counter-terrorist financing related matters.
										</span>
									</div>
								</Checkbox>
							</Form.Item>
							<div className="btns"></div>
							<Button type="primary" htmlType="submit" style={{ marginRight: "10px" }} onClick={handlePrevStep}>
								上一步 / Prev Step
							</Button>
							<Button type="primary" htmlType="submit">
								提交 / Submit
							</Button>
						</Form>
						<Modal title="确认" visible={open} onOk={handleOk} onCancel={handleCancel}>
							<p>我确认我已完整如实填写所有信息</p>
							<p>I confirm that I have fully and truthfully provided the information</p>
						</Modal>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChineseParentCompanyInfo;
