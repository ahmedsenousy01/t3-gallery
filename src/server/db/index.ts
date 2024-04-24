import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema";

export const db = drizzle(sql, { schema });
// TODO: learn about the optimal way to use drizzle with vercel postgres