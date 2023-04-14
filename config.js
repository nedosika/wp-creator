import dotenv from "dotenv";

dotenv.config();

const CONFIG = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    JWT:{
        ACCESS: {
            SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
            EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
        },
        REFRESH: {
            SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
            EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
        }
    },
    DATABASE_URL: process.env.DATABASE_URL,
    COLLECTIONS: {
        tasks: 'tasks',
        users: 'users'
    }
}

export default CONFIG;