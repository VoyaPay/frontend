import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "@/redux/modules/global/action";

const useLogout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return () => {
		dispatch(setToken(""));
		navigate("/login");
	};
};

export default useLogout;
