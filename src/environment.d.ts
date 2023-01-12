declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DB_HOST: string;
			DB_PORT: number;
			DB_USER: string;
			DB_PASSWORD: string;
			DB_NAME: string;
			SECRET: string;
			DEFAULT_ADMIN_PASSWORD: string;
		}
	}
}
export {};
