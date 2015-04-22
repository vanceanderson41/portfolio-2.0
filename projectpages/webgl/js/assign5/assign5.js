var scene, camera, renderer, camera, control, skybox, path, sides;

init();
render();

var uniforms = {
    time: { type: "f", value: 0 },
    resolution: { type: "v2", value: new THREE.Vector2 },
};

var material = new THREE.ShaderMaterial({
	vertexShader: document.getElementById('vertexShader').textContent,
	fragmentShader: document.getElementById('fragmentShader').textContent
});
//material = new THREE.MeshLambertMaterial();
scene.add(new THREE.Mesh(new THREE.SphereGeometry(6,32,32), material));


function init()
{
	// Setup of scene, camera, lighting
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	//renderer.shadowMapEnabled = true;
	camera.position.z = 100;
	camera.position.y = 100;
	scene.add(camera);

	control = new THREE.OrbitControls(camera, renderer.domElement);

	
	/*path = "../js/assign4/skybox/";
	sides = [ path + "posx.jpg", 
				  path + "negx.jpg", 
				  path + "posy.jpg",
				  path + "negy.jpg",
				  path + "posz.jpg",
				  path + "negz.jpg" ];
	var textures = THREE.ImageUtils.loadTextureCube(sides);
	textures.format = THREE.RGBFormat;
	var shader = THREE.ShaderLib['cube'];
	
	shader.uniforms['tCube'].value = textures;   

	var material = new THREE.ShaderMaterial
	({
	    fragmentShader: shader.fragmentShader,
	    vertexShader: shader.vertexShader,
	    uniforms: shader.uniforms,
	    depthWrite: false,
	    side: THREE.BackSide
	});

	// build the skybox Mesh 
	skybox = new THREE.Mesh( new THREE.CubeGeometry(1000, 1000, 1000), material );
	// add it to the scene
	scene.add(skybox);
	*/

	var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
	dirLight.position.set(0,1,0);
	scene.add(dirLight);
}





function render()
{
	control.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
