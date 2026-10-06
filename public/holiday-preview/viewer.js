import * as THREE from 'three';
import { GLTFLoader } from '/gift-preview/vendor/GLTFLoader.js';
import { OrbitControls } from '/gift-preview/vendor/OrbitControls.js';
import { RoomEnvironment } from '/gift-preview/vendor/RoomEnvironment.js';
const names=['santa','snowman','tree','reindeer','gingerbread','bear'];
const requested=new URLSearchParams(location.search).get('card');
const slug=names.includes(requested)?requested:'snowman';
const stage=document.querySelector('#stage'),status=document.querySelector('#status'),fallback=document.querySelector('#fallback');
fallback.src=`./${slug}-render.png`;
let renderer,scene,controls,pmrem,environment,model,observer,raf;
function fail(){status.textContent='3D дүрслэлийг ачаалж чадсангүй. Нүүр, арын зургийг үзэх боломжтой.';document.querySelector('#hint').hidden=true;stage.classList.remove('ready');renderer?.domElement.remove();}
try {
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;stage.prepend(renderer.domElement);
 scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(32,1,.001,2);camera.position.set(.018,.008,.205);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=.075;controls.maxDistance=.3;controls.target.set(0,0,0);
 pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();environment=pmrem.fromScene(room,.03);scene.environment=environment.texture;room.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0x5f624f,.9));const light=new THREE.DirectionalLight(0xfff1d7,1.7);light.position.set(-1,2,3);scene.add(light);
 const rim=new THREE.DirectionalLight(0xe4efff,1.2);rim.position.set(1,0,-1);scene.add(rim);
 const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};observer=new ResizeObserver(resize);observer.observe(stage);resize();
 const selectFace=(back=false)=>{camera.position.set(0,0,back?-.205:.205);camera.up.set(0,1,0);controls.target.set(0,0,0);controls.update();document.querySelector('#front').setAttribute('aria-pressed',String(!back));document.querySelector('#back').setAttribute('aria-pressed',String(back));};
 document.querySelector('#front').onclick=()=>selectFace();document.querySelector('#back').onclick=()=>selectFace(true);
 document.querySelector('#reset').onclick=()=>{camera.position.set(.018,.008,.205);camera.up.set(0,1,0);controls.update();};
 document.querySelector('#plus').onclick=()=>{camera.position.multiplyScalar(.85);controls.update();};document.querySelector('#minus').onclick=()=>{camera.position.multiplyScalar(1.18);controls.update();};
 controls.addEventListener('start',()=>{document.querySelector('#front').setAttribute('aria-pressed','false');document.querySelector('#back').setAttribute('aria-pressed','false');});
 new GLTFLoader().load(`./${slug}.glb`,gltf=>{model=gltf.scene;scene.add(model);model.traverse(o=>{if(o.isMesh){o.material.envMapIntensity=1.0;if(o.material.map)o.material.map.anisotropy=renderer.capabilities.getMaxAnisotropy();}});stage.classList.add('ready');status.textContent='';},undefined,fail);
 function frame(){raf=requestAnimationFrame(frame);if(!document.hidden){controls.update();renderer.render(scene,camera);}}frame();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail();});
} catch {fail();}
// Static images remain usable on devices without WebGL.
for(const [id,side] of [['front','front'],['back','back']])document.querySelector(`#${id}`).addEventListener('click',()=>{if(!stage.classList.contains('ready'))fallback.src=`./artwork/${slug}-${side}.png`;});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);observer?.disconnect();controls?.dispose();model?.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of [o.material].flat()){m.map?.dispose();m.dispose();}}});environment?.dispose();pmrem?.dispose();renderer?.dispose();},{once:true});
