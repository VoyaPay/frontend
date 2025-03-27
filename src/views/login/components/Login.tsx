import { Form, Input, Button, message, FormInstance } from "antd";
import { UserOutlined, LockOutlined, CloseCircleOutlined, SafetyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Login } from "@/api/interface";
import { loginApi, verifyCodeApi } from "@/api/modules/login";
import { getKYCApi } from "@/api/modules/kyc";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUserInfo } from "@/redux/modules/global/action";

interface LoginComponentProps {
  form: FormInstance<any>;
  loginType: number;
}

const LoginComponent = (props: LoginComponentProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, loginType } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [emailForCode, setEmailForCode] = useState<string>("");

  // 2FA verification
  const handle2FAVerification = async (values: { email?: string; code?: string }) => {
    const verifyRes = await verifyCodeApi({ email: emailForCode, code: values.code! });
    const access_token = verifyRes.data?.access_token;
    if (!access_token) throw new Error("No access token after code verification");

    // Store token + user info
    dispatch(setToken(access_token));
    dispatch(setUserInfo(null));
    localStorage.setItem("access_token", access_token);

    // KYC check
    const kycResponse = await getKYCApi();
    if (kycResponse.status === "approved") {
      message.success("登录成功！");
      navigate("/tradeQuery");
    } else if (kycResponse.status === "unfilled") {
      navigate("/form/product");
    } else {
      navigate("/form/kycprocess");
    }
  };

  // Main login function
  const onFinish = async (values: Login.ReqLoginForm & { code?: string }) => {
    try {
      setLoading(true);

      // If we're on the second step (code input), verify code
      if (showCodeInput) {
        await handle2FAVerification(values);
        return;
      }

      // -- First step: email/phone + password login
      if (loginType === 0) {
        // 用户名(手机号)登录
        // Values: { username, password }, no email
        await loginApi({
          username: values.username,
          password: values.password,
          email: "", // or undefined
        });
        setEmailForCode(""); // no email in phone scenario, if you have no phone 2FA, skip 2FA
      } else {
        // 邮箱登录
        if (values.email) {
          values.email = values.email.toLowerCase();
        }
        // Values: { email, password }, username is irrelevant here
        await loginApi({
          username: "", // or undefined
          password: values.password,
          email: values.email,
        });
        setEmailForCode(values.email || "");
      }

      setShowCodeInput(true);
      message.success("验证码已发送，请查收邮箱");
    } catch (error) {
      message.error("登录失败或验证码错误");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className="login-type" style={{ fontSize: "20px", fontWeight: "bold" }}>
        登录VoyaPay账户
      </div>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 5 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        size="large"
        autoComplete="on"
      >
        {/* loginType=0 => phone; loginType=1 => email */}
        {loginType === 0 ? (
          <Form.Item name="username" rules={[{ required: true, message: `请输入手机号` }]}>
            <Input placeholder="手机号" prefix={<UserOutlined />} />
          </Form.Item>
        ) : (
          <Form.Item name="email" rules={[{ required: true, message: `请输入邮箱` }]}>
            <Input placeholder="邮箱" prefix={<UserOutlined />} autoComplete="email" />
          </Form.Item>
        )}

        <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password autoComplete="current-password" placeholder="密码" prefix={<LockOutlined />} />
        </Form.Item>

        {/* 二次验证：输入验证码 */}
        {showCodeInput && (
          <Form.Item name="code" rules={[{ required: true, message: "请输入验证码" }]}>
            <Input placeholder="验证码" prefix={<SafetyOutlined />} maxLength={6} />
          </Form.Item>
        )}

        <Form.Item className="login-btn">
          <Button onClick={() => form.resetFields()} icon={<CloseCircleOutlined />}>
            重置
          </Button>
          <span className="space" />
          <Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined />}>
            {showCodeInput ? "验证" : "登录"}
          </Button>
        </Form.Item>
      </Form>

      <div className="otherText-wrap">
        <a onClick={() => navigate("/register")} style={{ marginRight: 10 }}>
          没有账号？立即注册
        </a>
      </div>
    </div>
  );
};

export default LoginComponent;
