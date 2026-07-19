import { jest } from "@jest/globals";

process.env.JWT_SECRET = "test_secret_for_signing_tokens";
jest.setTimeout(20000);
