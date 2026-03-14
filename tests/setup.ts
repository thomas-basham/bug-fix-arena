process.env.DATABASE_URL ??=
  "postgresql://tester:tester@localhost:5432/bug_fix_arena_test";
process.env.DIRECT_URL ??= process.env.DATABASE_URL;
