import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  sheets: {
    id: process.env.SHEET_ID,
    tab: process.env.SHEET_TAB || 'Sheet1',
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
  },
};
