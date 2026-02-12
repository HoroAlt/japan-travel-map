{
  "apps": [
    {
      "name": "japan-map-backend",
      "script": "./backend/src/server.js",
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "256M",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3001
      },
      "error_file": "./logs/backend-error.log",
      "out_file": "./logs/backend-out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
}
