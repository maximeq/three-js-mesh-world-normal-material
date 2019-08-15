var THREE = require("three-full");

/**
 * @author Maxime Quiblier / http://github.com/maximeq
 *
 * This material will save world space normals in pixels, the way MeshNormalMaterial does for view space normals.
 * Use same parameters as for MeshNormalMaterial.
 *
 * You need to update the uniform viewMatrixInverse for this material to work properly.
 * If you don't want to do it by yourself, just call MeshWorldNormalMaterial.updateMeshOnBeforeRender on any mesh using this material.
 * see MeshWorldNormalMaterial.updateMeshOnBeforeRender for more details.
 */
function MeshWorldNormalMaterial( parameters ) {
    parameters = parameters || {};

    parameters.uniforms = THREE.UniformsUtils.merge([
      THREE.ShaderLib.normal.uniforms,
      { viewMatrixInverse: { value: new THREE.Matrix4() } }
    ]);
    parameters.vertexShader = THREE.ShaderLib.normal.vertexShader;
    parameters.fragmentShader =
        "uniform mat4 viewMatrixInverse;" + "\n" +
        THREE.ShaderLib.normal.fragmentShader.replace(
            "gl_FragColor = ",

            "normal = normalize(mat3(viewMatrixInverse) * normal);" + "\n" +
            "gl_FragColor = "
        );
	THREE.ShaderMaterial.call( this, parameters);

};

MeshWorldNormalMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
MeshWorldNormalMaterial.prototype.constructor = MeshWorldNormalMaterial;

/**
 *  Helper to update the mesh onBeforeRender function to update the vewMatrixInverse uniform.
 *  Call it only once on each mesh or it may impact performances.
 *  Note that previously set onBeforeRender will be preserved.
 */
MeshWorldNormalMaterial.updateMeshOnBeforeRender = function ( mesh ) {
    let oldOnBeforeRender = mesh.onBeforeRender;
    mesh.onBeforeRender = function(renderer, scene, camera, geometry, material, group){
        oldOnBeforeRender.call(this,renderer, scene, camera, geometry, material, group);
        if(this.material instanceof MeshWorldNormalMaterial){
            this.material.uniforms.viewMatrixInverse.value.copy(camera.matrixWorld);
        }
    };
};

THREE.MeshWorldNormalMaterial = MeshWorldNormalMaterial;

module.exports = MeshWorldNormalMaterial;
