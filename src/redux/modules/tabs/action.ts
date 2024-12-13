import * as types from "@/redux/mutation-types";

// * setUserInfo
export const setUserInfo = (userInfo: any) => ({
	type: types.SET_USER_INFO,
	userInfo
});

// * setTabsActive
export const setTabsActive = (tabsActive: string) => ({
	type: types.SET_TABS_ACTIVE,
	tabsActive
});
