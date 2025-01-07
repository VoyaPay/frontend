import { Button, Form, Input, Select } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { getKYCApi, setKYCApi } from "@/api/modules/kyc";
import { KYCData } from "@/api/interface";
import KycNav from "../kycNav";
interface FormValues {
	requestedProducts: string;
	estimatedMonthlySpend: string;
	spendingUseCase: Array<string>;
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
	const [kycStatus, setKycStatus] = useState<string>("");
	const handleBusinessModelChange = (value: string) => {
		setBusinessModel(value);
	};

	useEffect(() => {
		getKYCData().then(storedData => {
			if (storedData) {
				form.setFieldsValue({
					requestedProducts: storedData.productsUseCaseInfo?.requestedProducts || "",
					estimatedMonthlySpend: storedData.productsUseCaseInfo?.estimatedMonthlySpend || "",
					spendingUseCase: storedData.productsUseCaseInfo?.spendingUseCase || [],
					otherUseCase: storedData.productsUseCaseInfo?.otherUseCase || "",
					businessModel: storedData.productsUseCaseInfo?.businessModel || "",
					b2bClientNumber: storedData.productsUseCaseInfo?.b2bClientNumber || "",
					b2bClientSpend: storedData.productsUseCaseInfo?.b2bClientSpend || "",
					b2cClientNumber: storedData.productsUseCaseInfo?.b2cClientNumber || ""
				});
				setBusinessModel(storedData.productsUseCaseInfo?.businessModel || null);
			}
		});
	}, [form]);

	const getKYCData = async () => {
		const res: KYCData = await getKYCApi();
		setKycStatus(res.status || "unfilled");
		return res.fields;
	};

	const saveFormData = async (values: FormValues) => {
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

		const combinedPayload = {
			productsUseCaseInfo: productsUseCasePayload
		};
		await setKYCApi({ fields: combinedPayload, status: "unfilled", updateKeys: ["productsUseCaseInfo"] });
	};

	const onSubmit = async (values: FormValues) => {
		await saveFormData(values);
		navigate("/form/companyBusiness");
	};

	return (
		<div className="detail-wrap">
			<div className="recharge-wrap">
				<KycNav />
				<div className="firstCol">
					<div className="accountInfo">
						<div className="title">开通场景信息 / Products Use Case Information</div>
						<Form
							form={form}
							name="productUseForm"
							layout="vertical"
							onFinish={onSubmit}
							disabled={kycStatus === "approved" || kycStatus === "underReview"}
						>
							<div className="content">
								<div className="left" style={{ alignItems: "initial" }}>
									<Form.Item
										name="requestedProducts"
										label="拟开通产品服务 / Requested Products:"
										rules={[{ required: true, message: "请选择拟开通产品 / Please select requested products" }]}
									>
										<Select
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
										>
											<Option value="voyaVirtualCard">Voya Virtual Credit Card（沃易虚拟卡）</Option>
											<Option value="voyaBankAccount">Voya Bank Account（沃易收款账户）</Option>
										</Select>
									</Form.Item>

									<Form.Item
										name="estimatedMonthlySpend"
										label="预计月消耗量范围（USD） / Estimated Monthly Spend (USD):"
										rules={[{ required: true, message: "请选择预计月消耗量 / Please select estimated monthly spend" }]}
									>
										<Select
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
										>
											<Option value="lessthan500">Less than $500K</Option>
											<Option value="500-1">$500k - $1M</Option>
											<Option value="1-3">$1M - $3M</Option>
											<Option value="3-5">$3M - $5M</Option>
											<Option value="5-10">$5M - $10M</Option>
											<Option value="above10">Above $10M </Option>
										</Select>
									</Form.Item>
									<Form.Item
										name="spendingUseCase"
										label="消费场景 / Spending Use Case:"
										rules={[{ required: true, message: "请选择消费场景 / Please select a spending use case" }]}
									>
										<Select
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
											mode="multiple"
										>
											<Option value="Onlineads">Online Ads（线上广告）</Option>
											<Option value="storeRental">Store Rental (店铺缴费)</Option>
											<Option value="airlineTicketandHotel">Airline Tickets and Hotels (机票和酒店)</Option>
											<Option value="education">Education Fees （教育相关费用）</Option>
											<Option value="others">Others（其他）</Option>
										</Select>
									</Form.Item>

									<Form.Item
										name="otherUseCase"
										label='如果选择“其他”，请罗列其他的消费场景 / If "Others", please list the other use cases:'
										rules={[{ required: false }]}
									>
										<Input.TextArea />
									</Form.Item>

									<Form.Item
										name="businessModel"
										label="业务模式 / Business Model:"
										rules={[{ required: true, message: "请选择业务模式 / Please select the business model" }]}
									>
										<Select
											getPopupContainer={(triggerNode?: HTMLElement | undefined) => triggerNode?.parentElement as HTMLElement}
											onChange={handleBusinessModelChange}
										>
											<Option value="b2b">Business to Business(企业客户)</Option>
											<Option value="b2c">Business to Consumer(个人客户)</Option>
										</Select>
									</Form.Item>

									{businessModel === "b2b" && (
										<>
											<Form.Item name="b2bClientNumber" label="预估企业客户数 / Estimated Client Number (B2B):">
												<Input />
											</Form.Item>
										</>
									)}

									{businessModel === "b2c" && (
										<>
											<Form.Item name="b2cClientNumber" label="预估个人客户数 / Estimated Client Number (B2C):">
												<Input placeholder="请输入预估个人客户数 / Please enter estimated client number" />
											</Form.Item>
										</>
									)}
								</div>
							</div>
							<div className="btns">
								<Button type="primary" htmlType="submit" style={{ marginLeft: "0px" }}>
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
