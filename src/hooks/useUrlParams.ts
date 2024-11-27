import { useState, useEffect } from "react";

const useUrlParams = (paramName: string) => {
	const [paramValue, setParamValue] = useState("");
	useEffect(() => {
		const getParamFromHash = () => {
			const hash = window.location.hash.substring(1);
			const urlParams = hash.split("?")[1];
			const params: { [key: string]: string } = {};
			if (urlParams) {
				const pairs = urlParams.split("&");
				pairs.forEach(pair => {
					const [key, value] = pair.split("=");
					params[key] = value;
				});
			}
			return params[paramName] || "";
		};

		setParamValue(getParamFromHash());
	}, [paramName]);

	return paramValue;
};

export default useUrlParams;
