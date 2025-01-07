import { RouteObject as ReactRouterRouteObject } from "react-router";
export type Meta = Record<string, any>;
export interface MetaProps {
	keepAlive?: boolean;
	requiresAuth?: boolean;
	title: string;
	key?: string;
}

export type RouteObject = Omit<ReactRouterRouteObject, "children"> & {
	children?: RouteObject[];
	meta?: MetaProps;
	isLink?: string;
};
