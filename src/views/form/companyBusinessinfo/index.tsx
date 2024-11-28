import { Button, Form, Input, Select, Radio } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";

// Define the types for form values
interface FormValues {
	industry: string;
	businessDescription: string;
	monthlySpend: string;
	isUSEntity: string;
}

const CompanyBusinessInfo = () => {
	const [form] = Form.useForm();
	const { Option } = Select;
	const navigate = useNavigate();

	// Automatically populate the form if data exists in localStorage
	useEffect(() => {
		getKYCData();
		const storedData = localStorage.getItem("data");
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			// Set form values if business data exists
			form.setFieldsValue({
				industry: parsedData.companyBusinessInfo?.industry || "",
				businessDescription: parsedData.companyBusinessInfo?.businessDescription || "",
				monthlySpend: parsedData.companyBusinessInfo?.monthlySpend || "",
				isUSEntity: parsedData.companyBusinessInfo?.isUSEntity || "" // Ensure isUSEntity is populated
			});
		}
	}, [form]);

	const getKYCData = async () => {
		await getKYCApi();
	};

	// Form submission handler
	const saveFormData = async (values: FormValues) => {
		const businessInfoPayload = {
			industry: values.industry,
			businessDescription: values.businessDescription,
			monthlySpend: values.monthlySpend,
			isUSEntity: values.isUSEntity,
		};

		const existingData = localStorage.getItem("data");
		let combinedPayload = {};

		if (existingData) {
			const parsedData = JSON.parse(existingData);
			combinedPayload = {
				...parsedData,
				companyBusinessInfo: businessInfoPayload,
			};
		} else {
			combinedPayload = {
				companyBusinessInfo: businessInfoPayload,
			};
		}
		await setKYCApi({ fields: combinedPayload, status: "unfilled" }).then(() => {
			localStorage.setItem("data", JSON.stringify(combinedPayload));
		});
	};

	// Form submission handler
	const onSubmit = async (values: FormValues) => {
		await saveFormData(values);

		// Navigate to the next step based on the isUSEntity field
		navigate(values.isUSEntity === "us" ? "/form/usEntityinfo" : "/form/hkEntityContact");
	};

	// Handle the previous step, saving form data before navigating
	const handlePrevStep = () => {
		const values = form.getFieldsValue(); // Get current form values
		saveFormData(values); // Save form data
		navigate("/form/product"); // Navigate to the previous page
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
						<div className="title">企业展业情况</div>
						<div className="title">Company Business Activities</div>

						<Form form={form} name="companyBusinessInfo" layout="vertical" onFinish={onSubmit}>
							<Form.Item
								name="industry"
								label="企业所在行业 / Industry:"
								rules={[{ required: true, message: "请选择企业所在行业 / Please select the industry" }]}
							>
								<Select placeholder="请选择企业所在行业 / Please select the industry">
									<Option value="ecommerce">Ecommerce</Option>
									<Option value="Advertising">Advertising</Option>
									<Option value="Travel">Travel</Option>
									<Option value="Education">Education</Option>
									<Option value="Gaming">Gaming</Option>
									<Option value="Other">Other</Option>
								</Select>
							</Form.Item>

							<Form.Item
								name="businessDescription"
								label="简述企业主营业务 / Business Description:"
								rules={[{ required: true, message: "请输入企业主营业务 / Please enter business description" }]}
							>
								<Input.TextArea placeholder="请输入企业主营业务 / Please enter business description" />
							</Form.Item>

							<Form.Item
								name="monthlySpend"
								label="企业平均月消耗量范围（USD） / Company Average Monthly Spend (USD):"
								rules={[{ required: true, message: "请选择企业月消耗量 / Please select a spend range" }]}
							>
								<Select placeholder="请选择企业月消耗量 / Please select a spend range">
									<Option value="lessthan500">Less than $500K</Option>
									<Option value="500-1">$500k - $1M</Option>
									<Option value="1-3">$1M - $3M</Option>
									<Option value="3-5">$3M - $5M</Option>
									<Option value="5-10">$5M - $10M</Option>
									<Option value="above10">Above $10M</Option>
								</Select>
							</Form.Item>
							<Form.Item
								name="isUSEntity"
								label="请选择入驻境外主体的所属的国家和地区 / Please select the country or region where the overseas entity is located:"
								rules={[{ required: true, message: "请选择一个选项 / Please select an option" }]}
							>
								<Radio.Group>
									<Radio value="us">美国 / US</Radio>
									<Radio value="hk">香港 / HK</Radio>
								</Radio.Group>
							</Form.Item>

							<div className="btns">
								<Button type="primary" htmlType="submit" style={{ marginRight: "10px" }} onClick={handlePrevStep}>
									上一步 / Prev Step
								</Button>
								<Button type="primary" htmlType="submit">
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

export default CompanyBusinessInfo;
