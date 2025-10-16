import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ตั้งค่า Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // ฟ้าอ่อน

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(40, 25, 50);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ควบคุมกล้อง
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// แสง
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(50, 50, -20);
scene.add(sunLight);

// พื้นท้องนา
const groundGeo = new THREE.PlaneGeometry(200, 200, 10, 10);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x7cfc00 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// แม่น้ำ
const riverGeo = new THREE.PlaneGeometry(200, 20);
const riverMat = new THREE.MeshStandardMaterial({
  color: 0x1e90ff,
  metalness: 0.3,
  roughness: 0.4,
});
const river = new THREE.Mesh(riverGeo, riverMat);
river.rotation.x = -Math.PI / 2;
river.position.set(0, 0.01, 30); // แม่น้ำอยู่ z=30
scene.add(river);

// ภูเขา
function createMountain(x, z, size) {
  const geo = new THREE.ConeGeometry(size, size * 2, 8);
  const mat = new THREE.MeshStandardMaterial({ color: 0x808080, flatShading: true });
  const cone = new THREE.Mesh(geo, mat);
  cone.position.set(x, size, z);
  scene.add(cone);
}
createMountain(-30, -20, 8);
createMountain(-10, -30, 10);
createMountain(-40, -40, 12);

// พระอาทิตย์
const sunGeo = new THREE.SphereGeometry(5, 16, 16);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.position.set(40, 40, -40);
scene.add(sun);

// ฟังก์ชันสร้างต้นไม้
function createTree(x, z, scale = 1) {
  const trunkGeo = new THREE.CylinderGeometry(0.4 * scale, 0.4 * scale, 2 * scale);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.set(x, 1 * scale, z);

  const leavesGeo = new THREE.ConeGeometry(1.5 * scale, 3 * scale, 8);
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228b22, flatShading: true });
  const leaves = new THREE.Mesh(leavesGeo, leavesMat);
  leaves.position.set(x, 3 * scale, z);

  scene.add(trunk, leaves);
}

//  ต้นไม้ทั้งหมดอยู่ฝั่งตรงข้ามกับบ้าน (z > 50)
const treeRows = 6;
const treeCols = 6;
const spacing = 10;

const startXRight = -25;
const startZRight = 50;
for (let i = 0; i < treeRows; i++) {
  for (let j = 0; j < treeCols; j++) {
    const x = startXRight + j * spacing;
    const z = startZRight + i * spacing;
    createTree(x, z, 0.9 + Math.random() * 0.3);
  }
}

//  บ้านอยู่ฝั่งซ้ายแม่น้ำ (z < 10)
function createHouse(x, z) {
  const houseGeo = new THREE.BoxGeometry(4, 3, 4);
  const houseMat = new THREE.MeshStandardMaterial({ color: 0xcd853f });
  const house = new THREE.Mesh(houseGeo, houseMat);
  house.position.set(x, 1.5, z);

  const roofGeo = new THREE.ConeGeometry(3, 2, 4);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(x, 4, z);
  roof.rotation.y = Math.PI / 4;

  scene.add(house, roof);
}
createHouse(10, -10); // บ้านอยู่ฝั่งตรงข้ามกับต้นไม้

// ปรับขนาดเมื่อเปลี่ยนขนาดหน้าจอ
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// แอนิเมชัน
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
