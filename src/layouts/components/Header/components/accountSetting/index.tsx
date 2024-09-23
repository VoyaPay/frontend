import { useEffect, useState, useRef } from "react";
import "./index.less";
import { AccountApi } from "@/api/modules/user";
import {  Button } from "antd";
import PasswordModal from "@/layouts/components/Header/components/PasswordModal";

// Define the UserData interface for a single user
interface UserData {
  id: number;
  fullname: string;
  email: string;
  companyName: string;
}

const AccountSetting = () => {
  // Set userData as a single UserData object, initialized to null
  const [userData, setUserData] = useState<UserData | null>(null);

  // Define the type of ModalProps for passRef
  interface ModalProps {
    showModal: (params: { name: number }) => void;
  }

  // Create the ref for PasswordModal
  const passRef = useRef<ModalProps>(null);

  const userInformation = async () => {
    try {
      const response = await AccountApi(); // Fetch user data from API
      console.log(response);

      // Format the response data and set it to the state
      const formattedData: UserData = {
        id: response.id || 0,  // Default to 0 if undefined
        fullname: response.fullName || "N/A",  // Default to "N/A" if undefined
        email: response.email || "N/A",  // Default to "N/A" if undefined
        companyName: response.companyName || "N/A",  // Default to "N/A" if undefined
      };
      setUserData(formattedData); // Set formatted data to state
    } catch (error) {
      console.log("Error fetching user information: " + error);
    }
  };

  useEffect(() => {
    userInformation();
  }, []);

  return (
    <div className="accountSetting-wrap">
      <div className="title">账户信息</div>
      <div className="content">
        <div className="left">
          <div className="pre">公司名称：</div>
          <div className="pre">绑定手机号：</div>
          <div className="pre">绑定邮箱：</div>
					<div>
				<Button type="primary" onClick={() => passRef.current?.showModal({ name: 11 })}>
					修改密码
				</Button>
				</div>
					
        </div>
        <div className="middle">
          {userData ? (  // Conditional check for non-null userData
            <>
              <div className="pre">{userData.companyName}</div>
              <div className="pre">136xxxxxx33333</div> {/* Placeholder for phone number */}
              <div className="pre">{userData.email}</div>
							<div></div>
							
            </>
						
          ) : (
            <div>Loading...</div>  // Show loading message while data is being fetched
          )}
        </div>
      </div>

      {/* Add PasswordModal component and attach ref */}
      <PasswordModal innerRef={passRef} />
    </div>
  );
};

export default AccountSetting;
