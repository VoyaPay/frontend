import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_URL} from "@/config/config";
import "./index.less";
import checkImage from "@/assets/images/check.png"
// import questionImage from "@/assets/images/avatar.png"

const NotAuth = () => {
	const navigate = useNavigate();
	const goHome = () => {
		navigate(HOME_URL);
	};
	return (
		<Result
			icon={<img src={checkImage} alt="welcome" style={{ width: '100px', height: '100px' }} />} 
			title="Welcome to Voyapay"
			
			extra={
				<Button type="primary" onClick={goHome}>
					Back Home
				</Button>
			}
		/>
	);
};

export default NotAuth;
