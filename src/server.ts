import App from '@config/app';

App.listen(Number(process.env.PORT) || 443);
process.once('SIGINT', () => App.die());
