import { Button, Form, Input, DatePicker, Upload, Modal,message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import moment from "moment";
import {createKYCapi} from "@/api/modules/form"

// Define the types for form values
interface FormValues {
	companyName: string;
	creditCode: string;
	companyType: string;
	establishmentDate: any;
	licenseExpiryDate: any;
	legalRepresentative: string;
	businessLicense: any;
}

const ChineseParentCompanyInfo = () => {
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	// Populate form with existing data from localStorage when the component mounts
	useEffect(() => {
		const storedData = localStorage.getItem("data");
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			if (parsedData.chineseParentCompanyInfo) {
				form.setFieldsValue({
					...parsedData.chineseParentCompanyInfo,
					// Ensure date fields are parsed correctly using moment
					establishmentDate: parsedData.chineseParentCompanyInfo.establishmentDate
						? moment(parsedData.chineseParentCompanyInfo.establishmentDate)
						: null,
					licenseExpiryDate: parsedData.chineseParentCompanyInfo.licenseExpiryDate
						? moment(parsedData.chineseParentCompanyInfo.licenseExpiryDate)
						: null
				});
			}
		}
	}, [form]);

	// Handle form submission
	const onSubmit = (values: FormValues) => {
		// Retrieve the user's email from localStorage
		const email = localStorage.getItem("data") || "";
		if (!email) {
			console.error("Email not found in localStorage");
			return;
		}

		// Create the payload for the Chinese parent company info
		const chineseParentCompanyPayload = {
			companyName: values.companyName,
			creditCode: values.creditCode,
			companyType: values.companyType,
			establishmentDate: values.establishmentDate,
			licenseExpiryDate: values.licenseExpiryDate,
			legalRepresentative: values.legalRepresentative,
			businessLicense: values.businessLicense
		};

		// Retrieve any existing data stored under the user's email
		const existingData = localStorage.getItem("data");
		let combinedPayload = {};

		// If existing data is found, merge it with the new Chinese parent company info
		if (existingData) {
			const parsedData = JSON.parse(existingData);
			combinedPayload = {
				...parsedData,
				chineseParentCompanyInfo: chineseParentCompanyPayload
			};
		} else {
			// Otherwise, just store the new Chinese parent company info
			combinedPayload = {
				chineseParentCompanyInfo: chineseParentCompanyPayload
			};
		}

		// Save the updated payload to localStorage under the user's email
		localStorage.setItem("data", JSON.stringify(combinedPayload));

		console.log("Combined Payload:", localStorage.getItem("data"));

		// Open confirmation modal
		setOpen(true);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const handleOk = async () => {
		setOpen(false);
		try {
			// 调用 createKYCapi 函数，发送 KYC 信息
			const response = await createKYCapi();
	
			// 检查响应是否成功
			if (response && !response.message) {
				// 成功消息提示
				message.success("KYC 信息提交成功， 我们将尽快联系您！");
				
				// 跳转到登录页面
				navigate("/login");
			} else {
				// 如果有错误消息，显示错误提示
				message.error(response.message || "提交失败，请稍后再试！");
			}
		} catch (error: any) {
			if (error.response && error.response.data) {
					// 显示来自服务器的错误消息
					message.error(error.response.data.message);
			} else {
					// 显示通用错误信息
					message.error("发生未知错误，请稍后再试");
			}
			
	};}

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
					</div>
				</div>
				<div className="firstCol">
					<div className="accountInfo">
						<div className="title">入驻企业中国母公司主要信息</div>
						<div className="title">Chinese Parent Company Information</div>

						<Form form={form} name="companyInfoForm" layout="vertical" onFinish={onSubmit}>
							{/* 企业名称 / Company Name */}
							<Form.Item
								name="companyName"
								label="企业名称 / Company Name"
								rules={[{ message: "请输入企业名称 / Please enter the company name" }]}
							>
								<Input placeholder="请输入企业名称 / Please enter the company name" />
							</Form.Item>

							{/* 统一社会信用代码 / Unified Social Credit Code (18 digits/letters) */}
							<Form.Item
								name="creditCode"
								label="统一社会信用代码（18位数字及字母）/ Unified Social Credit Code (18 digits/letters)"
								rules={[
									{ message: "请输入统一社会信用代码 / Please enter the unified social credit code" },
									{ pattern: /^[A-Za-z0-9]{18}$/, message: "代码应为18位字母和数字 / The code should be 18 characters" }
								]}
							>
								<Input placeholder="请输入统一社会信用代码 / Please enter the unified social credit code" />
							</Form.Item>

							{/* 企业类型 / Company Type */}
							<Form.Item
								name="companyType"
								label="企业类型 / Company Type"
								rules={[{ message: "请输入企业类型 / Please enter the company type" }]}
							>
								<Input placeholder="请输入企业类型 / Please enter the company type" />
							</Form.Item>

							{/* 企业成立日期 / Company Establishment Date */}
							<Form.Item name="establishmentDate" label="企业成立日期 / Company Establishment Date">
								<DatePicker format="YYYY-MM-DD" placeholder="请选择日期 / Select date" style={{ width: "100%" }} />
							</Form.Item>

							<Form.Item name="licenseExpiryDate" label="执照有效期至 / License Expiry Date">
								<DatePicker format="YYYY-MM-DD" placeholder="请选择日期 / Select date" style={{ width: "100%" }} />
							</Form.Item>

							{/* 法定代表人 / Legal Representative */}
							<Form.Item
								name="legalRepresentative"
								label="法定代表人 / Legal Representative"
								rules={[{ message: "请输入法定代表人姓名 / Please enter the legal representative name" }]}
							>
								<Input placeholder="请输入法定代表人姓名 / Please enter the legal representative name" />
							</Form.Item>

							{/* 中国关联公司营业执照上传 / Chinese Affiliate Company Business License */}
							<Form.Item
								name="businessLicense"
								label="中国关联公司营业执照 / Chinese Affiliate Company Business License"
								valuePropName="fileList"
								getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
								rules={[{ message: "请上传营业执照 / Please upload the business license" }]}
							>
								<Upload name="businessLicense" action="/upload" listType="picture">
									<Button icon={<UploadOutlined />}>上传营业执照 / Upload Business License</Button>
								</Upload>
							</Form.Item>

							{/* Submit Button */}
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
