module.exports = {
  apps: [
    {
      name: 'sigma-hawk-tua-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL || 'https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app',
        NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app',
        NEXT_PUBLIC_RAPID_API_KEY: process.env.NEXT_PUBLIC_RAPID_API_KEY || ''
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_BASE_API_URL: 'https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app',
        NEXT_PUBLIC_API_BASE: 'https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app',
        NEXT_PUBLIC_API_URL: 'https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app',
        NEXT_PUBLIC_RAPID_API_KEY: process.env.NEXT_PUBLIC_RAPID_API_KEY || ''
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        NEXT_PUBLIC_BASE_API_URL: 'https://sigma-hawk-tua-backend-dev-1097710273935.asia-southeast1.run.app',
        NEXT_PUBLIC_API_BASE: 'https://sigma-hawk-tua-backend-dev-1097710273935.asia-southeast1.run.app',
        NEXT_PUBLIC_API_URL: 'https://sigma-hawk-tua-backend-dev-1097710273935.asia-southeast1.run.app',
        NEXT_PUBLIC_RAPID_API_KEY: process.env.NEXT_PUBLIC_RAPID_API_KEY || ''
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Health check
      listen_timeout: 10000,
      kill_timeout: 5000,
    }
  ]
};
