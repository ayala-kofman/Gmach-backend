import { defineConfig } from "vitest/config";

// הבדיקות רצות מול מסד נתונים PostgreSQL אמיתי ונפרד, ומנקות אותו בין בדיקה לבדיקה.
// חשוב: לעולם לא להפנות אותו למסד הנתונים האמיתי שלך! (יש הגנה: שם המסד חייב להכיל "test")
const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) {
  throw new Error(
    "חסר TEST_DATABASE_URL: כתובת של מסד נתונים נפרד לבדיקות, ששמו מכיל את המילה test " +
      "(לדוגמה postgresql://USER:PASSWORD@localhost:5432/gemach_test). ראי README.md, פרק 'בדיקות אוטומטיות'.",
  );
}

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    globalSetup: ["tests/globalSetup.ts"],
    // קבצי הבדיקה חולקים מסד נתונים אחד, ולכן רצים בזה אחר זה
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 60000,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: testDatabaseUrl,
      JWT_SECRET: "test-secret-test-secret-test-secret-test-secret-123",
      JWT_EXPIRES_IN: "1h",
      CORS_ORIGIN: "http://localhost:5173,https://my-app.example.com",
      SEED_ADMIN_EMAIL: "",
      SEED_ADMIN_PASSWORD: "",
    },
  },
});
