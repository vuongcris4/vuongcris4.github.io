console.log("Script loaded 1");

// Import các chức năng cần thiết từ Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Lấy data cảm biến về
const tempRef = ref(database, "bedroom/sensors/temperature/value");
const lightRef = ref(database, "bedroom/sensors/light/value");
const presenceRef = ref(database, "bedroom/sensors/presence/value");

onValue(tempRef, (snapshot) => {
  const result_firebase = snapshot.val();
  document.getElementById("temperature").textContent = `${result_firebase}°C`;
  if (result_firebase < 25) {
    document.getElementById("tempImage").src = "/images/cold.webp";
  } else {
    document.getElementById("tempImage").src = "/images/hot.webp";
  }
});

onValue(lightRef, (snapshot) => {
  const result_firebase = snapshot.val();
  document.getElementById("light").textContent = `${result_firebase} Lux`;
  if (result_firebase < 500) {
    document.getElementById("lightImage").src =
      "/images/sensor_light_dark.webp";
  } else {
    document.getElementById("lightImage").src =
      "/images/sensor_light_hight.webp";
  }
});

onValue(presenceRef, (snapshot) => {
  const result_firebase = snapshot.val();
  if ((result_firebase == 1)) {
    document.getElementById("presence").textContent = "Detected";
    document.getElementById("presenceImage").src = "/images/thief.webp";
  } else {
    document.getElementById("presence").textContent = "Not Detected";
    document.getElementById("presenceImage").src =
      "/images/no_person.webp";
  }
});

const acSwitch = document.getElementById("acSwitch");
const lightSwitch = document.getElementById("lightSwitch");
const fanSwitch = document.getElementById("fanSwitch");
const fanImage = document.getElementById("fanImage");
const acImage = document.getElementById("acImage");
const lightDeviceImage = document.getElementById("lightDeviceImage");

// SET trạng thái công tắc to Firebase
function updateDeviceStatus(room, device, isOn) {
  set(ref(database, `${room}/devices/${device}`), {
    status: isOn ? 1 : 0, // Cập nhật trạng thái 'on' hoặc 'off'
  })
    .then(() => {
      console.log(
        `${device} status updated to Firebase: ${isOn ? "on" : "off"}`
      );
    })
    .catch((error) => {
      console.error(`Error updating ${device} status: `, error);
    });
}

// GET trạng thái công tắc
function syncDeviceStatus(
  room,
  device,
  elementSwitch,
  elementImage,
  imageOn,
  imageOff
) {
  const deviceRef = ref(database, `${room}/devices/${device}/status`);
  onValue(deviceRef, (snapshot) => {
    const status = snapshot.val();
    const isOn = status === 1;

    elementSwitch.checked = isOn; // Cập nhật trạng thái công tắc

    // Cập nhật hình ảnh thiết bị và thêm/bỏ lớp quay nếu là quạt
    if (device === "fan") {
      elementImage.src = isOn ? imageOn : imageOff;
      if (isOn) {
        elementImage.classList.add("spin"); // Quạt quay khi bật
      } else {
        elementImage.classList.remove("spin"); // Dừng quạt khi tắt
      }
    } else {
      // Cập nhật hình ảnh cho các thiết bị khác như điều hòa, đèn
      elementImage.src = isOn ? imageOn : imageOff;
    }
  });
}

// Lấy trạng thái công tắc từ Firebase
syncDeviceStatus(
  "bedroom",
  "airConditioner",
  acSwitch,
  acImage,
  "/images/ac_on.png",
  "/images/ac_off.png"
);
syncDeviceStatus(
  "bedroom",
  "light",
  lightSwitch,
  lightDeviceImage,
  "/images/light_on.png",
  "/images/light_off.png"
);

// SET Công tắc điều hòa
acSwitch.addEventListener("change", () => {
  const isChecked = acSwitch.checked; // Lấy trạng thái hiện tại (bật/tắt)
  acImage.src = isChecked ? "/images/ac_on.png" : "/images/ac_off.png"; // Thay đổi hình ảnh
  updateDeviceStatus("bedroom", "airConditioner", isChecked); // Cập nhật lên Firebase
});

// Công tắc đèn
lightSwitch.addEventListener("change", () => {
  const isChecked = lightSwitch.checked;
  lightDeviceImage.src = isChecked
    ? "/images/light_on.png"
    : "/images/light_off.png";
  updateDeviceStatus("bedroom", "light", isChecked);
});

// SET Khi người dùng bật/tắt quạt
fanSwitch.addEventListener("change", () => {
  if (fanSwitch.checked) {
    fanImage.src = "/images/fan_on.png"; // Đặt hình ảnh quạt bật
    fanImage.classList.add("spin"); // Thêm lớp quay để quạt quay
    updateDeviceStatus("bedroom", "fan", true); // Cập nhật lên Firebase là quạt bật
  } else {
    fanImage.src = "/images/fan_off.png"; // Đặt hình ảnh quạt tắt
    fanImage.classList.remove("spin"); // Dừng quay quạt
    updateDeviceStatus("bedroom", "fan", false); // Cập nhật lên Firebase là quạt tắt
  }
});

// Hàm cập nhật ngày giờ
function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  document.getElementById("date").textContent = `Date: ${date}`;
  document.getElementById("time").textContent = `Time: ${time}`;
}

// Cập nhật mỗi giây
setInterval(updateDateTime, 1000);
