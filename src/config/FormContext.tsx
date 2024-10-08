import React, { createContext, useContext, useState, ReactNode } from "react";

// 定义表单状态的类型
export interface FormState {
  companyContractInfo: boolean;
  usEntityInfo: boolean;
  hkEntityInfo: boolean;
  companyBusiness: boolean;
  product: boolean;
  shareholder: boolean;
  beneficialOwner: boolean;
  chineseParentCompany: boolean;
}

interface FormContextType {
  formCompleted: FormState;
  selectedEntity: string;
  setSelectedEntity: (entity: string) => void;
  markFormCompleted: (key: keyof FormState, value: boolean) => void;
}

// 创建 Context
const FormContext = createContext<FormContextType | undefined>(undefined);

// 创建 Provider 组件
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formCompleted, setFormCompleted] = useState<FormState>({
    companyContractInfo: false,
    usEntityInfo: false,
    hkEntityInfo: false,
    companyBusiness: false,
    product: false,
    shareholder: false,
    beneficialOwner: false,
    chineseParentCompany: false,
  });

  const [selectedEntity, setSelectedEntity] = useState<string>("");

  // 更新表单完成状态
  const markFormCompleted = (key: keyof FormState, value: boolean) => {
    setFormCompleted((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <FormContext.Provider
      value={{ formCompleted, selectedEntity, setSelectedEntity, markFormCompleted }}
    >
      {children}
    </FormContext.Provider>
  );
};

// 自定义 hook，用于访问表单状态
export const useFormStatus = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormStatus must be used within a FormProvider");
  }
  return context;
};
