import App from '@config/app';

App.listen(
  Number(process.env.HTTPSPORT) || 443,
  Number(process.env.HTTPPORT) || 80
);
process.once('SIGINT', () => App.die());
