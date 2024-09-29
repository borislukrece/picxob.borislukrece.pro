import { DB_DATA } from "@/utils/helpers";
import {
  createPool,
  Pool,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

type Props = string | [string, (string | number | boolean)[]];

const DATABASE_DATA = DB_DATA();

// Use a connection pool
const pool: Pool = createPool({
  host: DATABASE_DATA.DB_HOST,
  user: DATABASE_DATA.DB_USER,
  password: DATABASE_DATA.DB_PASSWORD,
  database: DATABASE_DATA.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to query the database with the pool
async function query(props: Props, type: "get" | "post" | "update" | "delete") {
  let sql: string = "";
  let params: (string | number | boolean)[] = [];

  if (typeof props === "string") {
    sql = props;
  } else if (Array.isArray(props)) {
    sql = props[0];
    params = props[1] || [];
  }

  switch (type) {
    case "get":
      if (!sql.startsWith("SELECT")) {
        throw new Error("Invalid SQL statement");
      }
      break;
    case "post":
      if (!sql.startsWith("INSERT INTO")) {
        throw new Error("Invalid SQL statement");
      }
      break;
    case "update":
      if (!sql.startsWith("UPDATE")) {
        throw new Error("Invalid SQL statement");
      }
      break;
    case "delete":
      if (!sql.startsWith("DELETE")) {
        throw new Error("Invalid SQL statement");
      }
      break;
  }

  const [results] = await pool.query<ResultSetHeader | RowDataPacket[]>(
    sql,
    params
  );
  return results;
}

// GET function
export async function get(props: Props) {
  return await query(props, "get");
}

// POST function
export async function post(props: Props, table: string | null = null) {
  const result = (await query(props, "post")) as ResultSetHeader;
  const itemAdded: object | null = await new Promise(async (resolve) => {
    try {
      if (table) {
        const data = await get([
          `SELECT * FROM ${table} WHERE id = ? LIMIT 1`,
          [result.insertId],
        ]);
        if (Array.isArray(data) && data.length > 0) {
          resolve(data[0]);
        }
      } else {
        resolve(null);
      }
    } catch (error) {
      const err = error as Error;
      console.log("Error getting item added: ", err.message);
      resolve(null);
    }
  });
  return itemAdded;
}

export default pool;
