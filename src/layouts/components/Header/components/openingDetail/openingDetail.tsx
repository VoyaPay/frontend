import { message, Tooltip } from "antd";

// Importing the image correctly
import questionsImage from "@/assets/images/instruction.jpg";

const OpeningDetail = () => {
	const handleOpeningDetail = () => {
		const pdfUrl = "https://docs.google.com/document/d/1fae-BmIODfcyhe2eI-NO3EEPVMqvGmnzF_AFrX_kz0c/edit?usp=sharing";
		const link = document.createElement("a");
		link.href = pdfUrl;
		link.target = "_blank"; 
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
			<img className="icon-style inconfont opendetail" src={questionsImage} alt="Open Detail" onClick={handleOpeningDetail} style={{ marginTop: "2px", width: "25px", height: "25px" }}/>
			</Tooltip>
		</>
	);
};

export default OpeningDetail;
