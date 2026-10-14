import * as THREE from 'three';
import { GLTFLoader } from '/gift-preview/vendor/GLTFLoader.js';
import { OrbitControls } from '/gift-preview/vendor/OrbitControls.js';
const status=document.querySelector('#status');
const initiallyPackaged=new URLSearchParams(location.search).get('packaged')!=='0';
try {
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.toneMapping=THREE.AgXToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;document.body.append(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.001,10);camera.position.set(.042,-.092,.145);
const pmrem=new THREE.PMREMGenerator(renderer);
// Linear HDR reflections baked from the exact approved Blender presentation scene.
const studioResponse=await fetch('./reference-studio.bin');
if(!studioResponse.ok)throw new Error('Studio lighting unavailable');
const studioRGB=new Float32Array(await studioResponse.arrayBuffer());
const studioRGBA=new Float32Array(1024*512*4);
for(let i=0,j=0;i<studioRGB.length;i+=3,j+=4){studioRGBA[j]=studioRGB[i];studioRGBA[j+1]=studioRGB[i+1];studioRGBA[j+2]=studioRGB[i+2];studioRGBA[j+3]=1;}
const studioTexture=new THREE.DataTexture(studioRGBA,1024,512,THREE.RGBAFormat,THREE.FloatType);
studioTexture.mapping=THREE.EquirectangularReflectionMapping;studioTexture.needsUpdate=true;
const env=pmrem.fromEquirectangular(studioTexture);studioTexture.dispose();
scene.environment=env.texture;scene.environmentRotation.set(Math.PI/2,0,Math.PI/2);
camera.up.set(0,0,1);
const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=true;controls.rotateSpeed=.35;
const root=new THREE.Group();root.rotation.set(0,0,Math.PI);scene.add(root);let bar,card,target=initiallyPackaged?1:0,progress=initiallyPackaged?1:0,serial=0,active=true,rotate=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

// Actual tabletop geometry, lit with the same warm studio reflections as the product.
const timber=new THREE.MeshStandardMaterial({color:0x342218,roughness:.48});
timber.onBeforeCompile=shader=>{
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 timberUV;').replace('#include <uv_vertex>','#include <uv_vertex>\ntimberUV=position.xy;');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
 varying vec2 timberUV;
 float grainHash(float n){return fract(sin(n)*43758.5453);}
 float grainNoise(float x){float i=floor(x);float f=fract(x);return mix(grainHash(i),grainHash(i+1.),f*f*(3.-2.*f));}`)
 .replace('#include <color_fragment>',`#include <color_fragment>
 float along=timberUV.x*350.;
 float across=timberUV.y*22000.+sin(along*.09)*5.;
 float grain=grainNoise(across)*.45+grainNoise(across*.21)*.35+grainNoise(across*.043)*.2;
 diffuseColor.rgb*=mix(.43,1.14,grain);
 `);
};
const table=new THREE.Mesh(new THREE.PlaneGeometry(2,2),timber);table.position.z=-.0038;table.receiveShadow=true;scene.add(table);
const keyLight=new THREE.DirectionalLight(0xffdfa0,.7);keyLight.position.set(-.07,.04,.16);keyLight.castShadow=true;keyLight.shadow.mapSize.set(2048,2048);Object.assign(keyLight.shadow.camera,{left:-.10,right:.10,top:.10,bottom:-.10,near:.01,far:.5});keyLight.shadow.bias=-.000015;keyLight.shadow.normalBias=.00002;keyLight.shadow.radius=4;scene.add(keyLight);
scene.add(new THREE.HemisphereLight(0xf2ddba,0x261c14,.35));
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=512;shadowCanvas.height=768;const sc=shadowCanvas.getContext('2d');sc.shadowColor='rgba(0,0,0,.9)';sc.shadowBlur=24;sc.fillStyle='rgba(0,0,0,.8)';sc.beginPath();sc.roundRect(38,36,436,684,28);sc.fill();const contact=new THREE.Mesh(new THREE.PlaneGeometry(.062,.095),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false,opacity:.7}));contact.position.set(.001,-.001,-.00375);scene.add(contact);
let flipped=false,turnTime=0;
function compose(){
 root.rotation.set(0,0,0);flipped=false;root.position.z=0;
 camera.up.set(0,0,1);controls.target.set(0,target?0:.003,0);
 camera.position.set(target?.072:.057,target?-.128:-.101,target?.14:.106);
 controls.minPolarAngle=0;controls.maxPolarAngle=Math.PI;controls.minAzimuthAngle=-Infinity;controls.maxAzimuthAngle=Infinity;controls.update();
 controls.update();
 table.visible=false;contact.visible=false;
}
compose();
const loader=new GLTFLoader(),textures=new THREE.TextureLoader();const dimensions={'1':[.0086,.0144,.00045],'2-5':[.0112,.0187,.00065],'5':[.014,.023,.00085],'10':[.0155,.0255,.0014],'20':[.018,.031,.00195],'1oz':[.024,.041,.00175],'50':[.027,.047,.0022],'100':[.027,.047,.0043]};let key='20',dragging=false;controls.addEventListener('start',()=>dragging=true);controls.addEventListener('end',()=>dragging=false);
// Keep the larger capsules above the website printed at the foot of the card.
const offsets={"1": -0.008468449197860958, "2-5": -0.010680926916221032, "5": -0.012817112299465243, "10": -0.014114081996434939, "20": -0.015945098039215684, "1oz": -0.01556363636363636, "50": -0.0095, "100": -0.0095};
const valid=['1','2-5','5','10','20','1oz','50','100'];
function dispose(group){group?.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of [].concat(o.material)){m.map?.dispose();m.dispose();}}});root.remove(group);}
async function load(k){if(!valid.includes(k))return;const id=++serial;key=k;status.hidden=false;try{const gltf=await loader.loadAsync(`./reference-models/${k}.glb?v=20261014-reference-normals`);if(id!==serial){gltf.scene.traverse(o=>o.geometry?.dispose());return;}dispose(bar);dispose(card);bar=gltf.scene;bar.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=false;o.material.envMap=env.texture;o.material.envMapRotation.set(Math.PI/2,0,Math.PI/2);o.material.envMapIntensity=.7;o.material.metalness=1;const polished=o.name.includes('Curve')||o.name.includes('relief');o.material.color.setRGB(...(polished?[.88,.55,.18]:[.83,.48,.12]));o.material.roughness=polished?.16:.25;}});root.add(bar);
const map=await textures.loadAsync('./shared-mongon-mod.png');if(id!==serial){map.dispose();return;}map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=renderer.capabilities.getMaxAnisotropy();const foil=map.clone();foil.colorSpace=THREE.NoColorSpace;foil.needsUpdate=true;
// The aligned engraving is raised, beveled geometry baked into each GLB.

card=new THREE.Group();const shape=new THREE.Shape(),w=.054,h=.0856,r=.003;shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
const [bw,bh]=dimensions[k];
// The card opening sits just inside the bar silhouette, so no page background
// leaks through as a contrasting frame around the gold.
const hw=bw/2-.00022,hh=bh/2-.00022,hr=.00045,oy=offsets[k];
const hole=new THREE.Path();hole.moveTo(-hw+hr,oy-hh);hole.lineTo(-hw,oy-hh+hr);hole.lineTo(-hw,oy+hh-hr);hole.quadraticCurveTo(-hw,oy+hh,-hw+hr,oy+hh);hole.lineTo(hw-hr,oy+hh);hole.quadraticCurveTo(hw,oy+hh,hw,oy+hh-hr);hole.lineTo(hw,oy-hh+hr);hole.quadraticCurveTo(hw,oy-hh,hw-hr,oy-hh);hole.lineTo(-hw+hr,oy-hh);hole.closePath();shape.holes.push(hole);
const geo=new THREE.ShapeGeometry(shape);const pos=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<pos.count;i++)uv.setXY(i,(pos.getX(i)+w/2)/w,(pos.getY(i)+h/2)/h);
const cardMaterial=new THREE.MeshPhysicalMaterial({specularIntensity:.22,map,roughness:.48,metalness:1,metalnessMap:foil,envMap:env.texture,envMapIntensity:.35});
cardMaterial.envMapRotation.set(Math.PI/2,0,Math.PI/2);
cardMaterial.onBeforeCompile=shader=>{
 shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
  float motif=texture2D(map,vMapUv).r;
  diffuseColor.rgb=mix(vec3(.006,.006,.005),vec3(.83,.58,.24),motif);
 `).replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 roughnessFactor=mix(.45,.2,texture2D(map,vMapUv).r);`);
};
const plane=new THREE.Mesh(geo,cardMaterial);plane.castShadow=true;plane.receiveShadow=true;card.add(plane);const backMap=await textures.loadAsync(`./back-${k}.webp`);if(id!==serial){backMap.dispose();return;}backMap.colorSpace=THREE.SRGBColorSpace;const rearMaterial=new THREE.MeshPhysicalMaterial({specularIntensity:.22,map:backMap,roughness:.48,metalness:1,envMap:env.texture,envMapIntensity:.35});
rearMaterial.envMapRotation.set(Math.PI/2,0,Math.PI/2);
rearMaterial.onBeforeCompile=shader=>{
 shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
 float rearFoil=smoothstep(.025,.5,max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b)));
 ${k==='50'||k==='100'?'if(vMapUv.x>.21 && vMapUv.x<.79 && vMapUv.y>.61 && vMapUv.y<.69) rearFoil=0.;':''}
 diffuseColor.rgb=mix(vec3(.006,.006,.005),vec3(.83,.58,.24),rearFoil);
 `).replace('#include <metalnessmap_fragment>',`#include <metalnessmap_fragment>
 metalnessFactor=rearFoil;`).replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 roughnessFactor=mix(.45,.2,rearFoil);`);
};
rearMaterial.customProgramCacheKey=()=> 'studio-rear-'+k;
const rear=new THREE.Mesh(geo.clone(),rearMaterial);rear.rotation.y=Math.PI;rear.position.z=-.0008;card.add(rear);
const edge=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.0008,bevelEnabled:false,curveSegments:24}),[new THREE.MeshBasicMaterial({visible:false}),new THREE.MeshStandardMaterial({color:0x131512,roughness:.4})]);edge.position.z=-.0008;card.add(edge);
root.add(card);status.hidden=true;parent.postMessage({type:'product-ready'},location.origin);
}catch(e){status.textContent='3D загварыг ачаалж чадсангүй';parent.postMessage({type:'product-error'},location.origin);}}
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;const d=e.data;if(d.type==='product-select')load(d.key);if(d.type==='product-package'){target=d.value?1:0;compose();}if(d.type==='product-active')active=!!d.value;if(d.type==='product-rotate')rotate=!!d.value;if(d.type==='product-reset'||d.type==='product-face'){controls.enableDamping=false;controls.update();compose();if(d.type==='product-face'&&d.face==='rear')root.rotation.y=Math.PI;controls.enableDamping=true;}if(d.type==='product-flip'){flipped=!flipped;root.rotation.y=flipped?Math.PI:0;root.position.z=flipped?.003:0;}});
new ResizeObserver(()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}).observe(document.body);
let last=performance.now();renderer.setAnimationLoop(now=>{const dt=Math.min((now-last)/1000,.05);last=now;if(!active||document.hidden)return;progress=reduced?target:THREE.MathUtils.damp(progress,target,4,dt);if(bar){bar.position.y=offsets[key]*progress;bar.position.z=.012*Math.sin(progress*Math.PI);bar.scale.setScalar((.055/dimensions[key][1])*(1-progress)+progress);}if(card){card.position.z=-dimensions[key][2]/2;card.position.y=-.1*(1-progress);card.visible=progress>.005;}if(rotate&&!reduced&&!dragging){turnTime+=dt;root.rotation.z=Math.PI+Math.sin(turnTime*.45)*.12;}controls.update();renderer.render(scene,camera);});
load(new URLSearchParams(location.search).get('weight')||key);
}catch(e){status.textContent='Энэ төхөөрөмж 3D дэмжихгүй байна.';parent.postMessage({type:'product-error'},location.origin);}
