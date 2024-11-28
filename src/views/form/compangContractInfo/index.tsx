import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";

interface FormValues {
	contactName: string;
	contactPhone: string;
	contactMobile: string;
	contactPosition: string;
	contactEmail: string;
}

const CompanyContractInfo = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [kycStatus, setKycStatus] = useState<string>("");

	useEffect(() => {
		getKYCData();
		const storedData = localStorage.getItem("data");
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			// Auto-fill the form with stored data
			form.setFieldsValue({
				contactName: parsedData.CompanyContractInfo?.contactName || "",
				contactPhone: parsedData.CompanyContractInfo?.contactPhone || "",
				contactMobile: parsedData.CompanyContractInfo?.contactMobile || "",
				contactPosition: parsedData.CompanyContractInfo?.contactPosition || "",
				contactEmail: parsedData.CompanyContractInfo?.contactEmail || ""
			});
		}
	}, [form]);

	const getKYCData = async () => {
		const res = await getKYCApi();
		setKycStatus(res.status || "unfilled");
	};

	const onSubmit = async (values: FormValues) => {
		const newCompanyContractInfo = {
			contactName: values.contactName,
			contactPhone: values.contactPhone,
			contactMobile: values.contactMobile,
			contactPosition: values.contactPosition,
			contactEmail: values.contactEmail
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
		await setKYCApi({ fields: combinedPayload, status: "unfilled" }).then(() => {
			localStorage.setItem("data", JSON.stringify(combinedPayload));
			navigate("/form/product");
		});

		// Navigate based on US entity status
		// navigate(values.isUSEntity === "us" ? "/form/usEntityinfo" : "/form/hkEntityContact");
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
						<div className="title">企业负责人信息</div>
						<div className="title">Company Representative Information</div>

						<Form
							form={form}
							name="companyContractForm"
							layout="vertical"
							onFinish={onSubmit}
							disabled={kycStatus === "approved"}
							initialValues={{ isUSEntity: "us" }} // 默认是美国实体
						>
							<div className="content">
								<div className="left">
									<Form.Item
										name="contactName"
										label="负责人姓名 / Representative Name:"
										rules={[{ required: true, message: "请输入负责人姓名 / Please enter representative name:" }]}
									>
										<Input placeholder="请输入负责人姓名 / Please enter representative name" />
									</Form.Item>

									<Form.Item
										name="contactMobile"
										label="负责人联系电话 / Representative Mobile Number:"
										rules={[{ required: true, message: "请输入负责人联系电话 / Please enter mobile number" }]}
									>
										<Input placeholder="请输入负责人联系电话 / Please enter mobile number" />
									</Form.Item>

									<Form.Item
										name="contactPosition"
										label="负责人部门与职位 / Representative's Position:"
										rules={[{ required: true, message: "请输入负责人部门与职位 / Please enter representative's position" }]}
									>
										<Input placeholder="请输入负责人部门与职位 / Please enter representative's position" />
									</Form.Item>

									<Form.Item
										name="contactEmail"
										label="负责人联系邮箱 / Representative Email:"
										rules={[{ required: true, type: "email", message: "请输入有效的邮箱地址 / Please enter a valid email" }]}
									>
										<Input placeholder="请输入负责人联系邮箱 / Please enter representative email" />
									</Form.Item>
								</div>
							</div>
							<div className="btns">
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

export default CompanyContractInfo;
