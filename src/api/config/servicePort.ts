// 后端微服务端口名
import dotenv from 'dotenv';
dotenv.config();

export const PORT1 = "/hooks";
export const PORT2 = "/geeker";
export const PORT3 = process.env.backend_urls;
// export const PORT3 = "http://localhost:3333";
