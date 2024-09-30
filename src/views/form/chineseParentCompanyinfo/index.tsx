import { Button, Form, Input, DatePicker, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useState } from "react";

// Define the types for form values
interface FormValues {
	industry: string;
	businessDescription: string;
	monthlySpend: string;
}
const chineseParentCompanyinfo = () => {
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const navigate= useNavigate()

	// const onReset = () => {
	// 	form.resetFields();
	// };

	const onSubmit = (values: FormValues) => {
		console.log("Submitted Values:", values);
		setOpen(true);
		// You can handle the submission here or navigate to a different page
		
	};
	const handleCancel = () => {
		setOpen(false);
	};
	const handleOk = async () => {
		navigate("/login");
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
							&nbsp;&nbsp;&nbsp;&nbsp;
							*Voyapay合规及风控团队，将结合问卷填写内容，随机开展对客户的风控合规面试、会谈、现场走访等工作。
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
							<Form.Item
								name="establishmentDate"
								label="企业成立日期 / Company Establishment Date"
								rules={[{ message: "请选择企业成立日期 / Please select the establishment date" }]}
							>
								<DatePicker placeholder="请选择日期 / Select date" style={{ width: "100%" }} />
							</Form.Item>

							{/* 执照有效期至 / License Expiry Date */}
							<Form.Item
								name="licenseExpiryDate"
								label="执照有效期至 / License Expiry Date"
								rules={[{ message: "请选择执照有效期 / Please select the license expiry date" }]}
							>
								<DatePicker placeholder="请选择日期 / Select date" style={{ width: "100%" }} />
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
						<Modal title="受益人" visible={open} onOk={handleOk} onCancel={handleCancel}>
							<p>我确认我已完整如实填写所有信息</p>
							<p>
								I confirm that I have fully and truthfully provided the information
							</p>
						</Modal>
					</div>
				</div>
			</div>
		</div>
	);
};

export default chineseParentCompanyinfo;
