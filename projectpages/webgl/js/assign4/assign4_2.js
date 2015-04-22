var scene, camera, renderer, control;
var i = 0;

init();
render();

// Shader values for displacement map + paths
var shader = THREE.ShaderLib["normalmap"];
var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
// which mappings are allowed
uniforms["enableDiffuse"].value = false;
uniforms["enableSpecular"].value = false;
uniforms["enableReflection"].value = true;
uniforms["enableDisplacement"].value = true;
// paths
uniforms["tNormal"].value = THREE.ImageUtils.loadTexture("../js/assign4/img/nrm.jpg");
uniforms["tDisplacement"].value = THREE.ImageUtils.loadTexture("../js/assign4/img/disp.jpg");
// Found these to be common coefficients
uniforms["uDisplacementBias"].value = - 0.4;
uniforms["uDisplacementScale"].value = 2.5;
uniforms["uNormalScale"].value.y = -1;
uniforms["diffuse"].value.setHex(0x331100);
uniforms["specular"].value.setHex(0xffffff);
uniforms["ambient"].value.setHex(0x050505);
uniforms["shininess"].value = 10;
uniforms["reflectivity"].value = 0.1;

// Normal mapping
var sphereMat1 = new THREE.MeshPhongMaterial({
	normalMap: uniforms["tNormal"].value
});
// Displacement mapping
var sphereMat2 = new THREE.ShaderMaterial({
	fragmentShader: shader.fragmentShader, 
	vertexShader: shader.vertexShader, 
	uniforms: uniforms,
	lights: true
});
// the geometry
var sphereGeo = new THREE.SphereGeometry(20, 64, 64);
sphereGeo.computeTangents();
var sphere = new THREE.Mesh(sphereGeo, sphereMat1);
scene.add(sphere);

function init()
{
	// Setup of scene, camera, lighting
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	camera.position.z = 100;
	camera.position.y = 100;
	scene.add(camera);

	control = new THREE.OrbitControls(camera, renderer.domElement);

	var light = new THREE.DirectionalLight(0x404040, .5);
	
	scene.add(light);
	
	// make it easier to see the differences
	var planeGeo = new THREE.PlaneGeometry(1000,1000);
	var planeMat = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
	var plane = new THREE.Mesh(planeGeo, planeMat);
	plane.position.z = -50;
	scene.add(plane);

	document.addEventListener("keydown", docKeyDown, "false");
}

function render()
{
	control.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}


// 'd' toggles between the mappings
function docKeyDown(key)
{
	if(key.keyCode == 68 && (i % 2) == 0)
	{
		var sphereGeo = new THREE.SphereGeometry(20, 64, 64);
		sphereGeo.computeTangents();
		var sphere = new THREE.Mesh(sphereGeo, sphereMat1);
		scene.add(sphere);
		render();
		i++;
	}
	if(key.keyCode == 68 && (i % 2) == 1)
	{
		var sphereGeo = new THREE.SphereGeometry(20, 64, 64);
		sphereGeo.computeTangents();
		var sphere = new THREE.Mesh(sphereGeo, sphereMat2);
		scene.add(sphere);
		render();
		i++;
	}
}
