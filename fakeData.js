// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Cấu hình Firebase
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

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Hàm tạo dữ liệu giả lập và gửi lên Firebase
function generateFakeData() {
  // Giả lập nhiệt độ từ 16°C đến 30°C
  const temperature = Math.floor(Math.random() * 15) + 16;
  // Giả lập ánh sáng từ 200 đến 1000 Lux
  const light = Math.floor(Math.random() * 800) + 200;
  // Giả lập phát hiện chuyển động (1: phát hiện chuyển động, 0: không có chuyển động)
  const presence = Math.random() > 0.5 ? 1 : 0;

  // Gửi dữ liệu giả lập lên Firebase
  set(ref(database, `bedroom/sensors/temperature`), { value: temperature });
  set(ref(database, `bedroom/sensors/light`), { value: light });
  set(ref(database, `bedroom/sensors/presence`), { value: presence });

  console.log(`Fake data generated - Temp: ${temperature}°C, Light: ${light} Lux, Presence: ${presence}`);
}

// Gọi hàm tạo dữ liệu giả lập mỗi 5 giây
setInterval(generateFakeData, 5000);
