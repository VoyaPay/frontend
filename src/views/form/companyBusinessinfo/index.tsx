import { Button, Form, Input, Select } from "antd";

import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";

// Define the types for form values
interface FormValues {
	industry: string;
	businessDescription: string;
	monthlySpend: string;
}
const companyBusinessinfo = () => {
	const [form] = Form.useForm();
	const { Option } = Select;
	const navigate = useNavigate();

	// const onReset = () => {
	// 	form.resetFields();
	// };

	const onSubmit = (values: FormValues) => {
		console.log("Submitted Values:", values);
		// You can handle the submission here or navigate to a different page
		navigate("/form/product");
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
						<div className="title">企业展业情况</div>
						<div className="title">Company Business Activities</div>

						<Form form={form} name="companyBusinessinfo =" layout="vertical" onFinish={onSubmit}>
							<Form.Item
								name="industry"
								label="企业所在行业：Industry"
								rules={[{ required: true, message: "请选择企业所在行业 / Please select the industy" }]}
							>
								<Select placeholder="请选择企业所在行业 / Please select the industy">
									<Option value="ecommerce">Ecommerce</Option>
									<Option value="Advertising">Advertising</Option>
									<Option value="Travel">Travel</Option>
									<Option value="Education">Educatoin</Option>
									<Option value="Gaming">Gaming</Option>
									<Option value="Other">Other</Option>
									{/* Add other types as necessary */}
								</Select>
							</Form.Item>

							{/* Business Description */}
							<Form.Item
								name="businessDescription"
								label="简述企业主营业务 / Business Description"
								rules={[{ required: true, message: "请输入企业主营业务 / Please enter business description" }]}
							>
								<Input.TextArea placeholder="请输入企业主营业务 / Please enter business description" />
							</Form.Item>

							{/* Monthly Spend input list */}
							<Form.Item
								name="monthlySpend"
								label="企业平均月消耗量范围（USD） / Company Average Monthly Spend (USD)"
								rules={[{ required: true, message: "请选择企业月消耗量 / Please select a spend range" }]}
							>
								<Select placeholder="请选择企业月消耗量 / Please select a spend range">
									<Option value="lessthan500">Less than $500K</Option>
									<Option value="500-1">$500k - $1M</Option>
									<Option value="1-3">$1M - $3M</Option>
									<Option value="3-5">$3M - $5M</Option>
									<Option value="5-10">$5M - $10M</Option>
									<Option value="above10">Above $10M </Option>
									{/* Add other types as necessary */}
								</Select>
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

export default companyBusinessinfo;
