import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { useEffect, useState } from "react";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";
import { KYCData } from "@/api/interface";
import KycNav from "../kycNav";

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
		getKYCData().then(storedData => {
			if (storedData) {
				form.setFieldsValue({
					contactName: storedData.CompanyContractInfo?.contactName || "",
					contactPhone: storedData.CompanyContractInfo?.contactPhone || "",
					contactMobile: storedData.CompanyContractInfo?.contactMobile || "",
					contactPosition: storedData.CompanyContractInfo?.contactPosition || "",
					contactEmail: storedData.CompanyContractInfo?.contactEmail || ""
				});
			}
		});
	}, [form]);

	const getKYCData = async () => {
		const res: KYCData = await getKYCApi();
		setKycStatus(res.status || "unfilled");
		return res.fields;
	};

	const onSubmit = async (values: FormValues) => {
		const newCompanyContractInfo = {
			contactName: values.contactName,
			contactPhone: values.contactPhone,
			contactMobile: values.contactMobile,
			contactPosition: values.contactPosition,
			contactEmail: values.contactEmail
		};
		const combinedPayload = {
			CompanyContractInfo: newCompanyContractInfo
		};

		await setKYCApi({
			fields: combinedPayload,
			status: "unfilled",
			updateKeys: ["CompanyContractInfo"]
		}).then(() => {
			navigate("/form/chinesecompany");
		});
	};

	const handlePrevStep = () => {
		navigate("/form/beneficical");
	};

	return (
		<div className="detail-wrap">
			<div className="recharge-wrap">
				<KycNav />
				<div className="firstCol">
					<div className="accountInfo">
						<div className="title">企业负责人信息 / Company Representative Information</div>

						<Form
							form={form}
							name="companyContractForm"
							layout="vertical"
							onFinish={onSubmit}
							disabled={kycStatus === "approved" || kycStatus === "underReview"}
							initialValues={{ isUSEntity: "us" }} // 默认是美国实体
						>
							<div className="content">
								<div className="left" style={{ alignItems: "initial" }}>
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
								<Button type="primary" style={{ marginRight: "10px", marginLeft: "0px" }} onClick={handlePrevStep}>
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

export default CompanyContractInfo;
