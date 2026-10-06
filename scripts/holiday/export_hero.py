"""Export the existing packed festive master for the live web scene."""
import bpy
from pathlib import Path
root=Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(root/'scripts/holiday/Holiday_Master.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in list(bpy.context.scene.objects):
 if o.type=='CURVE':
  o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH');o.select_set(False)
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
 if o.type in {'MESH','EMPTY'} and not o.hide_render:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(root/'public/holiday-preview/holiday-scene.glb'),use_selection=True,export_format='GLB',export_yup=False)
