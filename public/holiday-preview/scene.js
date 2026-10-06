import * as THREE from 'three';
import { GLTFLoader } from '/gift-preview/vendor/GLTFLoader.js';
import { RoomEnvironment } from '/gift-preview/vendor/RoomEnvironment.js';
const stage=document.querySelector('#stage'),poster=document.querySelector('#poster'),tools=document.querySelector('#tools');
const slugs=['santa','snowman','tree','reindeer','gingerbread','bear'];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,model,env,pmrem,raf,resizeObserver,sparkleTexture,active=true,paused=reduced.matches,disposed=false;
let yaw=0,pitch=0,clock=0,last=0,down=null;
const pendants=[],glints=[],pickables=[];
function fallback(){document.body.classList.remove('ready');tools.hidden=true;renderer?.domElement.remove();cancelAnimationFrame(raf);}
function sparkleMap(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,64,0,64,64,62);g.addColorStop(0,'#fffbea');g.addColorStop(.12,'#ffe6a0aa');g.addColorStop(1,'#ffdb8000');x.fillStyle=g;x.fillRect(0,0,128,128);x.fillStyle='#fffce8';x.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?5:58;i?x.lineTo(64+Math.cos(a)*r,64+Math.sin(a)*r):x.moveTo(64+Math.cos(a)*r,64+Math.sin(a)*r);}x.closePath();x.fill();return new THREE.CanvasTexture(c);}
try{
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor('#263b2e');renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.prepend(renderer.domElement);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.01,5);camera.up.set(0,0,1);const target=new THREE.Vector3(0,.03,.163);const base=new THREE.Vector3(.008,-.72,.345).sub(target);
 pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();env=pmrem.fromScene(room,.06);scene.environment=env.texture;room.dispose();scene.environmentIntensity=.6;
 scene.add(new THREE.HemisphereLight(0xfff1dc,0x526147,.8));const sun=new THREE.DirectionalLight(0xffefd5,2.7);sun.position.set(-.3,-.5,.6);sun.target.position.copy(target);scene.add(sun,sun.target);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-.4,right:.4,top:.45,bottom:-.3,near:.01,far:2});sun.shadow.bias=-.00015;sun.shadow.normalBias=.00035;
 const fill=new THREE.DirectionalLight(0xe2edff,.8);fill.position.set(.3,-.1,.25);scene.add(fill);
 const sheen=new THREE.PointLight(0xffefb5,.045,.8,2);scene.add(sheen);
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=35;camera.updateProjectionMatrix();}resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);resize();
 function syncPause(){document.querySelector('#pause').textContent=paused?'▷':'Ⅱ';document.querySelector('#pause').setAttribute('aria-pressed',String(paused));document.querySelector('#pause').setAttribute('aria-label',paused?'Хөдөлгөөнийг үргэлжлүүлэх':'Хөдөлгөөнийг түр зогсоох');}
 document.querySelector('#pause').onclick=()=>{paused=!paused;syncPause();};syncPause();
 document.querySelector('#left').onclick=()=>{yaw=Math.max(-.2,yaw-.06);};document.querySelector('#right').onclick=()=>{yaw=Math.min(.2,yaw+.06);};document.querySelector('#reset').onclick=()=>{yaw=pitch=0;};
 const canvas=renderer.domElement;
 canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,yaw,pitch};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(down){yaw=THREE.MathUtils.clamp(down.yaw+(e.clientX-down.x)*.0015,-.2,.2);pitch=THREE.MathUtils.clamp(down.pitch+(e.clientY-down.y)*.0005,-.025,.04);}});
 canvas.addEventListener('pointercancel',()=>{down=null;});
 canvas.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<8){const b=canvas.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(pickables,false)[0];if(hit)parent.postMessage({type:'holiday-card-open',slug:hit.object.userData.slug},location.origin);}down=null;});
 window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===parent&&e.data?.type==='holiday-scene-active')active=e.data.active===true;});
 new GLTFLoader().load('./holiday-scene.glb',gltf=>{
  if(disposed)return;model=gltf.scene;scene.add(model);sparkleTexture=sparkleMap();
  const coins=[];
  model.traverse(o=>{if(o.isMesh){o.castShadow=!/fir|evergreen|branch|santa|snowman|tree|cord|backdrop/i.test(o.name);o.receiveShadow=!/backdrop|fir|evergreen/i.test(o.name);for(const m of [o.material].flat()){m.envMapIntensity=/gold/i.test(o.name)?1.4:.5;if(m.map)m.map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());if(/gold/i.test(o.name)){m.metalness=.9;m.roughness=.18;}}let root=o;while(root&&!slugs.includes(root.name))root=root.parent;if(root){o.userData.slug=root.name;pickables.push(o);}if(/gold[ _]insert/.test(o.name))coins.push(o);}});
  for(const coin of coins){const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:sparkleTexture,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));sprite.position.copy(coin.position).add(new THREE.Vector3(-.0025,.0023,.0016));sprite.scale.setScalar(.005);coin.parent.add(sprite);glints.push(sprite);}
  // Pivot at each hanging hole, keeping the cord attachment fixed.
  for(const slug of slugs.slice(0,3)){const card=model.getObjectByName(slug);if(!card)continue;card.updateWorldMatrix(true,true);const anchor=card.localToWorld(new THREE.Vector3(.05398*.365,.0856*.428,0));const pivot=new THREE.Group();scene.add(pivot);pivot.position.copy(anchor);pivot.attach(card);pendants.push(pivot);}
  document.body.classList.add('ready');poster.setAttribute('aria-hidden','true');tools.hidden=false;
 },undefined,fallback);
 function frame(time=0){if(disposed)return;raf=requestAnimationFrame(frame);const dt=Math.min((time-last)/1000,.05);last=time;if(!active||document.hidden)return;if(!paused)clock+=dt;
  const drift=paused?0:Math.sin(clock*.24)*.012;camera.position.copy(base).applyAxisAngle(new THREE.Vector3(0,0,1),yaw+drift).add(target);camera.position.z+=pitch;camera.lookAt(target);
  pendants.forEach((p,i)=>{p.rotation.y=Math.sin(clock*.75+i*1.7)*.018;p.rotation.z=Math.sin(clock*.6+i)*.012;});
  sheen.position.set(Math.sin(clock*.5)*.15,-.15,.23+Math.cos(clock*.4)*.06);
  glints.forEach((g,i)=>{const pulse=Math.pow(Math.max(0,Math.sin(clock*1.55+i*1.7)),6);g.material.opacity=paused?0:pulse;g.scale.setScalar(.006+pulse*.007);});renderer.render(scene,camera);
 }frame();
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});
}catch{fallback();}
window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);resizeObserver?.disconnect();model?.traverse(o=>{o.geometry?.dispose();for(const m of [o.material].flat().filter(Boolean)){m.map?.dispose();m.dispose();}});glints.forEach(g=>g.material.dispose());sparkleTexture?.dispose();env?.dispose();pmrem?.dispose();renderer?.dispose();},{once:true});
