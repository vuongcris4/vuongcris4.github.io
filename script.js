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

// SET trạng thái công tắc to Firebase
function updateDeviceStatus(room, device, isOn) {
  set(ref(database, `${room}/devices/${device}`), {
    status: isOn ? 1 : 0, // Cập nhật trạng thái 'on' hoặc 'off'
  });
}

// GET trạng thái công tắc
// Đồng bộ trạng thái thiết bị từ Firebase
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
    elementSwitch.checked = isOn;
    elementImage.src = isOn ? imageOn : imageOff;

    if (device === "fan") {
      elementImage.classList.toggle("spin", isOn);
    }
  });
}

function house_room(room) {
  console.log(room);
  // Lấy data cảm biến về
  const tempRef = (room) => ref(database, `${room}/sensors/temperature/value`);
  const lightRef = (room) => ref(database, `${room}/sensors/light/value`);
  const presenceRef = (room) => ref(database, `${room}/sensors/presence/value`);

  onValue(tempRef(room), (snapshot) => {
    const result_firebase = snapshot.val();
    document.getElementById("temperature").textContent = `${result_firebase}°C`;
    if (result_firebase < 25) {
      document.getElementById("tempImage").src = "/images/cold.webp";
    } else {
      document.getElementById("tempImage").src = "/images/hot.webp";
    }
  });

  onValue(lightRef(room), (snapshot) => {
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

  onValue(presenceRef(room), (snapshot) => {
    const result_firebase = snapshot.val();
    if (result_firebase == 1) {
      document.getElementById("presence").textContent = "Detected";
      document.getElementById("presenceImage").src = "/images/thief.webp";
    } else {
      document.getElementById("presence").textContent = "Not Detected";
      document.getElementById("presenceImage").src = "/images/no_person.webp";
    }
  });

  // Lấy trạng thái công tắc từ Firebase
  syncDeviceStatus(
    room,
    "airConditioner",
    acSwitch,
    acImage,
    "/images/ac_on.png",
    "/images/ac_off.png"
  );
  syncDeviceStatus(
    room,
    "light",
    lightSwitch,
    lightDeviceImage,
    "/images/light_on.png",
    "/images/light_off.png"
  );
  syncDeviceStatus(
    room,
    "fan",
    fanSwitch,
    fanImage,
    "/images/fan_on.png",
    "/images/fan_off.png"
  );
}

document.addEventListener("DOMContentLoaded", function () {
  const acSwitch = document.getElementById("acSwitch");
  const lightSwitch = document.getElementById("lightSwitch");
  const fanSwitch = document.getElementById("fanSwitch");
  const fanImage = document.getElementById("fanImage");
  const acImage = document.getElementById("acImage");
  const lightDeviceImage = document.getElementById("lightDeviceImage");

  // ADD EVENT LISTENER 1 lần duy nhất, nếu để trong hàm housr_room -> lỗi
  // SET Công tắc điều hòa
  acSwitch.addEventListener("change", () => {
    const isChecked = acSwitch.checked;
    acImage.src = isChecked ? "/images/ac_on.png" : "/images/ac_off.png";
    const room = document.querySelector(".selected").id; // Lấy id phòng hiện tại
    updateDeviceStatus(room, "airConditioner", isChecked); // Cập nhật lên Firebase
  });

  // Công tắc đèn
  lightSwitch.addEventListener("change", () => {
    const isChecked = lightSwitch.checked;
    lightDeviceImage.src = isChecked
      ? "/images/light_on.png"
      : "/images/light_off.png";
    const room = document.querySelector(".selected").id; // Lấy id phòng hiện tại
    updateDeviceStatus(room, "light", isChecked);
  });

  // SET Khi người dùng bật/tắt quạt
  fanSwitch.addEventListener("change", () => {
    const room = document.querySelector(".selected").id;
    const isChecked = fanSwitch.checked;
    fanImage.src = isChecked ? "/images/fan_on.png" : "/images/fan_off.png";
    fanImage.classList.toggle("spin", isChecked); // Quạt quay hoặc dừng

    // Cập nhật trạng thái quạt lên Firebase
    updateDeviceStatus(room, "fan", isChecked);
  });

  const menuItems = document.querySelectorAll("nav ul li");
  menuItems.forEach(function (item) {
    item.addEventListener("click", function () {
      menuItems.forEach(function (menuItem) {
        menuItem.classList.remove("selected"); // xoa class selected
      });

      this.setAttribute("class", "selected"); // them class = selected
      const room = this.id; // id phòng
      document.querySelector("h1").textContent = `SmartHome - ${room.charAt(0).toUpperCase() + room.slice(1)}`;
      house_room(room); // chạy các sự kiện trong phòng đó

      // Xóa query string khỏi URL khi chuyển phòng
      history.replaceState(null, "", window.location.pathname);
      if (room === "bedroom") {
      }
    });
  });

  // Lấy giá trị từ query string (URL)
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room"); // Lấy giá trị room từ URL, ví dụ 'livingroom'

  // Nếu có giá trị "room" trong URL, giả lập click vào phòng tương ứng
  if (room) {
    const selectedRoom = document.getElementById(room);
    selectedRoom.click(); // Giả lập click vào mục tương ứng
  } else {
    const defaultRoom = document.getElementById("bedroom");
    defaultRoom.click();
  }

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
});
