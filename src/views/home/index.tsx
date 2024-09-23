import { useNavigate } from "react-router-dom";
import welcome from "@/assets/images/voya.png";
import "./index.less";
import React from "react";

const Home = () => {
	const navigate = useNavigate();

	// Navigate to another page after component renders
	React.useEffect(() => {
		navigate("/proTable/account");
	}, [navigate]);

	return (
		<div className="home card">
			<img src={welcome} alt="welcome" />
		</div>
	);
};

export default Home;
