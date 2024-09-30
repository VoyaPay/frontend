import { message } from "antd";

// Importing the image correctly
import questionsImage from "@/assets/images/questions.png";

const OpeningDetail = () => {
	const handleOpeningDetail = () => {
		const pdfUrl = "../src/layouts/components/Header/components/openingDetail/instiuction.pdf";
		const link = document.createElement("a");
		link.href = pdfUrl;
		link.download = "Details.pdf";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		message.success("Detail.pdf has been downloaded");
	};

	return (
		<>
			<img className="icon-style inconfont opendetail" src={questionsImage} alt="Open Detail" onClick={handleOpeningDetail} style={{marginTop:"5px"}}/>
		</>
	);
};

export default OpeningDetail;
