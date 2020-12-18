(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('three-full')) :
    typeof define === 'function' && define.amd ? define(['three-full'], factory) :
    (global.THREEMeshWorldNormalMaterial = factory(global.THREE));
}(this, (function (threeFull) { 'use strict';

    threeFull = threeFull && threeFull.hasOwnProperty('default') ? threeFull['default'] : threeFull;

    try {
        if(window && !window.THREEExtraBuiltInUniforms && !threeFull.ExtraBuiltInUniforms){
            console.warn("Package three-js-extra-built-in-uniforms does not seem to be loaded (THREE.ExtraBuiltInUniforms is undefined). Don't forget to manage extra uniforms updates manually.");
        }
    }
    catch( e ) {
        // we are on node, so the warning does not make sens
    }

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

        parameters.uniforms = threeFull.UniformsUtils.merge([
          threeFull.ShaderLib.normal.uniforms,
          { viewMatrixInverse: { value: new threeFull.Matrix4() } }
        ]);
        parameters.vertexShader = threeFull.ShaderLib.normal.vertexShader;
        parameters.fragmentShader =
            "uniform mat4 viewMatrixInverse;" + "\n" +
            threeFull.ShaderLib.normal.fragmentShader.replace(
                "gl_FragColor = ",

                "normal = normalize(mat3(viewMatrixInverse) * normal);" + "\n" +
                "gl_FragColor = "
            );

    	this.bumpMap = null;
    	this.bumpScale = 1;

    	this.normalMap = null;
    	this.normalMapType = threeFull.TangentSpaceNormalMap;
    	this.normalScale = new threeFull.Vector2( 1, 1 );

    	this.displacementMap = null;
    	this.displacementScale = 1;
    	this.displacementBias = 0;

    	this.wireframe = false;
    	this.wireframeLinewidth = 1;

    	this.fog = false;
    	this.lights = false;

    	this.skinning = false;
    	this.morphTargets = false;
    	this.morphNormals = false;

    	this.isMeshNormalMaterial = true;

    	threeFull.ShaderMaterial.call( this, parameters);

    }
    MeshWorldNormalMaterial.prototype = Object.create( threeFull.ShaderMaterial.prototype );
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

    threeFull.MeshWorldNormalMaterial = MeshWorldNormalMaterial;

    var MeshWorldNormalMaterial_1 = MeshWorldNormalMaterial;

    return MeshWorldNormalMaterial_1;

})));
