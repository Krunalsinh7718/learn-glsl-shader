import * as THREE from 'three';
import '../style/main.css';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

/* ---- BEGIN: loaders -----*/
const textureLoader = new THREE.TextureLoader();
/* ---- BEGIN: loaders -----*/

/* ---- BEGIN: gui helper -----*/


const gui = new dat.GUI();



/* ---- BEGIN: gui helper -----*/

/* ---- BEGIN: renderer -----*/
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth,innerHeight);

/* ---- END: renderer -----*/

document.body.appendChild(renderer.domElement);

/* ----BEGIN:  scene -----*/
const scene = new THREE.Scene();
/* ----END:  scene -----*/

/* ----BEGIN:  camera -----*/
const camera = new THREE.PerspectiveCamera(
    45,
    innerWidth / innerHeight,
    0.1,
    1000
)
camera.position.set(
    0,
    0,
    70
);

/* ----END:  camera -----*/

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();


/* ----BEGIN:  Elements -----*/
const planeTest = new THREE.Mesh(
  new THREE.PlaneGeometry(15,15,30,30),
  new THREE.MeshBasicMaterial({
    color: 'yellow',
    side: THREE.DoubleSide
  })
)
planeTest.position.x = 25;
scene.add(planeTest);
// console.log(planeTest.id);



const planeGeo = new THREE.PlaneGeometry(30,30,10,10);
const planeMat = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('planeVertexshader').textContent,
  fragmentShader: document.getElementById('planeFragmentshader').textContent,
  side: THREE.DoubleSide,
  // wireframe: true,
  uniforms : {
    u_resolution : {value: new THREE.Vector2(innerWidth, innerHeight)},
    u_mouse: {value: new THREE.Vector2(0.0, 0.0)},
    u_mouse_ray: {value: new THREE.Vector2(1,1)},
    u_time: {value: 0},
    u_cir_inner: {value : 0.35},
    u_cir_outer: {value : 0.38}
  }
})
const plane = new THREE.Mesh(planeGeo, planeMat);
scene.add(plane);

/* ----END:  Elements -----*/

/* ----BEGIN:  GUI -----*/
console.log(plane);
gui.add(plane.material.uniforms.u_cir_inner,"value", 0, 1).name("inner circle");
gui.add(plane.material.uniforms.u_cir_outer,"value", 0, 1).name("outer circle");
// gui.add(options,"cir_outer", 0, 1);
/* ----END:  GUI -----*/

/* ----BEGIN:  raycaster -----*/
const rayCaster = new THREE.Raycaster();
const mousePosition = new THREE.Vector2(1,1);
const targetObjId = plane.id;
/* ----END:  raycaster -----*/



/* ----BEGIN:  Lights -----*/
const ambianceLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambianceLight);
/* ----END:  Lights -----*/

/* ----BEGIN:  animation loop and render -----*/
let eTime = 0;
let clock = new THREE.Clock();


function animate(time){
  eTime = clock.getElapsedTime();
  plane.material.uniforms.u_time.value = eTime;

  

  renderer.render(scene,camera);
}
renderer.setAnimationLoop(animate);
/* ----BEGIN:  animation loop and render -----*/

/* ----BEGIN:  window resize event -----*/
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
/* ----END:  window resize event -----*/
/* ----BEGIN:  window window mouse move event -----*/
let hilitedPosition = new THREE.Vector3(0,0,0);
const mouse = new THREE.Vector2(1,1);
let intersect;

window.addEventListener( 'mousemove', onMousemove, false );
function onMousemove(e){

   mouse.x = (e.clientX / innerWidth) * 2 - 1;
   mouse.y = -(e.clientY / innerHeight) * 2 + 1;

  rayCaster.setFromCamera(mouse,camera);
    
  intersect = rayCaster.intersectObjects(scene.children);
  intersect.forEach(e => {
      if(e.object.id === plane.id){
        hilitedPosition.set(e.point.x, e.point.y, e.point.z);
        plane.material.uniforms.u_mouse_ray.value.set(e.point.x / 30, e.point.y / 30);
      }
   })

  //  console.log(hilitedPosition);


  plane.material.uniforms.u_mouse.value.set(mouse.x, mouse.y);

  // console.log(intersect);
}
/* ----END:  window mouse move event -----*/