const fs = require('fs');
const path = require('path');


const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');


let backendIP = 'localhost';
let backendPort = '5000';

envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_BACKEND_IP=')) {
    backendIP = line.split('=')[1].trim();
  }
  if (line.startsWith('VITE_BACKEND_PORT=')) {
    backendPort = line.split('=')[1].trim();
  }
});


const javaConfig = `package com.saaya;

public class TestConfig {
    public static final String BACKEND_IP = "${backendIP}";
    public static final String BACKEND_PORT = "${backendPort}";
    public static final String BASE_URL = "http://" + BACKEND_IP + ":" + BACKEND_PORT;
    public static final String HEALTH_URL = BASE_URL + "/api/health";
    public static final String ALERTS_URL = BASE_URL + "/api/alerts";
    public static final String STATS_URL = BASE_URL + "/api/stats";
    public static final String TELEMETRY_URL = BASE_URL + "/api/telemetry";
}
`;

const javaConfigPath = path.join(__dirname, 'src', 'test', 'java', 'com', 'saaya', 'TestConfig.java');
fs.writeFileSync(javaConfigPath, javaConfig);

console.log('✅ TestConfig.java updated with BACKEND_IP:', backendIP);
