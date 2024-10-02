import { message, Tooltip } from "antd";

// Importing the image correctly
import questionsImage from "@/assets/images/questions.png";

const OpeningDetail = () => {
	const handleOpeningDetail = () => {
		const pdfUrl = "https://drive.google.com/file/d/1MvnLJ62gCzHsdaXSG3Q5PelEFRBHOxVV/view?usp=sharing";
		const link = document.createElement("a");
		link.href = pdfUrl;
		link.download = "Details.pdf";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		console.log(link)
		message.success("Detail.pdf has been downloaded");
	};

	return (
		<>
		<Tooltip title="下载开卡指引文件">
			<img className="icon-style inconfont opendetail" src={questionsImage} alt="Open Detail" onClick={handleOpeningDetail} style={{marginTop:"5px"}}/>
			</Tooltip>
		</>
	);
};

export default OpeningDetail;
