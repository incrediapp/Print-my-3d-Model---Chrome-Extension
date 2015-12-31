var createNewViewer = function(elemId, url) {
	// SCENE BASIC SETUP
	var loadedObj;
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xb5b5b5, 500, 3000 );

	var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize( 250, 250 );
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.soft = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

// CAMERA & CONTROLS
	var SCREEN_WIDTH = 150;
	var SCREEN_HEIGHT = 150;
	var VIEW_ANGLE = 45;
	var ASPECT = 1;
	var NEAR = 0.2;
	var FAR = 2000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set( -100, 20, -50);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.maxDistance = 1600;

// LIGHTS
	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );

	light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2, 1 );
	light.position.set( 100, 1000, 1000 );
	light.target.position.set( 0, 0, 0 );
	light.castShadow = true;
	light.shadowCameraNear = 1200;
	light.shadowCameraFar = 2500;
	light.shadowCameraFov = 1;
	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;
	light.shadowBias = 0.0001;
	light.shadowDarkness = 0.2;
	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;

	scene.add( light );

	var spotLightHelper = new THREE.SpotLightHelper( light );
	scene.add( spotLightHelper );

	backlight = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2, 1 );
	backlight.position.set( 0, 50, -800 );
	backlight.target.position.set( 0, 0, 0 );
	backlight.castShadow = true;
	backlight.shadowCameraNear = 1200;
	backlight.shadowCameraFar = 2500;
	backlight.shadowCameraFov = 1;
	backlight.shadowMapWidth = 2048;
	backlight.shadowMapHeight = 2048;
	backlight.shadowBias = 0.0001;
	backlight.shadowDarkness = 0.2;
	backlight.shadowMapWidth = 1024;
	backlight.shadowMapHeight = 1024;

	scene.add( backlight );

	var fitMeshToCamera = function(group) {
		var max = {x : 0,y : 0,z : 0};
		min = {x : 0,y : 0,z : 0};

		group.traverse( function (child) {
			if ( child instanceof THREE.Mesh ) {
				var bbox = new THREE.BoundingBoxHelper( child, 0xffffff );
				bbox.update();

				max.x = (bbox.box.max.x > max.x) ? bbox.box.max.x : max.x;
				max.y = (bbox.box.max.y > max.y) ? bbox.box.max.y : max.y;
				max.z = (bbox.box.max.z > max.z) ? bbox.box.max.z : max.z;

				min.x = (bbox.box.min.x < min.x) ? bbox.box.min.x : min.x;
				min.y = (bbox.box.min.y < min.y) ? bbox.box.min.y : min.y;
				min.z = (bbox.box.min.z < min.z) ? bbox.box.min.z : min.z;
			}
		}.bind(this));

		var meshY = Math.abs(max.y - min.y);
		meshX = Math.abs(max.x - min.x);
		meshZ = Math.abs(max.z - min.z);
		scaleFactor = 10/Math.max(meshX, meshY);

		group.scale.set(scaleFactor, scaleFactor, scaleFactor);

		// group.position.x = meshX/2;
		group.position.y = meshY/2*scaleFactor - 3;
		// group.position.z = meshZ/2;

	}

	var backLightHelper = new THREE.SpotLightHelper( backlight );
	scene.add( backLightHelper );

// GRID HELPER
	var size = 500;
	var step = 20;

	var gridHelper = new THREE.GridHelper( size, step );
	gridHelper.setColors( 0xaaaaaa, 0xe0e0e0 );
	gridHelper.position.y = 0.2;
	scene.add( gridHelper );

// GROUND
	var geometry = new THREE.PlaneBufferGeometry( 10, 10 );
	var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xe9e9e9 } );
	var ground = new THREE.Mesh( geometry, planeMaterial );

	ground.position.set( 0, 0, 0 );
	ground.rotation.x = - Math.PI / 2;
	ground.scale.set( 50, 50, 50 );
	ground.castShadow = false;
	ground.receiveShadow = true;

	scene.add( ground );

	// RENDER LOOP
	var render = function () {
		requestAnimationFrame( render );
		controls.update();
		renderer.render(scene, camera);
	};

	var loader = new THREE.OBJLoader();
	// load a resource
	loader.load(
		// resource URL
		url,
		// Function when resource is loaded
		function ( object ) {
			loadedObj = object;
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {

					child.geometry.computeBoundingBox();
					child.geometry.center();

					child.rotation.x = -Math.PI / 2;
				}
			} );

			scene.add( object );
			object.scale.set(0.4, 0.4, 0.4);

			render();
		}
	);

	$(elemId).append(renderer.domElement);
}

