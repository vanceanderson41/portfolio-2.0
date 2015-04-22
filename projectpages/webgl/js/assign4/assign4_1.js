var scene, camera, renderer, camera, control, skybox, path, sides;

init();
render();
var reflect = makeFlowerReflect(12,12);
reflect.position.x = -50;
var refract = makeFlowerRefract(12,12);
var transparent = makeFlowerTransparent(12,12);
transparent.position.x = 50;
scene.add(reflect);
scene.add(refract);
scene.add(transparent);


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

	
	path = "../js/assign4/skybox/";
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

	var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
	dirLight.position.set(.5,1,0);
	scene.add(dirLight);
}

function makeFlowerReflect(size, number) 
{
	// Center geometry
	var centerGeo = new THREE.SphereGeometry(size/2, 32, 32);
	var matrix = new THREE.Matrix4();
	matrix.makeScale(1,.25,1);
	centerGeo.applyMatrix(matrix);
	
	// Center Material
	var centerMat = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: skybox } );
	var center = new THREE.Mesh(centerGeo, centerMat);
	//scene.add(center);
	
	// vars needed for the petals
	var sMatrix = new THREE.Matrix4();
	var tMatrix = new THREE.Matrix4();
	sMatrix.makeScale(1,.25,.5);
	tMatrix.makeTranslation(size,0,0);
	var rMatrix = new THREE.Matrix4();
	var finalMatrix = new THREE.Matrix4();
	
	for(var i=0; i < number; i++)
	{
		var petalGeo = new THREE.SphereGeometry(size/2, 32, 32);
		rMatrix.makeRotationY(2*Math.PI/(number) * i);
		
		// The matrix multiplications had to occur in this way
		// otherwise things did not dispay as expected
		finalMatrix.multiplyMatrices(rMatrix, sMatrix);
		finalMatrix.multiply(tMatrix);
		
		// Apply the final, transformed matrix
		petalGeo.applyMatrix(finalMatrix);
		
		var petalMat = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: skybox } );
		var petal = new THREE.Mesh(petalGeo, petalMat);
		center.add(petal);
	}
	return center;
}

function makeFlowerRefract(size, number) 
{
	// Center geometry
	var centerGeo = new THREE.SphereGeometry(size/2, 32, 32);
	var matrix = new THREE.Matrix4();
	matrix.makeScale(1,.25,1);
	centerGeo.applyMatrix(matrix);
	
	// Center Material
	var refractElem = THREE.ImageUtils.loadTextureCube(
                         sides, new THREE.CubeRefractionMapping() );
	var centerMat = new THREE.MeshBasicMaterial( { 
        color: 0xffffff,
        envMap: refractElem,
        refractionRatio: .6
    } );
	var center = new THREE.Mesh(centerGeo, centerMat);
	//scene.add(center);
	
	// vars needed for the petals
	var sMatrix = new THREE.Matrix4();
	var tMatrix = new THREE.Matrix4();
	sMatrix.makeScale(1,.25,.5);
	tMatrix.makeTranslation(size,0,0);
	var rMatrix = new THREE.Matrix4();
	var finalMatrix = new THREE.Matrix4();
	
	for(var i=0; i < number; i++)
	{
		var petalGeo = new THREE.SphereGeometry(size/2, 32, 32);
		rMatrix.makeRotationY(2*Math.PI/(number) * i);
		
		// The matrix multiplications had to occur in this way
		// otherwise things did not dispay as expected
		finalMatrix.multiplyMatrices(rMatrix, sMatrix);
		finalMatrix.multiply(tMatrix);
		
		// Apply the final, transformed matrix
		petalGeo.applyMatrix(finalMatrix);
		
		var petalMat = new THREE.MeshBasicMaterial( { 
	        color: 0xffffff,
	        envMap: refractElem,
	        refractionRatio: .4
    } 	);
		var petal = new THREE.Mesh(petalGeo, petalMat);
		center.add(petal);
	}
	return center;
}

function makeFlowerTransparent(size, number) 
{
	// Center geometry
	var centerGeo = new THREE.SphereGeometry(size/2, 32, 32);
	var matrix = new THREE.Matrix4();
	matrix.makeScale(1,.25,1);
	centerGeo.applyMatrix(matrix);
	
	// Center Material
	var centerMat = new THREE.MeshLambertMaterial({color: 0xffff00, transparent: true, opacity: 0.5});
	var center = new THREE.Mesh(centerGeo, centerMat);
	//scene.add(center);
	
	// vars needed for the petals
	var sMatrix = new THREE.Matrix4();
	var tMatrix = new THREE.Matrix4();
	sMatrix.makeScale(1,.25,.5);
	tMatrix.makeTranslation(size,0,0);
	var rMatrix = new THREE.Matrix4();
	var finalMatrix = new THREE.Matrix4();
	
	for(var i=0; i < number; i++)
	{
		var petalGeo = new THREE.SphereGeometry(size/2, 32, 32);
		rMatrix.makeRotationY(2*Math.PI/(number) * i);
		
		// The matrix multiplications had to occur in this way
		// otherwise things did not dispay as expected
		finalMatrix.multiplyMatrices(rMatrix, sMatrix);
		finalMatrix.multiply(tMatrix);
		
		// Apply the final, transformed matrix
		petalGeo.applyMatrix(finalMatrix);
		
		var petalMat = new THREE.MeshLambertMaterial({color: 0xffff00, transparent: true, opacity: 0.5});
		var petal = new THREE.Mesh(petalGeo, petalMat);
		center.add(petal);
	}
	return center;
}

function render()
{
	control.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

