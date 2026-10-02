import * as THREE from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
const stage=document.querySelector('#stage'), load=document.querySelector('#load');
let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch(e){document.querySelector('#progress').textContent='Энэ төхөөрөмж 3D дүрслэлийг дэмжихгүй байна. Өөр хөтөч ашиглана уу.';document.querySelector('.spinner').hidden=true;throw e;}renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.94;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.background=null;const camera=new THREE.PerspectiveCamera(35,1,.005,20);const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.minDistance=.12;orbit.maxDistance=6;orbit.maxPolarAngle=Math.PI*.97;orbit.target.set(.13,.15,0);camera.position.set(.85,.8,1.25);
const pmrem=new THREE.PMREMGenerator(renderer);
const roomLight=new RoomEnvironment();
const windowPanel=new THREE.Mesh(new THREE.PlaneGeometry(4,5),new THREE.MeshBasicMaterial({color:new THREE.Color(3.5,3.3,2.9),side:THREE.DoubleSide}));windowPanel.position.set(-3,2,1);windowPanel.lookAt(0,0,0);roomLight.add(windowPanel);
scene.environment=pmrem.fromScene(roomLight,.06).texture;

scene.add(new THREE.HemisphereLight(0xffffff,0x786e60,.65));const sun=new THREE.DirectionalLight(0xfff3df,2.0);sun.position.set(-1.2,1.6,.6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-1,right:1,top:1,bottom:-1,near:.01,far:4});sun.shadow.bias=-.00008;sun.shadow.normalBias=.0003;sun.shadow.radius=4;scene.add(sun);
// Physical stone tabletop: all product bases rest on its top at y = -1 mm.
const stoneTexture=microSurface(12);
const stoneMaterial=new THREE.MeshPhysicalMaterial({color:'#e1d6c1',roughness:.48,metalness:0,clearcoat:.16,clearcoatRoughness:.38,bumpMap:stoneTexture,bumpScale:.00028});
stoneMaterial.onBeforeCompile=shader=>{
 shader.vertexShader='varying vec3 vStone;\n'+shader.vertexShader;
 shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvStone=(modelMatrix*vec4(position,1.0)).xyz;');
 shader.fragmentShader=`varying vec3 vStone;
 float stoneHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
 float stoneNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(stoneHash(i),stoneHash(i+vec3(1,0,0)),f.x),mix(stoneHash(i+vec3(0,1,0)),stoneHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(stoneHash(i+vec3(0,0,1)),stoneHash(i+vec3(1,0,1)),f.x),mix(stoneHash(i+vec3(0,1,1)),stoneHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float stoneFbm(vec3 p){return .55*stoneNoise(p)+.27*stoneNoise(p*2.1)+.12*stoneNoise(p*4.3)+.06*stoneNoise(p*9.1);}
 `+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 vec3 rock=vStone*vec3(4.0,9.0,4.0);
 float cloud=stoneFbm(rock);
 float vein=1.0-smoothstep(.035,.095,abs(sin(vStone.x*12.0+vStone.z*8.0+cloud*13.0)));
 float pores=smoothstep(.70,.86,stoneNoise(vStone*280.0));
 vec3 stoneTone=mix(vec3(.91,.85,.73),vec3(.42,.39,.33),cloud*.34+vein*.55+pores*.25);
 diffuseColor.rgb*=stoneTone;
 `);
};
function easedStone(w,h,d,r){const g=new THREE.BoxGeometry(w,h,d,20,4,16),p=g.attributes.position,n=g.attributes.normal;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i),c=new THREE.Vector3(THREE.MathUtils.clamp(v.x,-w/2+r,w/2-r),THREE.MathUtils.clamp(v.y,-h/2+r,h/2-r),THREE.MathUtils.clamp(v.z,-d/2+r,d/2-r)),normal=v.clone().sub(c).normalize();v.copy(c).addScaledVector(normal,r);p.setXYZ(i,v.x,v.y,v.z);n.setXYZ(i,normal.x,normal.y,normal.z);}return g;}
const tabletop=new THREE.Mesh(easedStone(1.8,.095,1.15,.009),stoneMaterial);tabletop.position.set(.16,-.0485,.03);tabletop.receiveShadow=true;tabletop.castShadow=true;scene.add(tabletop);
const contactShadow=new THREE.Mesh(new THREE.PlaneGeometry(1.78,1.13),new THREE.ShadowMaterial({opacity:.20,depthWrite:false}));contactShadow.rotation.x=-Math.PI/2;contactShadow.position.set(.16,-.0009,.03);contactShadow.receiveShadow=true;scene.add(contactShadow);
for(const x of [-.44,.76]){const support=new THREE.Mesh(easedStone(.23,.70,.65,.012),stoneMaterial);support.position.set(x,-.445,.03);support.receiveShadow=true;support.castShadow=true;scene.add(support);}

let model,hinge,sequence=null,cameraMove=null; const labels=[];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const rotationButton=document.querySelector('#auto-rotate');
let rotationEnabled=!reducedMotion.matches,rotationIdle=0,rotationSpeed=0,rotationInteracting=false;
function updateRotationButton(){
 rotationButton.setAttribute('aria-pressed',String(rotationEnabled));
 const label=rotationEnabled?'Автомат эргэлтийг түр зогсоох':'Автомат эргэлтийг эхлүүлэх';
 rotationButton.setAttribute('aria-label',label);rotationButton.title=label;
 rotationButton.textContent=rotationEnabled?'Ⅱ':'▷';
}
function pauseRotation(){rotationIdle=4;rotationSpeed=0;orbit.autoRotate=false;}
function animateRotation(dt){
 rotationIdle=Math.max(0,rotationIdle-dt);
 const active=rotationEnabled&&model&&!sequence&&!cameraMove&&(!hero||hero.finished)&&!rotationInteracting&&rotationIdle===0;
 // Full set: 180 seconds per turn; individual products: 60 seconds.
 const targetSpeed=hero?1:1/3;
 rotationSpeed=active?THREE.MathUtils.damp(rotationSpeed,targetSpeed,2,dt):0;
 orbit.autoRotate=active;orbit.autoRotateSpeed=rotationSpeed;
}
rotationButton.onclick=()=>{rotationEnabled=!rotationEnabled;rotationIdle=0;rotationSpeed=0;updateRotationButton();};
reducedMotion.addEventListener('change',()=>{rotationEnabled=!reducedMotion.matches;rotationSpeed=0;updateRotationButton();});
updateRotationButton();
function focus(){if(!model)return;sequence=null;cameraMove=null;hero=null;orbit.enabled=true;restoreObjects();const view=overview();camera.position.copy(view.camera);orbit.target.copy(view.target);orbit.update();updateUI();}
function updateUI(){const busy=!!sequence;document.body.classList.toggle('inspecting',!!hero);document.body.classList.toggle('playing',busy);document.querySelector('#callouts').hidden=!!hero||busy;document.querySelector('#item-switcher').hidden=!hero||busy;document.querySelector('#flip').hidden=!hero||!['gold','certificate','tag'].includes(hero.key);if(!hero)document.querySelectorAll('[data-product]').forEach(b=>b.setAttribute('aria-pressed','false'));document.querySelector('#lines').style.display=hero||busy?'none':'';document.querySelector('#intro').hidden=!!hero;document.querySelector('#back').hidden=!hero||busy;document.querySelector('#detail').hidden=!hero||busy;document.querySelector('#skip').hidden=!busy;document.querySelector('#replay').hidden=busy||!!hero;document.querySelector('#sequence-caption').hidden=!busy;document.querySelectorAll('#tools button').forEach(b=>b.disabled=busy||!model);}
document.querySelector('#back').onclick=()=>{focus();if(stage.clientWidth<=760)parent.postMessage({type:'gift-preview-focus'},location.origin);};
new GLTFLoader().load('./gift-set.glb?v=consolidated-final-20261001',g=>{model=g.scene;scene.add(model);const finishes=new Map();model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;const mats=(Array.isArray(o.material)?o.material:[o.material]).map(old=>{if(!finishes.has(old))finishes.set(old,refineMaterial(old));return finishes.get(old);});o.material=Array.isArray(o.material)?mats:mats[0];}});

const get=n=>{const o=model.getObjectByName(n);if(!o)throw new Error('Missing interactive part: '+n);return o;};try{hinge=get('HINGE_LEFT_BOOK_PERMANENT');}catch(e){document.querySelector('#progress').textContent=e.message;return;}initProducts();load.classList.add('hidden');window.previewReady=true;document.querySelector('#replay').disabled=false;if(matchMedia('(prefers-reduced-motion: reduce)').matches)focus();else startSequence();
},p=>{document.querySelector('#progress').textContent=p.total?`Уншиж байна · ${Math.round(100*p.loaded/p.total)}%`:'Уншиж байна…';},e=>{document.querySelector('#progress').textContent='3D загвар уншигдсангүй. Хуудсыг дахин ачаална уу.';document.querySelector('.spinner').hidden=true;console.error(e);});
new ResizeObserver(()=>{const w=stage.clientWidth,h=w<=760?400:stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(model&&!hero&&!sequence)focus();if(w<=760)parent.postMessage({type:'gift-preview-height',height:stage.scrollHeight},location.origin);}).observe(stage);
const clock=new THREE.Clock();
function frame(){requestAnimationFrame(frame);if(document.hidden)return;const dt=Math.min(clock.getDelta(),.05);animateSequence(dt);animateHero(dt);animateCamera(dt);animateRotation(dt);orbit.update(dt);orbit.autoRotate=false;updateLabels();renderer.render(scene,camera);}
function updateLabels(){if(hero||sequence||!model)return;const w=stage.clientWidth,h=stage.clientHeight,mobile=w<600;for(const l of labels){const pos=mobile?l.mobile:l.desktop;l.button.style.left=pos[0]+'%';l.button.style.top=pos[1]+'%';const p=new THREE.Vector3(...l.anchor).project(camera);const x=(p.x+1)*w/2,y=(1-p.y)*h/2;const bx=l.button.offsetLeft+l.button.offsetWidth/2,by=l.button.offsetTop+l.button.offsetHeight/2;l.path.setAttribute('d',`M ${x} ${y} L ${bx} ${y+(by-y)*.65} L ${bx} ${by}`);l.dot.setAttribute('cx',x);l.dot.setAttribute('cy',y);l.path.style.opacity=l.dot.style.opacity=(p.z<1&&p.z>-1)?'1':'0';}}

// Product inspection keeps the original assemblies and dimensions intact.
const products={
 tag:{size:'50 × 70 мм · Захиалгаар өөрчилнө',detailSize:'Хэмжээ: Бэлгийн уутны шошго — өргөн 50 × өндөр 70 мм.',title:'Бэлгийн уутны шошго',node:'REV_GIFT_TAG_ASSEMBLY',copy:'Таны байгууллагын лого, мэндчилгээ бүхий бэлгийн уутны шошго. Таны хүссэн загвар, хэмжээгээр өөрчлөх боломжтой.'},
 bag:{size:'335 × 320 × 115 мм · Шошго 50 × 70 мм',detailSize:'Бэлгийн уут: өргөн 335 × өндөр 320 × гүн 115 мм. Шошго: 50 × 70 мм.',title:'Бэлгийн уут',node:'BAG_ASSEMBLY',copy:'Матт хар бэлгийн уут. Таны байгууллагын лого, мэндчилгээ бүхий шошготой.'},
 gold:{size:'Карт 54 × 85 мм · Алтан гулдмай 6 × 11 мм',detailSize:'Карт: өргөн 54 × өндөр 85 × зузаан 1.2 мм. Алтан гулдмай: 6 × 11 мм.',title:'Алтан гулдмай',node:'GOLD_CARD_LIFT_ASSEMBLY',copy:'999.9 сорьцтой 0.5 г шижир алтан гулдмай. Сувдан цагаан 54 × 85 мм карт дээр байрлуулсан.'},
 wine:{size:'Ø70.6 × 260 мм · Загвар',detailSize:'Загварт үзүүлсэн шил: диаметр 70.6 × өндөр 260 мм. Багтаамж 375 мл. Бодит хэмжээ сонгосон оргилуун дарс болон чимэглэлээс хамаарна.',title:'Оргилуун дарс',node:'BOTTLE_375ML_PARAMETRIC',copy:'Баярын мөчийг хамтдаа хуваалцах шампанск. Багцад 375 мл савлагааг харуулав.'},
 certificate:{size:'54 × 85 × 0.8 мм',detailSize:'Өргөн 54 × өндөр 85 × зузаан 0.8 мм.',title:'Сертификат',node:'CERTIFICATE_ASSEMBLY',copy:'Алтан гулдмайн мэдээлэл бүхий сертификат. Алтан гулдмай бүхий бэлгийн картын доор байрлана.'},
 envelope:{size:'130 × 95 × 4 мм · Лац Ø20 мм',detailSize:'Өргөн 130 × өндөр 95 мм. Дүүргэсэн үеийн зузаан 4 мм. Лац: диаметр 20 мм.',title:'Дугтуй & Мэндчилгээ',node:'ENVELOPE_ASSEMBLY',copy:'Товойлгон дүрсэлсэн алтан өнгийн лац дардастай, матт хар дугтуй.'},
 blackbox:{size:'125 × 90 × 30 мм',detailSize:'Өргөн 125 × гүн 90 × өндөр 30 мм.',title:'Нэмэлт бэлгийн хайрцаг',node:'HIDDEN_GIFT_BOX_125x90x30',copy:'Байгууллагын бэлгийн карт, эрхийн бичиг хийх боломжтой нэмэлт хайрцаг.'}
};
let hero=null,detailClone=null;const original=new Map();
function initProducts(){const fullSet=document.createElement('button');fullSet.textContent='Бэлгийн багц';fullSet.setAttribute('aria-label','Бэлгийн багцыг бүтнээр нь үзэх');fullSet.onclick=()=>document.querySelector('#back').click();document.querySelector('#item-switcher').append(fullSet);model.children.forEach(o=>original.set(o,{p:o.position.clone(),q:o.quaternion.clone(),visible:o.visible}));
const config=[
 ['gold','999.9 сорьц · 0.5 г',[.0575,.077,-.0575],[40,22],[3,26]],
 ['certificate','Картын доор байрлана',[.085,.072,-.06],[62,22],[52,26]],
 ['wine','Багцийн сонголт 1: Moet&Chandon Brut Imperial - 375мл<br>Багцийн сонголт 2: Champagne Nicolas Feuillatte Brut - 375мл<br>Багцийн сонголт 3: Шинэ жилийн гацуур - чимэглэл',[-.084,.095,0],[3,40],[3,40]],
 ['envelope','Лого - Алтлаг лац дардас',[.0575,.074,.075],[17,80],[3,72]],
 ['blackbox','Дугтуйн доор байрлах нэмэлт бэлгийн хайрцаг - Сонголтоор',[.1,.04,.07],[43,80],[3,82]],
 ['bag','Таны байгууллагын лого, мэндчилгээ бүхий шошготой.',[.43,.30,0],[79,38],[52,82]],
 ['tag','Таны хүссэн загвар, хэмжээгээр',[.362,.26,.0635],[79,61],[52,67]]];
for(const [key,sub,anchor,desktop,mobile] of config){products[key].subtitle=sub;const button=document.createElement('button');button.className='callout';button.dataset.product=key;button.innerHTML=`<strong>${products[key].title}<b aria-hidden="true">↗&#xfe0e;</b></strong><small class="measure">${products[key].size}</small>`;button.setAttribute('aria-label',`${products[key].title} — ойроос үзэх`);button.onclick=()=>selectProduct(key);document.querySelector('#callouts').append(button);const path=document.createElementNS('http://www.w3.org/2000/svg','path'),dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('r','3');document.querySelector('#lines').append(path,dot);labels.push({button,path,dot,anchor,desktop,mobile});
const chip=document.createElement('button');chip.dataset.product=key;chip.textContent=products[key].title;chip.onclick=()=>selectProduct(key);document.querySelector('#item-switcher').append(chip);}}
function restoreObjects(){if(detailClone){model.remove(detailClone);detailClone=null;}for(const [o,r] of original){o.position.copy(r.p);o.quaternion.copy(r.q);o.visible=r.visible;}}
function selectProduct(key){
 if(!model)return;sequence=null;cameraMove=null;restoreObjects();const info=products[key];let obj=model.getObjectByName(info.node),r=original.get(obj);
 if(key==='tag'){model.updateMatrixWorld(true);const source=obj;detailClone=source.clone(true);model.add(detailClone);detailClone.matrix.copy(model.matrixWorld).invert().multiply(source.matrixWorld);detailClone.matrix.decompose(detailClone.position,detailClone.quaternion,detailClone.scale);obj=detailClone;r={p:obj.position.clone(),q:obj.quaternion.clone()};}

 const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),(key==='bag'||key==='tag')?0:key==='blackbox'?.95:Math.PI/2).multiply(r.q);
 const end=new THREE.Vector3(0,.45,0);obj.position.copy(end);obj.quaternion.copy(q);model.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(obj),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
 const distance=Math.max(size.y,size.x/camera.aspect)*.85/Math.tan(THREE.MathUtils.degToRad(camera.fov/2))+size.z*.5;
 obj.position.copy(r.p);obj.quaternion.copy(r.q);
 hero={obj,key,time:0,start:r.p.clone(),end,q,fromQ:r.q.clone(),cam:camera.position.clone(),target:orbit.target.clone(),toCam:center.clone().add(new THREE.Vector3(0,0,Math.max(.15,distance))),toTarget:center};
 document.querySelectorAll('[data-product]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.product===key));document.querySelector('#item-title').textContent=info.title;document.querySelector('#item-copy').textContent=info.copy;document.querySelector('#item-options').innerHTML=key==='wine'?'<h3>Багцын сонголт</h3><ol>'+info.subtitle.split('<br>').map(option=>'<li>'+option.replace(/Багцийн сонголт [123]: /,'')+'</li>').join('')+'</ol>':'';document.querySelector('#item-size').textContent=info.detailSize;document.querySelector('#detail-action').hidden=key!=='bag';document.querySelector('#detail-action').onclick=()=>selectProduct('tag');updateUI();document.querySelector('#back').focus({preventScroll:true});if(stage.clientWidth<=760)parent.postMessage({type:'gift-preview-focus'},location.origin);
}
function animateHero(dt){if(!hero||sequence)return;const h=hero;h.time+=matchMedia('(prefers-reduced-motion: reduce)').matches?2:dt;const t=Math.min(1,h.time/.8),e=t*t*(3-2*t);h.obj.position.lerpVectors(h.start,h.end,e);h.obj.quaternion.slerpQuaternions(h.fromQ,h.q,e);if(!h.finished){camera.position.lerpVectors(h.cam,h.toCam,e);orbit.target.lerpVectors(h.target,h.toTarget,e);if(t===1)h.finished=true;}for(const o of model.children)o.visible=o===h.obj||t<.55;}

function overview(){const target=new THREE.Vector3(.20,.20,0),position=new THREE.Vector3(.83,.70,1.18);position.sub(target).multiplyScalar(Math.max(.94,1.12/camera.aspect)).add(target);return {camera:position,target};}
const ease=t=>{t=THREE.MathUtils.clamp(t,0,1);return t*t*(3-2*t);};
function startSequence(){
 if(!model)return;focus();const bag=model.getObjectByName('BAG_ASSEMBLY');
 const target=new THREE.Vector3(.43,.22,0),position=target.clone().add(new THREE.Vector3(.28,.25,.85).multiplyScalar(Math.max(1,1/camera.aspect)));
 sequence={time:0,bag,startCamera:position,startTarget:target};orbit.enabled=false;camera.position.copy(position);orbit.target.copy(target);updateUI();animateSequence(0);
}
function animateSequence(dt){
 if(!sequence)return;const a=sequence;a.time+=dt;const t=a.time;
 if(t>=10){focus();return;}
 const lift=ease((t-1)/2),travel=ease((t-3)/1.8),open=ease((t-4.8)/1.6);
 const rotation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),(1-travel)*Math.PI/2);
 const offset=new THREE.Vector3(.43*(1-travel),(.17+.38*lift)*(1-travel),-.0475*(1-travel));
 const lidRest=original.get(hinge);
 for(const [obj,r] of original){obj.visible=r.visible&&(obj===a.bag||t>=1);obj.position.copy(r.p);obj.quaternion.copy(r.q);if(obj===a.bag)continue;
  if(obj===hinge)obj.quaternion.slerpQuaternions(new THREE.Quaternion(),lidRest.q,open);
  obj.position.applyQuaternion(rotation).add(offset);obj.quaternion.premultiply(rotation);
 }
 const itemMotion=[['wine',.09,0,0],['gold',.17,-.01,-.025],['certificate',.10,.055,-.01],['envelope',.15,-.01,.03],['blackbox',.075,.035,.015]];
 itemMotion.forEach(([key,height,x,z],i)=>{const liftItem=ease((t-6.1-i*.10)/.85)*(1-ease((t-8.1-i*.05)/1.25));const obj=model.getObjectByName(products[key].node);obj.position.y+=height*liftItem;obj.position.x+=x*liftItem;obj.position.z+=z*liftItem;});
 const view=overview(),blend=ease((t-1)/4);camera.position.lerpVectors(a.startCamera,view.camera,blend);orbit.target.lerpVectors(a.startTarget,view.target,blend);const revealRoom=ease((t-.5)/1.1)*(1-ease((t-3.2)/1.6));camera.position.sub(orbit.target).multiplyScalar(1+.4*revealRoom).add(orbit.target);camera.position.y+=.17*revealRoom;orbit.target.y+=.17*revealRoom;
 const caption=t<1?'FGN 2026/7 SPECIAL EDITION':t<4.8?'Тусгайлан бэлтгэсэн хязгаарлагдмал тоо ширхэг бүхий 2026/7 Executive бэлгийн багц':t<6.4?'Үе дамжих Үнэт өв':'Үе дамжин үнэ цэнээ хадгалах эрхэм бэлэг — 999.9 сорьц бүхий шижир алт.';const el=document.querySelector('#sequence-caption');if(el.textContent!==caption)el.textContent=caption;
}
document.querySelector('#skip').onclick=focus;
document.querySelector('#replay').onclick=startSequence;document.querySelector('#flip').onclick=()=>{for(let i=0;i<12;i++)moveCamera('right');};
function moveCamera(action){
 if(!model||sequence)return;
 pauseRotation();
 if(hero&&!hero.finished){hero.time=2;animateHero(0);}
 const target=cameraMove?cameraMove.target.clone():orbit.target.clone(),position=cameraMove?cameraMove.to.clone():camera.position.clone();
 if(action==='reset'){if(hero){position.copy(hero.toCam);target.copy(hero.toTarget);}else{const view=overview();position.copy(view.camera);target.copy(view.target);}}
 else {const spherical=new THREE.Spherical().setFromVector3(position.clone().sub(target));
  if(action==='in')spherical.radius*=.82;if(action==='out')spherical.radius*=1.22;
  if(action==='left')spherical.theta-=Math.PI/12;if(action==='right')spherical.theta+=Math.PI/12;
  if(action==='up')spherical.phi-=Math.PI/18;if(action==='down')spherical.phi+=Math.PI/18;
  spherical.radius=THREE.MathUtils.clamp(spherical.radius,orbit.minDistance,orbit.maxDistance);spherical.phi=THREE.MathUtils.clamp(spherical.phi,.10,Math.PI*.90);position.setFromSpherical(spherical).add(target);
 }
 cameraMove={time:0,from:camera.position.clone(),targetFrom:orbit.target.clone(),to:position,target};
}
function animateCamera(dt){if(!cameraMove||sequence)return;const m=cameraMove;m.time+=reducedMotion.matches?1:dt;const progress=ease(m.time/.35);camera.position.lerpVectors(m.from,m.to,progress);orbit.target.lerpVectors(m.targetFrom,m.target,progress);if(progress>=1)cameraMove=null;}
document.querySelectorAll('[data-camera]').forEach(button=>button.onclick=()=>moveCamera(button.dataset.camera));
orbit.addEventListener('start',()=>{cameraMove=null;rotationInteracting=true;pauseRotation();if(hero&&!hero.finished){hero.time=2;animateHero(0);}});
orbit.addEventListener('end',()=>{rotationInteracting=false;pauseRotation();});
document.addEventListener('visibilitychange',()=>{clock.getDelta();rotationSpeed=0;});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){focus();return;}if(e.target.closest('button,a,input'))return;const action={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down','+':'in','=':'in','-':'out',Home:'reset'}[e.key];if(action){e.preventDefault();moveCamera(action);}});

// Selective foil relief: the gold ink catches light while paper and white ink stay matte.
function applyGoldFoil(material){
 if(!material.map||!(/DECAL_INNER_LID|DECAL_BOX_OUTER|REV_BAG_|CERT_FGN/.test(material.name)))return;
 material.bumpMap=material.map;material.bumpScale=.00024;material.envMapIntensity=1.65;
 material.onBeforeCompile=shader=>{
  const mask=`float foilMask(vec3 c){return smoothstep(0.055,0.13,c.r)*smoothstep(0.025,0.075,c.r-c.b)*smoothstep(0.012,0.035,c.g-c.b);}`;
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\n'+mask);
  shader.fragmentShader=shader.fragmentShader.replace('#include <bumpmap_pars_fragment>',THREE.ShaderChunk.bumpmap_pars_fragment.replace(/texture2D\( bumpMap, ([^\n]+?) \)\.x/g,'foilMask(texture2D( bumpMap, $1 ).rgb)'));
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nfloat goldFoil = foilMask(texture2D(map,vMapUv).rgb); roughnessFactor = mix(roughnessFactor,0.24,goldFoil);');
  shader.fragmentShader=shader.fragmentShader.replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor,0.96,goldFoil); diffuseColor.rgb = mix(diffuseColor.rgb,vec3(0.72,0.43,0.12),goldFoil*0.72);');
 };
 material.customProgramCacheKey=()=> 'fgn-raised-gold-foil-v1';material.needsUpdate=true;
}
function microSurface(repeat,fibrous=false){
 const n=128,data=new Uint8Array(n*n*4);let seed=91;
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){seed=(1664525*seed+1013904223)>>>0;const random=seed/4294967296;const value=Math.round(128+(random-.5)*52+(fibrous?Math.sin(x*2.6+y*.16)*15:0));const i=(y*n+x)*4;data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;}
 const t=new THREE.DataTexture(data,n,n,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeat,repeat);t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;
}
const velvetGrain=microSurface(20,true),paperGrain=microSurface(12);
function refineMaterial(old){
 const m=new THREE.MeshPhysicalMaterial();THREE.MeshStandardMaterial.prototype.copy.call(m,old);m.defines={STANDARD:"",PHYSICAL:""};m.name=old.name;m.envMapIntensity=.9;
 const n=m.name;
 if(/M_MODULAR_PEARL_FOAM|M_MODULAR_SOFT_LINER|M_PEARL_IVORY/.test(n)){
  m.color.set(n.includes('SOFT')?'#b5a68d':'#c0b29b');m.metalness=0;m.roughness=.91;m.sheen=.7;m.sheenColor.set('#fff0d3');m.sheenRoughness=.65;m.bumpMap=velvetGrain;m.bumpScale=.00012;
 }else if(/M_BOX_BLACK|M_MINI_BOX_MATTE_BLACK|M_ENVELOPE_BLACK|M_BRAID_BLACK/.test(n)){
  m.color.set(n.includes('ENVELOPE')?'#21201e':'#191a19');m.roughness=n.includes('BOX')?.66:.79;m.bumpMap=paperGrain;m.bumpScale=.000045;m.metalness=0;
 }else if(/M_PEARL_CARD|DECAL_GOLD_CARD/.test(n)){
  if(!m.map)m.color.set('#f6f3eb');m.roughness=.29;m.clearcoat=.38;m.clearcoatRoughness=.2;m.metalness=0;m.sheen=.16;m.sheenColor.set('#fff4dc');
 }else if(n.includes('BOTTLE_GLASS')){
  m.color.set('#112617');m.metalness=0;m.roughness=.14;m.clearcoat=1;m.clearcoatRoughness=.09;m.ior=1.5;m.transmission=.08;m.thickness=.003;
 }else if(/M_ORNAMENT_GOLD|M_CHAMPAGNE_GOLD|M_SOLID_GOLD|M_PRM_.*GOLD|M_PRM_SATIN/.test(n)){
  m.color.set('#d9aa54');m.metalness=.96;m.roughness=n.includes('SATIN')?.34:.22;m.envMapIntensity=1.2;
 }else if(n.includes('M_UPDATED_PARTNER_TAG')){m.roughness=.43;m.clearcoat=.15;m.clearcoatRoughness=.3;m.metalness=0;}
 if(/REV_BAG_|DECAL_INNER_LID|DECAL_BOX_OUTER/.test(n)){m.roughness=.7;}
 applyGoldFoil(m);return m;
}
frame();
