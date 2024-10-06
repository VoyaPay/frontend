import { Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

interface FormValues {
	contactName: string;
	contactPhone: string;
	contactMobile: string;
	contactPosition: string;
	contactEmail: string;
	isUSEntity: string;
}

const CompanyContractInfo = () => {
	const { Option } = Select;
	const [form] = Form.useForm();
	const navigate = useNavigate();

	useEffect(() => {
		// Automatically load stored data if the "email" key exists in localStorage

		const storedData = localStorage.getItem("data");
		console.log(JSON.parse(localStorage.getItem('data') || '{}'))
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			// Auto-fill the form with stored data
			form.setFieldsValue({
				contactName: parsedData.CompanyContractInfo?.contactName || "",
				contactPhone: parsedData.CompanyContractInfo?.contactPhone || "",
				contactMobile: parsedData.CompanyContractInfo?.contactMobile || "",
				contactPosition: parsedData.CompanyContractInfo?.contactPosition || "",
				contactEmail: parsedData.CompanyContractInfo?.contactEmail || "",
				isUSEntity: parsedData.CompanyContractInfo?.isUSEntity || "us"
			});
		}
	}, [form]);

	const onSubmit = (values: FormValues) => {
		const newCompanyContractInfo = {
			contactName: values.contactName,
			contactPhone: values.contactPhone,
			contactMobile: values.contactMobile,
			contactPosition: values.contactPosition,
			contactEmail: values.contactEmail,
			isUSEntity: values.isUSEntity
		};

		// Retrieve existing data
		const existingData = localStorage.getItem("data");
		let combinedPayload = {};

		if (existingData) {
			const parsedData = JSON.parse(existingData);
			// Merge new data with existing data
			combinedPayload = {
				...parsedData,
				CompanyContractInfo: newCompanyContractInfo // Update CompanyContractInfo
			};
		} else {
			// If no existing data, save new company contact information
			combinedPayload = {
				CompanyContractInfo: newCompanyContractInfo
			};
		}

		// Save updated data to localStorage
		localStorage.setItem("data", JSON.stringify(combinedPayload));
		console.log("Updated Payload:", combinedPayload);

		// Navigate based on US entity status
		navigate(values.isUSEntity === "us" ? "/form/usEntityinfo" : "/form/hkEntityContact");
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
						<div className="title">企业联系人信息</div>
						<div className="title">Company Contact Information</div>

						<Form
							form={form}
							name="companyContractForm"
							layout="vertical"
							onFinish={onSubmit}
							initialValues={{ isUSEntity: "us" }} // 默认是美国实体
						>
							<div className="content">
								<div className="left">
									<Form.Item
										name="contactName"
										label="联系人姓名 / Contact Name"
										rules={[{ required: true, message: "请输入联系人姓名 / Please enter contact name" }]}
									>
										<Input placeholder="请输入联系人姓名 / Please enter contact name" />
									</Form.Item>

									<Form.Item
										name="contactPhone"
										label="联系人联系电话（固话） / Contact Work Number"
										rules={[{ required: true, message: "请输入联系人联系电话 / Please enter contact work number" }]}
									>
										<Input placeholder="请输入联系人联系电话（固话） / Please enter work number" />
									</Form.Item>

									<Form.Item
										name="contactMobile"
										label="联系人联系电话（手机） / Contact Mobile Number"
										rules={[{ required: true, message: "请输入联系人联系电话（手机） / Please enter mobile number" }]}
									>
										<Input placeholder="请输入联系人联系电话（手机） / Please enter mobile number" />
									</Form.Item>

									<Form.Item
										name="contactPosition"
										label="联系人部门与职位 / Contact's Position"
										rules={[{ required: true, message: "请输入联系人部门与职位 / Please enter contact's position" }]}
									>
										<Input placeholder="请输入联系人部门与职位 / Please enter contact's position" />
									</Form.Item>

									<Form.Item
										name="contactEmail"
										label="联系人联系邮箱 / Contact Email"
										rules={[{ required: true, type: "email", message: "请输入有效的邮箱地址 / Please enter a valid email" }]}
									>
										<Input placeholder="请输入联系人联系邮箱 / Please enter contact email" />
									</Form.Item>

									<Form.Item
										name="isUSEntity"
										label="是否通过美国主体入驻打款 / Is US Entity?"
										rules={[{ required: true, message: "请选择一个选项 / Please select an option" }]}
									>
										<Select placeholder="选择一个选项 / Select an option">
											<Option value="us">是 / Yes</Option>
											<Option value="hk">否 / No</Option>
										</Select>
									</Form.Item>
								</div>
							</div>
							<div className="btns">
								<Button type="primary" htmlType="submit">
									下一步
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CompanyContractInfo;
