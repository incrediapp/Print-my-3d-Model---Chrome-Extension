var getNewViewer = function() {
	// SCENE BASIC SETUP
	var loadedObj;
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xb5b5b5, 500, 3000 );

	var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.soft = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

// CAMERA & CONTROLS
	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45;
	var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
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
	ground.scale.set( 100, 100, 100 );
	ground.castShadow = false;
	ground.receiveShadow = true;

	scene.add( ground );

//document.addEventListener('keydown',onDocumentKeyDown,false);
//function onDocumentKeyDown(event){
//	if (!loadedObj) {
//		return;
//	}
//
//	event = event || window.event;
//	var keycode = event.keyCode;
//	var moveDelta = 20;
//	var scaleDelta = 0.05;
//	switch(keycode) {
//		case 37 : //left arrow
//			loadedObj.position.x = loadedObj.position.x - moveDelta;
//			break;
//		case 38 : // up arrow
//			loadedObj.position.z = loadedObj.position.z - moveDelta;
//			break;
//		case 39 : // right arrow
//			loadedObj.position.x = loadedObj.position.x + moveDelta;
//			break;
//		case 40 : //down arrow
//			loadedObj.position.z = loadedObj.position.z + moveDelta;
//			break;
//		case 67: // 'c'
//			loadedObj.position.x = 0;
//			loadedObj.position.y = 0;
//			loadedObj.position.z = 0;
//			break;
//		case 107: // +
//		case 187: // +
//			scaleObj(scaleDelta);
//			break;
//		case 109: // -
//		case 189: // -
//			scaleObj(-scaleDelta);
//			break;
//	}
//}


	var addViewerToDom = function (elemId) {
		// APPEND RENDERER
		$('.' + elemId).append(renderer.domElement);
	}

	var createAndAddMesh = function(geometry, material) {
		var mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		//scene.add( mesh );
		return mesh;
	}

	var loadObjFromUrl = function (url) {
		var loader = new THREE.OBJLoader();
		// load a resource
		loader.load(
			// resource URL
			url,
			// Function when resource is loaded
			function ( object ) {
				loadedObj = object;
				//object.traverse( function ( child ) {
				//	if ( child instanceof THREE.Mesh ) {
				//		child.material = cubeMaterial;
				//	}
				//} );
				scene.add( object );
				render();
			}
		);
	}

	var scaleObj = function (scaleAddition) {
		if (loadedObj) {
			loadedObj.scale.x += scaleAddition;
			loadedObj.scale.y += scaleAddition;
			loadedObj.scale.z += scaleAddition;
		}
	}

//var helper = 0;
//var inverseFlag = true;
//var moveDelta = 0.66666;
// RENDER LOOP
	var render = function () {
		requestAnimationFrame( render );
		controls.update();
		renderer.render(scene, camera);
	};

	return this;
}

