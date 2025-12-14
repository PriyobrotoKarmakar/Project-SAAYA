const axios = require('axios');
const config = require('./config/constants');

const API_URL = `${config.API_BASE_URL}/api/telemetry`;

const DEMO_LOCATIONS = [
  { city: 'Kolkata', deviceId: 'Saaya_WB_Kol', lat: 22.5726, lng: 88.3639 },
  { city: 'Mumbai', deviceId: 'Saaya_MH_Mum', lat: 19.0760, lng: 72.8777 },
  { city: 'Delhi', deviceId: 'Saaya_DL_Del', lat: 28.7041, lng: 77.1025 },
  { city: 'Bangalore', deviceId: 'Saaya_KA_Ban', lat: 12.9716, lng: 77.5946 },
  { city: 'Pune', deviceId: 'Saaya_MH_Pun', lat: 18.5204, lng: 73.8567 },
  { city: 'Chennai', deviceId: 'Saaya_TN_Che', lat: 13.0827, lng: 80.2707 },
  { city: 'Hyderabad', deviceId: 'Saaya_TG_Hyd', lat: 17.3850, lng: 78.4867 },
  { city: 'Ahmedabad', deviceId: 'Saaya_GJ_Ahm', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', deviceId: 'Saaya_RJ_Jai', lat: 26.9124, lng: 75.7873 },
  { city: 'Lucknow', deviceId: 'Saaya_UP_Luc', lat: 26.8467, lng: 80.9462 }
];

function getRandomHeartRate() {
  const rand = Math.random();
  if (rand < 0.3) {
    return Math.floor(Math.random() * (140 - 60) + 60);
  } else if (rand < 0.7) {
    return Math.floor(Math.random() * (160 - 150) + 150);
  } else {
    return Math.floor(Math.random() * (190 - 160) + 160);
  }
}

function addRandomOffset(value, maxOffset = 0.05) {
  return value + (Math.random() - 0.5) * maxOffset;
}

async function sendAlert(index) {
  const location = DEMO_LOCATIONS[index];
  
  const alertData = {
    deviceId: location.deviceId,
    heartRate: getRandomHeartRate(),
    lat: addRandomOffset(location.lat),
    lng: addRandomOffset(location.lng)
  };

  try {
    console.log(`\n📡 Sending Alert ${index + 1}/10...`);
    console.log(`   Device: ${alertData.deviceId}`);
    console.log(`   Location: ${location.city} (${alertData.lat.toFixed(4)}, ${alertData.lng.toFixed(4)})`);
    console.log(`   Heart Rate: ${alertData.heartRate} BPM ${alertData.heartRate >= 150 ? '🚨 EMERGENCY' : '✅ Normal'}`);
    
    const response = await axios.post(API_URL, alertData);
    
    console.log(`   ✓ Response: ${response.status} - Alert sent successfully!`);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`   ✗ Error: Backend server not running at ${API_URL}`);
      console.log(`   💡 Please start the backend server first: cd backend && npm start`);
    } else if (error.response) {
      console.log(`   ✗ Error: ${error.response.status} - ${error.response.statusText}`);
    } else {
      console.log(`   ✗ Error: ${error.message}`);
    }
  }
}

async function runDemo() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║       🚨 Project Saaya - Demo Alert Simulator 🚨      ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n📍 Target API: ${API_URL}`);
  console.log('⏱️  Interval: 5 seconds between alerts');
  console.log('📊 Total Alerts: 10\n');
  console.log('Starting in 3 seconds...\n');

  await new Promise(resolve => setTimeout(resolve, 3000));

  let count = 0;
  
  await sendAlert(count);
  count++;

  const interval = setInterval(async () => {
    if (count >= 10) {
      clearInterval(interval);
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║           ✅ Demo Simulation Complete! ✅              ║');
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log(`\n📊 Total alerts sent: ${count}/10`);
      console.log('💡 Check your dashboard to see the alerts!\n');
      return;
    }
    
    await sendAlert(count);
    count++;
  }, 5000);
}

runDemo();
