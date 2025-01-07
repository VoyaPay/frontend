import screenfull from "screenfull";
import { message, Tooltip } from "antd";
import { useEffect, useState } from "react";

const Fullscreen = () => {
	const [fullScreen, setFullScreen] = useState<boolean>(screenfull.isFullscreen);

	useEffect(() => {
		try {
			screenfull.on("change", () => {
				if (screenfull.isFullscreen) setFullScreen(true);
				else setFullScreen(false);
			});
		} catch (error) {
			console.error("Error occurred while setting up fullscreen change listener:", error);
		}
		return () => {
			try {
				screenfull.off("change", () => {});
			} catch (error) {
				console.error("Error occurred while removing fullscreen change listener:", error);
			}
		};
	}, []);

	const handleFullScreen = () => {
		if (!screenfull.isEnabled) message.warning("当前您的浏览器不支持全屏 ❌");
		screenfull.toggle();
	};
	return (
		<Tooltip title={fullScreen ? "退出全屏" : "全屏展示"}>
			<i
				className={["icon-style iconfont", fullScreen ? "icon-suoxiao" : "icon-fangda"].join(" ")}
				onClick={handleFullScreen}
			></i>
		</Tooltip>
	);
};
export default Fullscreen;
