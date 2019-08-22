# three-js-cone

Implements a MeshWorldNormalMaterial packing normals in RGB values like MeshNormalMaterial but for world space normals instead of view space normals.

This material can be used like THREE.MeshNormalMaterial, with the same parameters. However, it adds a uniform which is not among the built-in uniforms of THREE : viewMatrixInverse.
This uniform must be set before render.
An easy way to do so is to use the package three-js-extra-built-in-uniforms, which is a bit hacky but provides automatic updates for uniforms like viewMatrixInverse.
Or you can do it manually (like in the scene.onBeforeRender callback), or you can use MeshWorldNormalMaterial.updateMeshOnBeforeRender on the meshes using this material.

```javascript
// Example using THREE.Mesh.onBeforeRender
var wn_material = new THREE.MeshWorldNormalMaterial();
var mesh = new THREE.Mesh(geometry,material);
MeshWorldNormalMaterial.updateMeshOnBeforeRender(mesh);
```

```javascript
// Example using THREE.Scene.onBeforeRender
var wn_material = new THREE.MeshWorldNormalMaterial();
var mesh1 = new THREE.Mesh(geometry1,material);
var mesh2 = new THREE.Mesh(geometry1,material);
scene.add(mesh1);
scene.add(mesh2);
scene.onBeforeRender = function(renderer, scene, camera, geometry, material, group){
 wn_material.uniforms.viewMatrixInverse.value.copy(camera.matrixWorld);
};
```
