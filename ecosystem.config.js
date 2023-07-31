module.exports = {
  apps: [
    {
      name: 'backend-tumble-tasks',
      script: 'node_modules/@nestjs/cli/bin/nest.js',
      args: 'start --watch',
      instances: 1,
      autorestart: false,
      watch: true,
      max_memory_restart: '1G'
    },
  ],
};