const cron = require('node-cron');
const { exec } = require('child_process');

const cronExpression = '*/5 * * * *';

const cronJob = cron.schedule(cronExpression, () => {
  console.log('Reiniciando servidor...');
  exec('pm2 restart ecosystem.config.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al reiniciar el servidor: ${error.message}`);
    } else if (stderr) {
      console.error(`Error al reiniciar el servidor: ${stderr}`);
    } else {
      console.log('Servidor reiniciado exitosamente');
    }
  });
});

cronJob.start();

setInterval(() => {}, 1000);