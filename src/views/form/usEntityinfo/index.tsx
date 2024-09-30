import { Button, Form, Input, Select, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";

// Define the types for form values
interface FormValues {
	usEntityName: string;
	companyWebsite: string;
	usEntityType: string;
	usEntityEIN: string;
	usEntityFormationDate: string;
	usEntityRegisteredState: string;
	usEntityRegisteredAddress: string;
	usEntityOperatingAddress: string;
	totalEmployees: string;
	companyFormationFile: any;
	einDocumentFile: any;
	operatingAgreementFile: any;
}
const usEntityInfo = () => {
	const { Option } = Select;
	const [form] = Form.useForm();
	const navigate = useNavigate();

	// const onReset = () => {
	// 	form.resetFields();
	// };

	const onSubmit = (values: FormValues) => {
		console.log("Submitted Values:", values);
		// You can handle the submission here or navigate to a different page
		navigate("/form/companyBusiness");
	};

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
						<div className="title">入驻企业美国主体主要信息</div>
						<div className="title">US Entity Information</div>

						<Form form={form} name="usEntityForm" layout="vertical" onFinish={onSubmit}>
							<Form.Item
								name="usEntityName"
								label="美国主体全称：US Entity Legal Name"
								rules={[
									{ required: true, message: "请输入美国主体全称 / Please enter the US Entity Legal Name" },
									{ validator: validateAlphanumeric }
								]}
							>
								<Input placeholder="请输入美国主体全称 / Please enter US Entity Legal Name" />
							</Form.Item>

							<Form.Item
								name="companyWebsite"
								label="入网企业企业网站链接：Company Website"
								rules={[{ required: true, type: "url", message: "请输入有效的网站链接 / Please enter a valid URL" }]}
							>
								<Input placeholder="请输入企业网站链接 / Please enter Company Website" />
							</Form.Item>

							<Form.Item
								name="usEntityType"
								label="美国主体类型：US Entity Type"
								rules={[{ required: true, message: "请选择美国主体类型 / Please select the US Entity Type" }]}
							>
								<Select placeholder="请选择美国主体类型 / Select US Entity Type">
									<Option value="Limited Liability Comapny (LLC)">Limited Liability Comapny (LLC)</Option>
									<Option value="Partnership">Partnership</Option>
									<Option value="Cooperative">Cooperative</Option>
									<Option value="Corporation">Corporation</Option>
									<Option value="Sole Partnership">Sole Partnership</Option>
									{/* Add other types as necessary */}
								</Select>
							</Form.Item>

							<Form.Item
								name="usEntityEIN"
								label="美国主体EIN(9位数）：US Entity EIN"
								rules={[
									{ required: true, message: "请输入美国主体EIN / Please enter US Entity EIN" },
									{ len: 9, message: "EIN必须是9位数字 / EIN must be 9 digits long" }
								]}
							>
								<Input placeholder="请输入美国主体EIN / Please enter US Entity EIN" />
							</Form.Item>

							<Form.Item
								name="usEntityFormationDate"
								label="美国主体成立时间：US Entity Formation Date"
								rules={[{ required: true, message: "请选择美国主体成立时间 / Please select the US Entity Formation Date" }]}
							>
								<DatePicker placeholder="请选择成立时间 / Select Formation Date" style={{ width: "100%" }} />
							</Form.Item>

							<Form.Item
								name="usEntityRegisteredState"
								label="美国主体注册州：US Entity Registered State"
								rules={[{ required: true, message: "请输入美国主体注册州 / Please enter US Entity Registered State" }]}
							>
								<Input placeholder="请输入美国主体注册州 / Please enter US Entity Registered State" />
							</Form.Item>

							<Form.Item
								name="usEntityRegisteredAddress"
								label="美国主体注册地址：US Entity Registered Address"
								rules={[{ required: true, message: "请输入美国主体注册地址 / Please enter US Entity Registered Address" }]}
							>
								<Input placeholder="请输入美国主体注册地址 / Please enter US Entity Registered Address" />
							</Form.Item>

							<Form.Item
								name="usEntityOperatingAddress"
								label="美国主体运营地址：US Entity Operating Address"
								rules={[{ required: true, message: "请输入美国主体运营地址 / Please enter US Entity Operating Address" }]}
							>
								<Input placeholder="请输入美国主体运营地址 / Please enter US Entity Operating Address" />
							</Form.Item>

							<Form.Item
								name="totalEmployees"
								label="企业总员工人数：Total Number of Employees"
								rules={[
									{ required: true, message: "请输入企业总员工人数 / Please enter Total Number of Employees" },
									{ validator: validateAlphanumeric }
								]}
							>
								<Input placeholder="请输入总员工人数 / Please enter total number of employees" />
							</Form.Item>

							<Form.Item
								name="companyFormationFile"
								label="公司注册文件：Company Formation Article"
								rules={[{ required: true, message: "请上传公司注册文件 / Please upload the Company Formation Article" }]}
							>
								<Upload beforeUpload={() => false}>
									<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
								</Upload>
							</Form.Item>

							<Form.Item
								name="einDocumentFile"
								label="雇主税号文件（EIN）：EIN Document"
								rules={[{ required: true, message: "请上传雇主税号文件 / Please upload the EIN Document" }]}
							>
								<Upload beforeUpload={() => false}>
									<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
								</Upload>
							</Form.Item>

							<Form.Item
								name="operatingAgreementFile"
								label="公司章程：Operating Agreement"
								rules={[{ required: true, message: "请上传公司章程 / Please upload the Operating Agreement" }]}
							>
								<Upload beforeUpload={() => false}>
									<Button icon={<UploadOutlined />}>上传文件 / Upload File</Button>
								</Upload>
							</Form.Item>

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

export default usEntityInfo;
