import { Button, Form, Input, Select } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import back from "@/assets/images/return.png";
import { NavLink } from "react-router-dom";

// Define the types for form values
interface FormValues {
	requestedProducts: string;
	estimatedMonthlySpend: string;
	spendingUseCase: string;
	otherUseCase?: string;
	businessModel: string;
	b2bClientNumber?: string;
	b2bClientSpend?: string;
	b2cClientNumber?: string;
}

const ProductsUseCaseInfo = () => {
	const [form] = Form.useForm();
	const [businessModel, setBusinessModel] = useState<string | null>(null);
	const { Option } = Select;
	const navigate = useNavigate();

	// Handle business model change
	const handleBusinessModelChange = (value: string) => {
		setBusinessModel(value); // Track business model selection
	};

	// Auto-populate form with existing data from localStorage
	useEffect(() => {
		const storedData = localStorage.getItem("data");
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			// Set form values if product use case info exists
			form.setFieldsValue({
				requestedProducts: parsedData.productsUseCaseInfo?.requestedProducts || "",
				estimatedMonthlySpend: parsedData.productsUseCaseInfo?.estimatedMonthlySpend || "",
				spendingUseCase: parsedData.productsUseCaseInfo?.spendingUseCase || "",
				otherUseCase: parsedData.productsUseCaseInfo?.otherUseCase || "",
				businessModel: parsedData.productsUseCaseInfo?.businessModel || "",
				b2bClientNumber: parsedData.productsUseCaseInfo?.b2bClientNumber || "",
				b2bClientSpend: parsedData.productsUseCaseInfo?.b2bClientSpend || "",
				b2cClientNumber: parsedData.productsUseCaseInfo?.b2cClientNumber || ""
			});
			setBusinessModel(parsedData.productsUseCaseInfo?.businessModel || null);
		}
	}, [form]);

	// Form submission handler
	const saveFormData = (values: FormValues) => {
		const productsUseCasePayload = {
			requestedProducts: values.requestedProducts,
			estimatedMonthlySpend: values.estimatedMonthlySpend,
			spendingUseCase: values.spendingUseCase,
			otherUseCase: values.otherUseCase,
			businessModel: values.businessModel,
			b2bClientNumber: values.b2bClientNumber,
			b2bClientSpend: values.b2bClientSpend,
			b2cClientNumber: values.b2cClientNumber
		};

		const existingData = localStorage.getItem("data");
		let combinedPayload = {};

		if (existingData) {
			const parsedData = JSON.parse(existingData);
			combinedPayload = {
				...parsedData, // Spread existing data
				productsUseCaseInfo: productsUseCasePayload // Add new product use case info
			};
		} else {
			combinedPayload = {
				productsUseCaseInfo: productsUseCasePayload
			};
		}

		localStorage.setItem("data", JSON.stringify(combinedPayload));
	};

	// Form submission handler
	const onSubmit = (values: FormValues) => {
		saveFormData(values);
		navigate("/form/companyBusiness");
	};

	// Handle navigating to the previous step
	const handlePrevStep = () => {
		const values = form.getFieldsValue();
		saveFormData(values); // Save the current form data
		navigate("/company"); // Navigate to the previous step
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
						<div className="title">开通场景信息</div>
						<div className="title">Products Use Case Information</div>
						<Form form={form} name="productUseForm" layout="vertical" onFinish={onSubmit}>
							{/* Requested Products */}
							<Form.Item
								name="requestedProducts"
								label="拟开通产品服务 / Requested Products:"
								rules={[{ required: true, message: "请选择拟开通产品 / Please select requested products" }]}
							>
								<Select placeholder="请选择拟开通产品 / Please select requested products">
									<Option value="voyaVirtualCard">Voya Virtual Credit Card（沃易虚拟卡）</Option>
									<Option value="voyaBankAccount">Voya Bank Account（沃易收款账户）</Option>
								</Select>
							</Form.Item>

							{/* Estimated Monthly Spend */}
							<Form.Item
								name="estimatedMonthlySpend"
								label="预计月消耗量范围（USD） / Estimated Monthly Spend (USD):"
								rules={[{ required: true, message: "请选择预计月消耗量 / Please select estimated monthly spend" }]}
							>
								<Select placeholder="请选择预计月消耗量 / Please select estimated monthly spend">
									<Option value="lessthan500">Less than $500K</Option>
									<Option value="500-1">$500k - $1M</Option>
									<Option value="1-3">$1M - $3M</Option>
									<Option value="3-5">$3M - $5M</Option>
									<Option value="5-10">$5M - $10M</Option>
									<Option value="above10">Above $10M </Option>
								</Select>
							</Form.Item>

							{/* Spending Use Case */}
							<Form.Item
								name="spendingUseCase"
								label="消费场景 / Spending Use Case:"
								rules={[{ required: true, message: "请选择消费场景 / Please select a spending use case" }]}
							>
								<Select placeholder="请选择消费场景 / Please select spending use case">
									<Option value="Onlineads">Online Ads（线上广告）</Option>
									<Option value="storeRental">Store Rental (店铺缴费)</Option>
									<Option value="airlineTicketandHotel">Airline Tickets and Hotels (机票和酒店)</Option>
									<Option value="education">Education Fees （教育相关费用）</Option>
									<Option value="others">Others（其他）</Option>
								</Select>
							</Form.Item>

							{/* If "Others", list other use cases */}
							<Form.Item
								name="otherUseCase"
								label='如果选择“其他”，请罗列其他的消费场景 / If "Others", please list the other use cases:'
								rules={[{ required: false }]} // This field is optional
							>
								<Input.TextArea placeholder="请列出其他消费场景 / Please list other use cases" />
							</Form.Item>

							{/* Business Model */}
							<Form.Item
								name="businessModel"
								label="业务模式 / Business Model:"
								rules={[{ required: true, message: "请选择业务模式 / Please select the business model" }]}
							>
								<Select placeholder="请选择业务模式 / Please select the business model" onChange={handleBusinessModelChange}>
									<Option value="b2b">Business to Business(企业客户)</Option>
									<Option value="b2c">Business to Consumer(个人客户)</Option>
								</Select>
							</Form.Item>

							{/* Conditional Fields for B2B */}
							{businessModel === "b2b" && (
								<>
									<Form.Item name="b2bClientNumber" label="预估企业客户数 / Estimated Client Number (B2B):">
										<Input placeholder="请输入预估企业客户数 / Please enter estimated client number" />
									</Form.Item>
								</>
							)}

							{/* Conditional Fields for B2C */}
							{businessModel === "b2c" && (
								<>
									<Form.Item name="b2cClientNumber" label="预估个人客户数 / Estimated Client Number (B2C):">
										<Input placeholder="请输入预估个人客户数 / Please enter estimated client number" />
									</Form.Item>
								</>
							)}

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

export default ProductsUseCaseInfo;
