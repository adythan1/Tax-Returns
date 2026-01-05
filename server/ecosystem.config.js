module.exports = {
  apps: [{
    name: 'accruefy-backend',
    script: 'server.js',
    cwd: '/var/www/accruefy/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/accruefy-backend-error.log',
    out_file: '/var/log/accruefy-backend-out.log',
    log_file: '/var/log/accruefy-backend-combined.log',
    time: true
  }]
};