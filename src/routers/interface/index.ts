import { RouteObject as ReactRouterRouteObject } from "react-router";
export type Meta = Record<string, any>;
export interface MetaProps {
	keepAlive?: boolean;
	requiresAuth?: boolean;
	title: string;
	key?: string;
}

export type RouteObject = ReactRouterRouteObject & {
	caseSensitive?: boolean;
	children?: RouteObject[];
	element?: React.ReactNode;
	index?: false | undefined;
	path?: string;
	meta?: MetaProps;
	isLink?: string;
};
