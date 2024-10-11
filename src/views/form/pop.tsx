import { FormInstance } from "antd"; // 导入 FormInstance 类型
export const populateFormFromLocalStorage = (form:FormInstance, emailKey:string) => {
	const storedData = localStorage.getItem(emailKey);
	if (storedData) {
		const parsedData = JSON.parse(storedData);
		if (parsedData) {
			form.setFieldsValue({
				contactName: parsedData.CompanyContractInfo?.contactName,
				contactPhone: parsedData.CompanyContractInfo?.contactPhone,
				contactMobile: parsedData.CompanyContractInfo?.contactMobile,
				contactPosition: parsedData.CompanyContractInfo?.contactPosition,
				contactEmail: parsedData.CompanyContractInfo?.contactEmail,
				isUSEntity: parsedData.CompanyContractInfo?.isUSEntity,
			});
		}
	}
};
