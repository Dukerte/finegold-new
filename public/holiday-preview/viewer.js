import * as THREE from 'three';
import { GLTFLoader } from '/gift-preview/vendor/GLTFLoader.js';
import { OrbitControls } from '/gift-preview/vendor/OrbitControls.js';
import { RoomEnvironment } from '/gift-preview/vendor/RoomEnvironment.js';
const names=['santa','snowman','tree','reindeer','gingerbread','bear'];
const requested=new URLSearchParams(location.search).get('card');
const slug=names.includes(requested)?requested:'snowman';
const stage=document.querySelector('#stage'),status=document.querySelector('#status'),fallback=document.querySelector('#fallback');
fallback.src=`./${slug}-render.png`;
let renderer,scene,controls,pmrem,environment,model,observer,raf,sparkleTexture;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const glints=[];
function makeGlint(coin){
 if(!sparkleTexture){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');
  const glow=ctx.createRadialGradient(64,64,0,64,64,62);glow.addColorStop(0,'rgba(255,252,227,1)');glow.addColorStop(.15,'rgba(255,225,155,.6)');glow.addColorStop(1,'rgba(255,218,138,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,128,128);
  ctx.fillStyle='#fff9dc';ctx.beginPath();for(let i=0;i<8;i++){const angle=i*Math.PI/4;const radius=i%2?6:58;const x=64+Math.cos(angle)*radius,y=64+Math.sin(angle)*radius;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();sparkleTexture=new THREE.CanvasTexture(canvas);
 }
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:sparkleTexture,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
 sprite.position.copy(coin.position).add(new THREE.Vector3(-.0027,.0025,.0016));sprite.scale.setScalar(.005);coin.parent.add(sprite);glints.push(sprite);
}
function fail(){status.textContent='3D дүрслэлийг ачаалж чадсангүй. Нүүр, арын зургийг үзэх боломжтой.';document.querySelector('#hint').hidden=true;stage.classList.remove('ready');renderer?.domElement.remove();}
try {
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;stage.prepend(renderer.domElement);
 scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(32,1,.001,2);camera.position.set(.018,.008,.205);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=.075;controls.maxDistance=.3;controls.target.set(0,0,0);
 pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();environment=pmrem.fromScene(room,.03);scene.environment=environment.texture;room.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0x5f624f,.9));const light=new THREE.DirectionalLight(0xfff1d7,1.7);light.position.set(-1,2,3);scene.add(light);
 const shimmer=new THREE.PointLight(0xffe5ac,.012,1,2);shimmer.position.set(-.07,.045,.08);scene.add(shimmer);
 const rim=new THREE.DirectionalLight(0xe4efff,1.2);rim.position.set(1,0,-1);scene.add(rim);
 const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};observer=new ResizeObserver(resize);observer.observe(stage);resize();
 const selectFace=(back=false)=>{camera.position.set(0,0,back?-.205:.205);camera.up.set(0,1,0);controls.target.set(0,0,0);controls.update();document.querySelector('#front').setAttribute('aria-pressed',String(!back));document.querySelector('#back').setAttribute('aria-pressed',String(back));};
 document.querySelector('#front').onclick=()=>selectFace();document.querySelector('#back').onclick=()=>selectFace(true);
 document.querySelector('#reset').onclick=()=>{camera.position.set(.018,.008,.205);camera.up.set(0,1,0);controls.update();};
 document.querySelector('#plus').onclick=()=>{camera.position.multiplyScalar(.85);controls.update();};document.querySelector('#minus').onclick=()=>{camera.position.multiplyScalar(1.18);controls.update();};
 controls.addEventListener('start',()=>{document.querySelector('#front').setAttribute('aria-pressed','false');document.querySelector('#back').setAttribute('aria-pressed','false');});
 new GLTFLoader().load(`./${slug}.glb`,gltf=>{model=gltf.scene;scene.add(model);const coins=[];model.traverse(o=>{if(o.isMesh){for(const material of [o.material].flat()){material.envMapIntensity=/gold/i.test(o.name)?1.6:1;if(material.map)material.map.anisotropy=renderer.capabilities.getMaxAnisotropy();if(/gold/i.test(o.name)){material.roughness=.2;material.metalness=.85;}}if(/gold[ _]insert/i.test(o.name))coins.push(o);}});coins.forEach(makeGlint);stage.classList.add('ready');status.textContent='';},undefined,fail);
 function frame(time=0){raf=requestAnimationFrame(frame);if(!document.hidden){controls.update();if(!reducedMotion.matches){shimmer.position.x=Math.sin(time*.00065)*.07;shimmer.position.y=.045+Math.cos(time*.00065)*.015;}for(const glint of glints){const facing=Math.max(0,camera.position.z/camera.position.length());const pulse=Math.pow(Math.max(0,Math.sin(time*.00155)),6);glint.material.opacity=reducedMotion.matches?0:pulse*Math.min(1,facing*2);glint.scale.setScalar(.004+pulse*.005);}renderer.render(scene,camera);}}frame();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail();});
} catch {fail();}
// Static images remain usable on devices without WebGL.
for(const [id,side] of [['front','front'],['back','back']])document.querySelector(`#${id}`).addEventListener('click',()=>{if(!stage.classList.contains('ready'))fallback.src=`./artwork/${slug}-${side}.png`;});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);observer?.disconnect();controls?.dispose();model?.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of [o.material].flat()){m.map?.dispose();m.dispose();}}});glints.forEach(g=>g.material.dispose());sparkleTexture?.dispose();environment?.dispose();pmrem?.dispose();renderer?.dispose();},{once:true});
