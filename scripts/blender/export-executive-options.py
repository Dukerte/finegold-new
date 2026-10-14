"""Blender CLI: -b FGN_Three_Cinematic_Product_Options_v3.blend -P this.py -- OUTPUT_DIR.
Export supplied tea and honey assemblies in metres, preserving their tray placement.
"""
import bpy, sys, os
from mathutils import Vector, Matrix
out = sys.argv[sys.argv.index('--') + 1]
for key, collection, prefix in [('tea', 'QUOTE_02_SPARKLING_TEA_PRODUCT', 'QUOTE_02_SPARKLING_TEA__'), ('honey', 'QUOTE_03_HONEY_PRODUCT', 'QUOTE_03_HONEY__')]:
    source = bpy.data.collections[collection]
    source_scene = bpy.data.scenes.new('SOURCE_' + key)
    for o in source.objects: source_scene.collection.objects.link(o)
    # The quote collections are excluded from the saved view layer. Evaluate
    # them in their own scene so transforms and boolean tray recesses survive.
    for o in source.objects:
        for modifier in o.modifiers:
            if modifier.type == 'BOOLEAN' and modifier.object:
                name = modifier.object.name
                candidate = bpy.data.objects.get(prefix + name.removeprefix(prefix))
                if candidate: modifier.object = candidate
    bpy.context.window.scene = source_scene
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    selected = [o for o in source.objects if not o.hide_render and o.type in {'MESH','FONT'} and ((key == 'tea' and 'BLA_' in o.name) or (key == 'honey' and 'HONEY_OPT__' not in o.name))]
    export_scene = bpy.data.scenes.new('WEB_' + key)
    product = bpy.data.objects.new('OPTION_PRODUCT', None)
    export_scene.collection.objects.link(product)
    objects = []
    for obj in selected:
        mesh = bpy.data.meshes.new_from_object(obj.evaluated_get(depsgraph), preserve_all_data_layers=True, depsgraph=depsgraph)
        clone = bpy.data.objects.new(obj.name.removeprefix(prefix), mesh)
        export_scene.collection.objects.link(clone)
        clone.matrix_world = obj.matrix_world.copy()
        if 'IVORY_INSERT' not in clone.name:
            clone.parent = product
        else:
            clone.name = 'OPTION_INSERT'
        objects.append(clone)
    bounds = [o.matrix_world @ v.co for o in objects if o.parent == product for v in o.data.vertices]
    lo = Vector(tuple(min(v[i] for v in bounds) for i in range(3)))
    hi = Vector(tuple(max(v[i] for v in bounds) for i in range(3)))
    center = (lo + hi) / 2
    print(key, 'bounds', tuple(lo), tuple(hi))
    product.location = center
    for obj in objects:
        if obj.parent == product: obj.location -= center
    bpy.context.window.scene = export_scene
    bpy.ops.export_scene.gltf(filepath=os.path.join(out, key + '.glb'), export_format='GLB', use_active_scene=True, use_selection=False, export_apply=True, export_animations=False, export_cameras=False, export_lights=False, export_yup=True)
