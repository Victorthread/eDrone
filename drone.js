// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Ground Plane
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Lay flat
ground.position.y = -1; // Move below the drone
scene.add(ground);

// Drone Body
const droneGeometry = new THREE.BoxGeometry(1, 0.5, 1);
const droneMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const drone = new THREE.Mesh(droneGeometry, droneMaterial);
drone.position.y = 0; // Start above the ground
scene.add(drone);

// Propellers
const propellerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 32);
const propellerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const propellers = [];
const positions = [
  [-0.6, 0.3, -0.6], [0.6, 0.3, -0.6],
  [-0.6, 0.3, 0.6], [0.6, 0.3, 0.6]
];
positions.forEach(([x, y, z]) => {
  const propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
  propeller.rotation.x = Math.PI / 2; // Lay flat
  propeller.position.set(x, y, z);
  drone.add(propeller);
  propellers.push(propeller);
});

// Camera Position
camera.position.set(5, 5, 10);
camera.lookAt(drone.position);

// Keyboard Controls
const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'w') keys.forward = true;
  if (e.key === 's') keys.backward = true;
  if (e.key === 'a') keys.left = true;
  if (e.key === 'd') keys.right = true;
  if (e.key === ' ') keys.up = true;
  if (e.key === 'Shift') keys.down = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w') keys.forward = false;
  if (e.key === 's') keys.backward = false;
  if (e.key === 'a') keys.left = false;
  if (e.key === 'd') keys.right = false;
  if (e.key === ' ') keys.up = false;
  if (e.key === 'Shift') keys.down = false;
});

// Drone Movement
const speed = 0.1;
function updateDroneMovement() {
  if (keys.forward) drone.position.z -= speed;
  if (keys.backward) drone.position.z += speed;
  if (keys.left) drone.position.x -= speed;
  if (keys.right) drone.position.x += speed;
  if (keys.up) drone.position.y += speed;
  if (keys.down) drone.position.y -= speed;

  // Rotate propellers
  propellers.forEach((propeller) => {
    propeller.rotation.z += 0.3;
  });
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  updateDroneMovement();
  renderer.render(scene, camera);
}

animate();
