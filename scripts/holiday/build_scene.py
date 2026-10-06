"""Build Holiday card preview models and renders from supplied PDF page artwork.
Card footprint follows PDF MediaBox; thickness, coin relief and hanging cords are illustrative.
Run: blender -b --python scripts/holiday/build_scene.py
"""
import bpy, math, random, os
from mathutils import Vector
from pathlib import Path
random.seed(27)
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'public/holiday-preview'; OUT.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='CYCLES'; scene.cycles.samples=32; scene.cycles.use_denoising=True
scene.render.image_settings.file_format='WEBP' if False else 'PNG'
scene.view_settings.view_transform='AgX'; scene.view_settings.look='AgX - Medium High Contrast'; scene.view_settings.exposure=-.7
scene.world.color=(.2,.2,.2)

def mat(name,color,metal=0,rough=.4):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 return m
ivory=mat('Warm ivory card edge',(.8,.76,.65),0,.55)
gold=mat('Soft polished gold',(.83,.53,.15),.85,.23)
forest=mat('Forest green gift paper',(.017,.046,.033),0,.62)
tissue=mat('Ivory tissue paper',(.84,.79,.65),0,.82)
wood=mat('Natural branch',(.07,.04,.014),0,.85)
needles=[mat('Fir needles '+str(i),c,0,.65) for i,c in enumerate([(.025,.07,.035),(.04,.11,.06),(.07,.13,.065)])]

def tex(name,path,metal=0,rough=.48):
 m=mat(name,(1,1,1),metal,rough);n=m.node_tree.nodes.new('ShaderNodeTexImage');n.image=bpy.data.images.load(str(path),check_existing=True)
 m.node_tree.links.new(n.outputs['Color'],m.node_tree.nodes.get('Principled BSDF').inputs['Base Color']);return m

def cube(name,loc,scale,material,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(material)
 if bevel: b=o.modifiers.new('Soft manufactured edges','BEVEL');b.width=bevel;b.segments=3;o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o

def curve(name,pts,radius,material):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=12;c.bevel_depth=radius;c.bevel_resolution=2
 s=c.splines.new('BEZIER');s.bezier_points.add(len(pts)-1)
 for p,co in zip(s.bezier_points,pts):p.co=co;p.handle_left_type='AUTO';p.handle_right_type='AUTO'
 o=bpy.data.objects.new(name,c);scene.collection.objects.link(o);o.data.materials.append(material);return o

def cylinder_between(name,a,b,r,material,vertices=7):
 a,b=Vector(a),Vector(b);d=b-a;bpy.ops.mesh.primitive_cone_add(vertices=vertices,radius1=r,radius2=r*.65,depth=d.length,location=(a+b)/2);o=bpy.context.object;o.name=name;o.rotation_euler=d.to_track_quat('Z','Y').to_euler();o.data.materials.append(material);return o

W=.05398;H=.08560;T=.0012
names=['santa','snowman','tree','reindeer','gingerbread','bear']
coins=[(.50,.857),(.583,.644),(.505,.573),(.50,.571),(.50,.568),(.50,.57)]
roots=[]
for idx,name in enumerate(names):
 root=bpy.data.objects.new(name,None);scene.collection.objects.link(root);roots.append(root)
 points=[];r=.0036
 for cx,cy,start in [(W/2-r,H/2-r,0),(-W/2+r,H/2-r,90),(-W/2+r,-H/2+r,180),(W/2-r,-H/2+r,270)]:
  for k in range(13):
   a=math.radians(start+k*90/12);points.append((cx+r*math.cos(a),cy+r*math.sin(a)))
 N=len(points);verts=[(x,y,z) for z in [-T/2,T/2] for x,y in points]
 faces=[tuple(reversed(range(N))),tuple(range(N,2*N))]+[(i,(i+1)%N,(i+1)%N+N,i+N) for i in range(N)]
 mesh=bpy.data.meshes.new(name+' card');mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(name+' satin card',mesh);scene.collection.objects.link(o);o.parent=root
 front=tex(name+' front',OUT/'artwork'/f'{name}-front.png');back=tex(name+' back',OUT/'artwork'/f'{name}-back.png')
 for m in [ivory,front,back]:mesh.materials.append(m)
 # Small hanging hole matches the artwork's marker. Hardware remains illustrative.
 bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=.00105,depth=.009,location=(W*.365,H*.428,0));cut=bpy.context.object
 bpy.context.view_layer.objects.active=o;o.select_set(True);mod=o.modifiers.new('Hanging hole','BOOLEAN');mod.operation='DIFFERENCE';mod.object=cut
 bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cut,do_unlink=True)
 uv=o.data.uv_layers.new(name='Artwork')
 for p in o.data.polygons:
  p.material_index=1 if p.normal.z>.8 else 2 if p.normal.z<-.8 else 0
  for li in p.loop_indices:
   v=o.data.vertices[o.data.loops[li].vertex_index].co
   uv.data[li].uv=(v.x/W+.5 if p.normal.z>=0 else .5-v.x/W,v.y/H+.5)
 # Physical gold insert, matching exactly the illustrated position and diameter.
 u,v=coins[idx];cx=(u-.5)*W;cy=(.5-v)*H;radius=.0041
 bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=radius,depth=.0007,location=(cx,cy,T/2+.00035));coin=bpy.context.object;coin.name=name+' gold insert';coin.parent=root
 coin.data.materials.append(gold);cm=tex(name+' gold hallmark',OUT/'artwork'/f'{name}-front.png',.68,.28);coin.data.materials.append(cm)
 cuv=coin.data.uv_layers.active
 for p in coin.data.polygons:
  p.material_index=1 if p.normal.z>.8 else 0
  for li in p.loop_indices:
   co=coin.data.vertices[coin.data.loops[li].vertex_index].co
   cuv.data[li].uv=((co.x+cx)/W+.5,(co.y+cy)/H+.5)
 b=coin.modifiers.new('Minted edge','BEVEL');b.width=.00018;b.segments=3;coin.modifiers.new('Coin normals','WEIGHTED_NORMAL')
 bpy.ops.mesh.primitive_torus_add(major_radius=radius-.00028,minor_radius=.00012,major_segments=64,minor_segments=8,location=(cx,cy,T/2+.00073));rim=bpy.context.object;rim.name=name+' gold rim';rim.parent=root;rim.data.materials.append(gold)
 # Export in local XY with Z pointing towards viewer; GLTF exporter converts axes.
 bpy.ops.object.select_all(action='DESELECT')
 root.select_set(True)
 for child in root.children:child.select_set(True)
 bpy.context.view_layer.objects.active=o
 bpy.ops.export_scene.gltf(filepath=str(OUT/f'{name}.glb'),use_selection=True,export_format='GLB',export_yup=False)
 root.hide_render=True
 for child in root.children:child.hide_render=True

def light(name,pos,energy,size,color,target=(0,0,.12)):
 bpy.ops.object.light_add(type='AREA',location=pos);o=bpy.context.object;o.name=name;o.data.energy=energy;o.data.shape='DISK';o.data.size=size;o.data.color=color;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();return o
# Lighting in metre-scale scene.
light('Large softbox',(-.3,-.35,.55),20,.45,(1,.9,.73));light('Cool fill',(.35,-.15,.3),9,.32,(.83,.91,1));light('Top gold highlight',(.06,.2,.5),16,.3,(1,.83,.53))
bpy.ops.object.camera_add(location=(.008,-.24,.045));cam=bpy.context.object;scene.camera=cam;cam.data.type='ORTHO';cam.data.ortho_scale=.122
cam.rotation_euler=(Vector((0,0,0))-cam.location).to_track_quat('-Z','Y').to_euler()
scene.world.color=(.12,.12,.10)
# Individual transparent studio renders with slight perspective and visible edge.
scene.render.film_transparent=True;scene.render.resolution_x=680;scene.render.resolution_y=850;scene.render.resolution_percentage=100
for i,root in enumerate(roots):
 root.hide_render=False
 for child in root.children:child.hide_render=False
 root.rotation_euler=(math.radians(90),0,math.radians(-8));root.location=(0,0,0)
 scene.render.filepath=str(OUT/f'{names[i]}-render.png');bpy.ops.render.render(write_still=True)
 root.hide_render=True
 for child in root.children:child.hide_render=True
# Festive scene: branches above stone tabletop, three hanging, two in an open box, one standing.
scene.render.film_transparent=False
stone=mat('Honed limestone',(.40,.36,.28),0,.67)
p=stone.node_tree.nodes.get('Principled BSDF');noise=stone.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=120;noise.inputs['Detail'].default_value=3;bump=stone.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.16;bump.inputs['Distance'].default_value=.0003;stone.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);stone.node_tree.links.new(bump.outputs['Normal'],p.inputs['Normal'])
cube('Stone table',(0,.03,-.025),(2,2,.05),stone,.002)
wall=mat('Warm dark backdrop',(.033,.055,.041),0,.85);cube('Backdrop',(0,.32,.45),(2,.03,1),wall)
# Open green gift box with real depth and folded tissue.
x=-.057;y=-.015;bw=.16;bd=.105;bh=.035
cube('Box base',(x,y,.004),(bw,bd,.008),forest,.001)
for xx in [-1,1]:cube('Box side',(x+xx*(bw/2-.0015),y,bh/2),(.003,bd,bh),forest,.0006)
for yy in [-1,1]:cube('Box wall',(x,y+yy*(bd/2-.0015),bh/2),(bw,.003,bh),forest,.0006)
for i in range(12):
 verts=[]
 for j in range(10):
  xx=x-bw*.45+j*bw*.09;zz=.029+.005*math.sin(j*1.8+i)+random.uniform(0,.003)
  verts.extend([(xx,y-bd*.42+i*.006,zz),(xx,y-bd*.42+i*.006+.012,zz+.003)])
 faces=[(2*j,2*j+1,2*j+3,2*j+2) for j in range(9)];m=bpy.data.meshes.new('Tissue fold');m.from_pydata(verts,[],faces);ob=bpy.data.objects.new('Ivory folded tissue',m);scene.collection.objects.link(ob);ob.data.materials.append(tissue)
# Fine gold band on box front.
cube('Gift box gold band',(x,y-bd/2-.0006,.018),(.009,.001,.035),gold,.00015)
placements=[(-.13,.02,.207,90,-5),(-.01,.035,.225,90,5),(.115,.04,.203,90,-7),(-.09,-.017,.069,66,-12),(-.026,-.004,.067,62,12),(.112,-.04,.044,84,8)]
for i,(xx,yy,zz,rx,rz) in enumerate(placements):
 root=roots[i];root.hide_render=False;root.location=(xx,yy,zz);root.rotation_euler=(math.radians(rx),0,math.radians(rz))
 for child in root.children:child.hide_render=False
 bpy.context.view_layer.update()
 if i<3:
  hole=root.matrix_world@Vector((W*.365,H*.428,0));top=Vector((hole.x+.008,.055,.33))
  curve('Fine gold hanging cord',[hole+Vector((0,-.001,0)),(hole+top)/2+Vector((-.004,-.002,0)),top,(hole+top)/2+Vector((.003,.001,0)),hole+Vector((0,.001,0))],.00024,gold)
# Fir branch silhouette with batched tapered needles.
needle_verts=[];needle_faces=[]
def needle(a,b,r):
 a,b=Vector(a),Vector(b);direction=(b-a).normalized();u=direction.cross(Vector((0,1,0))).normalized()*r;v=direction.cross(u).normalized()*r;offset=len(needle_verts)
 needle_verts.extend([a+u,a+v,a-u,a-v,b]);needle_faces.extend([(offset+j,offset+(j+1)%4,offset+4) for j in range(4)])

curve('Main fir branch',[(-.25,.055,.346),(0,.07,.326),(.26,.07,.343)],.002,wood)
for k in range(19):
 start=Vector((-.245+k*.027,.065,.34-.012*math.sin(k/6)))
 end=start+Vector((random.uniform(-.025,.025),random.uniform(-.035,.025),random.uniform(-.065,-.025)))
 cylinder_between('Fir stem',start,end,.0008,wood)
 for j in range(30):
  base=start.lerp(end,j/30)
  for side in [-1,-.5,.5,1]:
   tip=base+Vector((side*random.uniform(.012,.023),random.uniform(-.012,.012),random.uniform(-.017,-.005)))
   needle(base,tip,.00042)
m=bpy.data.meshes.new('Fir foliage');m.from_pydata(needle_verts,[],needle_faces);m.update();o=bpy.data.objects.new('Evergreen needles',m);scene.collection.objects.link(o)
for material in needles:m.materials.append(material)
for poly in m.polygons:poly.material_index=random.randrange(len(needles))
# Small out-of-focus fairy lights on the rear wall.
bulb=mat('Warm fairy light',(1,.52,.14),0,.3);p=bulb.node_tree.nodes.get('Principled BSDF');p.inputs['Emission Color'].default_value=(1,.45,.1,1);p.inputs['Emission Strength'].default_value=4
for i in range(26):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=8,ring_count=4,radius=random.uniform(.001,.0025),location=(random.uniform(-.3,.3),.285,random.uniform(.04,.47)));bpy.context.object.data.materials.append(bulb)
# Restrained baubles on the tabletop.
for xx,yy,r in [(.17,.035,.012),(-.176,-.02,.008),(.064,.08,.009)]:
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,radius=r,location=(xx,yy,r));o=bpy.context.object;o.data.materials.append(gold)
 for poly in o.data.polygons:poly.use_smooth=True
cam.location=(.008,-.72,.345);target=Vector((0,.03,.163));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='PERSP';cam.data.lens=49;cam.data.dof.use_dof=True;cam.data.dof.focus_distance=(target-cam.location).length;cam.data.dof.aperture_fstop=4
scene.render.resolution_x=1600;scene.render.resolution_y=1400;scene.cycles.samples=64
scene.render.filepath=str(OUT/'holiday-scene.png')
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'scripts/holiday/Holiday_Master.blend'))
bpy.ops.render.render(write_still=True)
