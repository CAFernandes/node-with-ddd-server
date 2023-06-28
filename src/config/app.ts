import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import https from 'https';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import 'reflect-metadata';

import { logger } from '@/utils/logger';
import { ActiveRouter } from '@active/routers/ActiveRouter';
import { CompanyRouter } from '@company/routers/CompanyRouter';
import { authenticateToken } from '@middlewares/authenticateToken';
import { errorHandling } from '@middlewares/errorHandling';
import { loggerRequest } from '@middlewares/loggerRequest';
import { UnitRouter } from '@unit/routers/UnitRouter';
import { SessionRouter } from '@user/routers/SessionRouter';
import { UserRouter } from '@user/routers/UserRouter';
import { createDatabaseAndCollections } from './services/createDatabaseAndCollections';
import os from 'os';

type TlsOptions = {
  key: Buffer;
  cert: Buffer;
  pfx: Buffer;
  passphrase: string;
};

/* The class App is a class that extends the class Application from the express module */
class App {
  /* A property of the class App. It is a public property of type express.Application. */
  public app: express.Application;
  private server: https.Server;
  private options: TlsOptions;
  /**
   * The constructor function is called when the class is instantiated
   */
  constructor() {
    // console.clear();
    this.app = express();
    this.options = {
      key: readFileSync(resolve(__dirname, 'certs', 'key.pem')),
      cert: readFileSync(resolve(__dirname, 'certs', 'cert.pem')),
      pfx: readFileSync(resolve(__dirname, 'certs', 'cert.pfx')),
      passphrase: '281296',
    };
    this.middleware();
  }
  /**
   * This function is used to set up the middleware for the express server
   */
  middleware(): void {
    createDatabaseAndCollections();
    this.app.use(
      helmet({
        contentSecurityPolicy: true,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      })
    );
    this.app.use(cors());
    this.app.use(express.json({ limit: '25mb' }));
    this.app.use(express.urlencoded({ limit: '25mb', extended: true }));
    if (process.env.REQUEST_INTERCEPT) this.app.use(loggerRequest);

    this.routes();
  }
  /**
   * This function is used to add the routes to the express app.
   */
  async routes(): Promise<void> {
    this.app.use('/image', express.static(resolve('public')));
    this.app.use('/auth', new SessionRouter().routes());
    this.app.use('/user', authenticateToken, new UserRouter().routes());
    this.app.use('/company', authenticateToken, new CompanyRouter().routes());
    this.app.use('/unit', authenticateToken, new UnitRouter().routes());
    this.app.use('/active', authenticateToken, new ActiveRouter().routes());
    this.app.use(errorHandling);
  }
  /**
   * The function listen() is a method of the class App, which is a class that extends the class Application from the express module.
   * The listen() method takes a parameter of type Number, and returns nothing
   * @param {Number} httpsPort - The port number that the server will listen to https.
   * @param {Number} httpPort - The port number that the server will listen to http.
   */
  listen(PORT: number): void {
    this.server = https.createServer({}, this.app);
    // this.server.listen(httpsPort, () => {
    //   logger.level = 'debug';
    //   logger.info(`Backend Staterd in port: ${httpsPort}`);
    //   logger.info(
    //     `Ambiente: ${process.env.TS_NODE_DEV ? 'DEVELOPMENT' : 'PRODUCTION'}`
    //   );
    //   logger.info('IP Address: ' + this.getIPAddress());
    // });
    this.app.listen(PORT, () => {
      logger.level = 'debug';
      logger.info(`Backend Staterd in port: http://localhost:${PORT}`);
      logger.info(
        `Ambiente: ${process.env.TS_NODE_DEV ? 'DEVELOPMENT' : 'PRODUCTION'}`
      );
    });
  }
  getIPAddress = (): string | undefined => {
    const interfaces = os.networkInterfaces();

    for (const networkInterface of Object.values(interfaces)) {
      if (networkInterface) {
        for (const iface of networkInterface) {
          if (iface.family === 'IPv4' && !iface.internal) {
            return iface.address;
          }
        }
      }
    }

    return undefined;
  };
  /**
   * The function die() is a void function that exits the process
   */
  die(): void {
    process.exit(0);
  }
}
/* Exporting the class App as a default export. */
export default new App();
