# Holiday collection 2026/7

Six 0.5 g cards. Source: user-supplied `NY-Concept-0_1.5gr 3-1.pdf`, 12 sequential front/back pages. Artwork is reproduced unchanged. Card footprint is approximately 54 × 85.6 mm from the PDF MediaBox. The 1.2 mm thickness, circular insert relief, hanging-hole construction and cords are illustrative and require production confirmation.

`Holiday_Master.blend` contains the packed artwork, six card models and the festive scene. `build_scene.py` regenerates the GLB models and PNG renders using Blender. The interactive viewer uses the site's existing local Three.js distribution. Compress `holiday-scene.png` to WebP after rendering for the website.

Holiday price remains unconfirmed until purchase, based on the purchase-day Bank of Mongolia rate. No fixed price or manufacturing premium is inferred. Holiday and Executive selections share the existing session basket and preorder receiver. The Executive minimum of 10 applies to Executive quantities independently. Holiday submissions are requests for confirmation, with no payment collected.

Verification: production build; 8 order API tests with a mocked receiver; desktop/mobile UI, front/back model view, basket persistence across collection routes. No real order submitted. The repository-wide TypeScript check has pre-existing AboutPage motion typing failures; no errors were reported for the changed Holiday/cart files.

The opening scene is now live WebGL: `export_hero.py` exports the packed master to `holiday-scene.glb`; `scene.js` adds restricted camera movement, hanging-hole pivots, moving gold highlights and card selection. The static render remains the loading/WebGL fallback. Motion pauses offscreen and when a dialog opens; reduced-motion visitors start with motion paused.
