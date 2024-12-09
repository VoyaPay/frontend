import { useState, useEffect } from "react";

export default function useInactivityLogout(timeout = 20 * 60 * 1000) {
	const [isActive, setIsActive] = useState(true);
	useEffect(() => {
		let timer: any;
		const handleActivity = () => {
			if (!isActive) {
				setIsActive(true);
			}
			clearTimeout(timer);
			timer = setTimeout(() => setIsActive(false), timeout);
		};
		window.addEventListener("mousemove", handleActivity);
		window.addEventListener("touchstart", handleActivity);
		timer = setTimeout(() => setIsActive(false), timeout);

		return () => {
			clearTimeout(timer);
			window.removeEventListener("mousemove", handleActivity);
			window.removeEventListener("touchstart", handleActivity);
		};
	}, [timeout, isActive]);

	return isActive;
}
