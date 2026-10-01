import * as THREE from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
const stage=document.querySelector('#stage'), load=document.querySelector('#load');
let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch(e){document.querySelector('#progress').textContent='Энэ төхөөрөмж 3D дүрслэлийг дэмжихгүй байна. Өөр хөтөч ашиглана уу.';document.querySelector('.spinner').hidden=true;throw e;}renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.90;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.background=null;const camera=new THREE.PerspectiveCamera(35,1,.005,20);const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.minDistance=.12;orbit.maxDistance=2.8;orbit.maxPolarAngle=Math.PI*.97;orbit.target.set(.13,.15,0);camera.position.set(.85,.8,1.25);
const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
scene.add(new THREE.HemisphereLight(0xffffff,0x7a6c57,1.5));const sun=new THREE.DirectionalLight(0xffffff,3);sun.position.set(-.4,1.7,1);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-1,right:1,top:1,bottom:-1,near:.01,far:4});sun.shadow.bias=-.0002;scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));ground.rotation.x=-Math.PI/2;ground.position.y=-.001;ground.receiveShadow=true;scene.add(ground);
let model,hinge,card,envelope,bag,openQ;const rest={},state={lid:true,card:false,envelope:false,bag:false,dimensions:false},mix={lid:1,card:0,envelope:0,bag:0};const labels=[];
function focus(which){if(hero) leaveHero();const views={set:[[.85,.8,1.25],[.13,.14,0]],box:[[.31,.60,.70],[-.08,.12,0]],bag:[[.85,.47,.73],[.43,.23,0]]};const [p,t]=views[which];camera.position.fromArray(p);orbit.target.fromArray(t);if(camera.aspect<1)camera.position.sub(orbit.target).multiplyScalar(1/camera.aspect).add(orbit.target);orbit.update();}
function updateUI(){document.querySelector('.actions').style.display=hero?'none':'';for(const id of ['lid','card','envelope','bag','dimensions'])document.getElementById(id).setAttribute('aria-pressed',state[id]);document.getElementById('lid').innerHTML=state.lid?'Хайрцгийг хаах <span>−</span>':'Хайрцгийг нээх <span>+</span>';document.getElementById('card').innerHTML=state.card?'Картыг буцаах <span>−</span>':'Баталгааг харах <span>+</span>';document.getElementById('envelope').innerHTML=state.envelope?'Дугтуйг буцаах <span>−</span>':'Доторх хайрцгийг харах <span>+</span>';document.getElementById('bag').innerHTML=state.bag?'Торын нүүрэн тал <span>↻</span>':'Торыг эргүүлэх <span>↻</span>';document.getElementById('dims').hidden=!state.dimensions;}
for(const id of Object.keys(state))document.getElementById(id).onclick=()=>{if(hero&&id!=='dimensions'){leaveHero();focus('box');}state[id]=!state[id];if((id==='card'||id==='envelope')&&state[id]){state.lid=true;focus('box');}if(id==='lid'&&!state.lid){state.card=false;state.envelope=false;}if(id==='bag')focus('bag');updateUI();};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>focus(b.dataset.view));document.querySelector('#reset').onclick=()=>{Object.assign(state,{lid:true,card:false,envelope:false,bag:false,dimensions:false});focus('set');updateUI();};
function addLabel(text,position){const div=document.createElement('div');div.className='label';div.textContent=text;div.hidden=true;stage.append(div);labels.push({div,position:new THREE.Vector3(...position)});}
new GLTFLoader().load('./gift-set.glb',g=>{model=g.scene;scene.add(model);model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;for(const m of (Array.isArray(o.material)?o.material:[o.material])){m.envMapIntensity=.85;if(m.name.includes('BOTTLE_GLASS')){m.color.set('#183020');m.metalness=.1;m.roughness=.2;m.transmission=.12;}}}});
const get=n=>{const o=model.getObjectByName(n);if(!o)throw new Error('Missing interactive part: '+n);return o;};try{hinge=get('HINGE_LEFT_BOOK_PERMANENT');card=get('GOLD_CARD_LIFT_ASSEMBLY');envelope=get('ENVELOPE_ASSEMBLY');bag=get('BAG_ASSEMBLY');}catch(e){document.querySelector('#progress').textContent=e.message;return;}openQ=hinge.quaternion.clone();for(const [n,o] of Object.entries({card,envelope,bag}))rest[n]={p:o.position.clone(),q:o.quaternion.clone()};
addLabel('Хайрцаг · 310 × 300 × 95 мм',[0,.02,.18]);addLabel('Тор · 335 × 320 × 115 мм',[.43,.34,0]);addLabel('Карт · 54 × 85 мм',[.0575,.09,-.0575]);
initProducts(); load.classList.add('hidden');document.querySelectorAll('button:disabled').forEach(b=>b.disabled=false);window.previewReady=true;window.previewAPI={state,mix,model,focus};selectProduct('gold');
},p=>{document.querySelector('#progress').textContent=p.total?`Уншиж байна · ${Math.round(100*p.loaded/p.total)}%`:'Уншиж байна…';},e=>{document.querySelector('#progress').textContent='3D загвар уншигдсангүй. Хуудсыг дахин ачаална уу.';document.querySelector('.spinner').hidden=true;console.error(e);});
new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}).observe(stage);
const clock=new THREE.Clock(),identity=new THREE.Quaternion(),axis=new THREE.Vector3(0,1,0);
function frame(){requestAnimationFrame(frame);if(document.hidden)return;const dt=Math.min(clock.getDelta(),.05),k=1-Math.exp(-dt*6);if(model&&hinge&&!hero){mix.card=THREE.MathUtils.lerp(mix.card,+state.card,k);mix.envelope=THREE.MathUtils.lerp(mix.envelope,+state.envelope,k);const safeClose=Math.max(mix.card,mix.envelope)<.02;mix.lid=THREE.MathUtils.lerp(mix.lid,state.lid||!safeClose?1:0,k);mix.bag=THREE.MathUtils.lerp(mix.bag,+state.bag,k);hinge.quaternion.slerpQuaternions(identity,openQ,mix.lid);for(const [n,o] of Object.entries({card,envelope})){o.position.copy(rest[n].p);const f=THREE.MathUtils.smoothstep(mix.lid,.8,1)*mix[n];o.position.y+=f*.10;o.position.x+=f*(n==='card'?.065:.02);o.position.z+=f*(n==='card'?-.02:.015);}bag.quaternion.copy(rest.bag.q).multiply(new THREE.Quaternion().setFromAxisAngle(axis,mix.bag*Math.PI));}
animateHero(dt);orbit.update();for(const l of labels){l.div.hidden=!!hero||!state.dimensions;const p=l.position.clone().project(camera);l.div.style.left=((p.x+1)/2*stage.clientWidth)+'px';l.div.style.top=((-p.y+1)/2*stage.clientHeight)+'px';}renderer.render(scene,camera);}

// Product inspection keeps the original assemblies and dimensions intact.
const products={
 gold:{node:'GOLD_CARD_LIFT_ASSEMBLY',copy:'999.9 сорьцтой 0.5 г алтан гулдмай. Сувдан цагаан 54 × 85 мм карт дээр байрлуулсан.'},
 wine:{node:'BOTTLE_375ML_PARAMETRIC',copy:'Баярын мөчийг хамтдаа хуваалцах шампанск. Багцад 375 мл савлагааг харуулав.'},
 certificate:{node:'CERTIFICATE_ASSEMBLY',copy:'Алтан гулдмайн мэдээлэл бүхий баталгаа. Бэлгийн картын доор байрлана.'},
 envelope:{node:'ENVELOPE_ASSEMBLY',copy:'Товойлгон дүрсэлсэн алтан өнгийн лацтай, матт хар дугтуй.'},
 blackbox:{node:'HIDDEN_GIFT_BOX_125x90x30',copy:'Байгууллагын бэлгийн карт, эрхийн бичиг хийх нэмэлт хайрцаг. Алтан өнгийн дүүргэгчтэй.'}
};
let hero=null;const original=new Map();
function initProducts(){model.children.forEach(o=>original.set(o,{p:o.position.clone(),q:o.quaternion.clone(),visible:o.visible}));document.querySelectorAll('[data-product]').forEach(b=>b.onclick=()=>selectProduct(b.dataset.product));}
function restoreObjects(){for(const [o,r] of original){o.position.copy(r.p);o.quaternion.copy(r.q);o.visible=r.visible;}Object.assign(state,{lid:true,card:false,envelope:false,bag:false});Object.assign(mix,{lid:1,card:0,envelope:0,bag:0});}
function leaveHero(){hero=null;restoreObjects();document.querySelectorAll('[data-product]').forEach(b=>b.setAttribute('aria-pressed','false'));document.querySelector('#item-copy').textContent='Бэлгийн багцыг бүх талаас нь үзээрэй.';updateUI();}
function selectProduct(key){
 if(!model)return;restoreObjects();const info=products[key],obj=model.getObjectByName(info.node),r=original.get(obj);
 const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),key==='blackbox'?.95:Math.PI/2).multiply(r.q);
 const end=new THREE.Vector3(0,.45,0);obj.position.copy(end);obj.quaternion.copy(q);model.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(obj),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
 const distance=Math.max(size.y,size.x/camera.aspect)*.70/Math.tan(THREE.MathUtils.degToRad(camera.fov/2))+size.z*.5;
 obj.position.copy(r.p);obj.quaternion.copy(r.q);
 hero={obj,key,time:0,start:r.p.clone(),end,q,fromQ:r.q.clone(),cam:camera.position.clone(),target:orbit.target.clone(),toCam:center.clone().add(new THREE.Vector3(0,0,Math.max(.15,distance))),toTarget:center};
 document.querySelectorAll('[data-product]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.product===key));document.querySelector('#item-copy').textContent=info.copy;updateUI();
}
function animateHero(dt){if(!hero)return;const h=hero;h.time+=matchMedia('(prefers-reduced-motion: reduce)').matches?2:dt;const t=Math.min(1,h.time/1.25),e=t*t*(3-2*t);h.obj.position.lerpVectors(h.start,h.end,e);h.obj.quaternion.slerpQuaternions(h.fromQ,h.q,e);if(!h.finished){camera.position.lerpVectors(h.cam,h.toCam,e);orbit.target.lerpVectors(h.target,h.toTarget,e);if(t===1)h.finished=true;}for(const o of model.children)o.visible=o===h.obj||t<.55;}

frame();
