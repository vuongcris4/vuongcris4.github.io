import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYVzO92NAQBy4LGDjJJECC_ve_QTybA38",
  authDomain: "smarthomeiot-f2a2a.firebaseapp.com",
  databaseURL:
    "https://smarthomeiot-f2a2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smarthomeiot-f2a2a",
  storageBucket: "smarthomeiot-f2a2a.appspot.com",
  messagingSenderId: "588338496897",
  appId: "1:588338496897:web:e3c1e7ca15488e802e1480",
  measurementId: "G-C6E6E87Y7L",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function generateFakeData() {
  // Generate data for bedroom
  generateRoomData('bedroom');
  // Generate data for livingroom
  generateRoomData('livingroom');
  // Generate data for kitchen
  generateRoomData('kitchen');
  // Generate data for bathroom
  generateRoomData('bathroom');
}

function generateRoomData(room) {
  // Nhiệt độ (16°C đến 30°C)
  let temperature = Math.floor(Math.random() * 15) + 16;
  // Ánh sáng (200 đến 1000 Lux)
  let light = Math.floor(Math.random() * 800) + 200;
  // Phát hiện chuyển động (1: có chuyển động, 0: không có chuyển động)
  let presence = Math.random() > 0.5 ? 1 : 0;

  // Ghi dữ liệu vào Firebase cho phòng cụ thể
  set(ref(database, `${room}/sensors/temperature`), { value: temperature });
  set(ref(database, `${room}/sensors/light`), { value: light });
  set(ref(database, `${room}/sensors/presence`), { value: presence });
}

// Chạy hàm generateFakeData mỗi 5 giây để cập nhật dữ liệu giả cho cả 4 phòng
setInterval(generateFakeData, 5000);
