import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import "./index.less";
import SvgIcon from "@/components/svgIcon";

const NotAuth = () => {
	const navigate = useNavigate();
	const goHome = () => {
		navigate(HOME_URL);
	};
	return (
		<Result
			icon={<SvgIcon name="success" iconStyle={{ width: "100px", height: "100px" }} />}
			title="Welcome to VoyaPay"
			extra={
				<Button type="primary" onClick={goHome}>
					Back Home
				</Button>
			}
		/>
	);
};

export default NotAuth;
