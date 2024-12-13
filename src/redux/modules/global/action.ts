import * as types from "@/redux/mutation-types";
import { ThemeConfigProp } from "@/redux/interface/index";

export const setToken = (token: string) => ({
	type: types.SET_TOKEN,
	token
});

export const setUserInfo = (userInfo: any) => ({
	type: types.SET_USER_INFO,
	userInfo
});

export const setLanguage = (language: string) => ({
	type: types.SET_LANGUAGE,
	language
});

export const setThemeConfig = (themeConfig: ThemeConfigProp) => ({
	type: types.SET_THEME_CONFIG,
	themeConfig
});
