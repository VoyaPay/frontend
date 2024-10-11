import { Button, Form, Input, InputNumber, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import moment from "moment";

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

	// Load saved data from localStorage when the component is mounted
	useEffect(() => {
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
				totalEmployees: parsedData.hkEntityInfo?.totalEmployees || ""
			});
		}
	}, [form]);

	// Handle form submission
	const onSubmit = (values: FormValues) => {
		// Save the form data to localStorage
		const existingData = localStorage.getItem("data") || "";
		const parsedData = JSON.parse(existingData);

		const updatedData = {
			...parsedData,
			hkEntityInfo: values
		};

		localStorage.setItem("data", JSON.stringify(updatedData));
		console.log("Submitted Values:", values);
		navigate("/form/shareholder");
	};

	// Handle form submission failure
	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	// Alphanumeric validation
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
								rules={[
									{ required: true, message: "请输入公司网站链接 / Please enter the website link" },
									{ type: "url", message: "请输入有效的网址 / Please enter a valid URL" }
								]}
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
								<Input placeholder="请输入生效日期 / Please enter the commencement date" />
							</Form.Item>

							<Form.Item
								name="expiryDate"
								label="届满日期 / Date of Expiry:"
								rules={[{ required: true, message: "请输入届满日期 / Please enter the expiry date" }]}
							>
								<Input placeholder="请输入届满日期 / Please enter the expiry date" />
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
							<Form.Item
								name="businessRegistration"
								label="商业登记证（BR） / Business Registration:"
								valuePropName="fileList"
								getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
								rules={[{ required: true, message: "请上传商业登记证 / Please upload the business registration" }]}
							>
								<Upload beforeUpload={() => false}>
									<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
								</Upload>
							</Form.Item>

							<Form.Item
								name="companyIncorporation"
								label="公司注册书（CI） / Company Incorporation:"
								valuePropName="fileList"
								getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
								rules={[{ required: true, message: "请上传公司注册书 / Please upload the company incorporation" }]}
							>
								<Upload beforeUpload={() => false}>
									<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
								</Upload>
							</Form.Item>

							<Form.Item
								name="incorporationForm"
								label="法团成立表（NNC1） / Incorporation Form (NNC1):"
								valuePropName="fileList"
								getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
								rules={[{ required: true, message: "请上传法团成立表 / Please upload the incorporation form" }]}
							>
								<Upload beforeUpload={() => false}>
									<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
								</Upload>
							</Form.Item>

							<Form.Item
								name="annualReturn"
								label="周年申报表（NAR1） / Annual Return (NAR1):"
								valuePropName="fileList"
								getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
								rules={[{ required: true, message: "请上传周年申报表 / Please upload the annual return" }]}
							>
								<Upload beforeUpload={() => false}>
									<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
								</Upload>
							</Form.Item>

							<Form.Item
								name="companyArticles"
								label="公司章程（M&A） / Company Articles (M&A):"
								valuePropName="fileList"
								getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
								rules={[{ required: true, message: "请上传公司章程 / Please upload the company articles" }]}
							>
								<Upload beforeUpload={() => false}>
									<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
								</Upload>
							</Form.Item>

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

export default HKEntityInfo;
