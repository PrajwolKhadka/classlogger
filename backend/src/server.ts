import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import { Pool } from 'pg';
import { config } from './config';
import { SessionUseCases } from './application/SessionUseCases';
import { PgAttemptRepo, PgSessionRepo, PgStudentRepo } from './infrastructure/PgRepositories';
import { SheetsGateway } from './infrastructure/SheetsGateway';
import { buildRoutes } from './interfaces/routes';

async function main() {
  const db = new Pool({ connectionString: config.databaseUrl });
  await db.query(fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf8'));

  const useCases = new SessionUseCases({
    sessions: new PgSessionRepo(db),
    students: new PgStudentRepo(db),
    attempts: new PgAttemptRepo(db),
    sheets: new SheetsGateway(config.sheets),
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => { res.status(err.status || 500).json({ error: err.message }); };

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', buildRoutes(useCases));
  app.use(onError);
  app.listen(config.port, () => console.log(`API on http://localhost:${config.port}`));
}

main().catch((e) => { console.error(e); process.exit(1); });
