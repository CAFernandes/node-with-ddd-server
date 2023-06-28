import { configure, getLogger } from 'log4js';

//atenção habilitar o log desabilita a saida no console
if (process.env.SAVE_LOG == 'true') {
  /* Configuring the log4js library. */
  configure({
    appenders: {
      file: {
        type: 'file',
        filename: 'api.log',
        maxLogSize: 10 * 1024 * 1024, // = 10Mb
        backups: 5, // keep five backup files
        compress: true, // compress the backups
        encoding: 'utf-8',
        mode: 0o0640,
        flags: 'w+',
      },
      dateFile: {
        type: 'dateFile',
        filename: 'api.log',
        pattern: 'yyyy-MM-dd-hh',
        compress: true,
      },
      out: {
        type: 'stdout',
      },
    },
    categories: {
      default: { appenders: ['file', 'dateFile', 'out'], level: 'trace' },
    },
  });
}

/* Exporting the logger object. */
export const logger = getLogger('Tractian');
