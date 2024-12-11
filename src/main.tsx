import "@/styles/reset.less";
import "@/assets/iconfont/iconfont.less";
import "@/styles/common.less";
import "@/language/index";
import "virtual:svg-icons-register";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux";
import App from "@/App";

import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>
);
