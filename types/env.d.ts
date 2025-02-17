declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_API_URL: string;
        VISION_PRIVATE_KEY: string;
        VISION_CLIENT_EMAIL: string;
        GEMINI_API_KEY: string;
    }
}