
var scene, camera, renderer, light, control;
init();
makeFlower(9, 12);
render();
function init()
{
	// Setup of scene, camera, lighting
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(50, 250,50);
	camera.position.z = 100;
	scene.add(camera);
	scene.add(light);
	
	var ambLight = new THREE.AmbientLight(0x000000, .03);
	ambLight.position.set(0,-100,0);

	var light2 = new THREE.DirectionalLight(0xffffff, 1);
	light2.position.set(0,0,-12);
	scene.add(light2);
	
	scene.add(ambLight);
	control = new THREE.OrbitControls(camera, renderer.domElement);
	
	// DRAW AXES
	var axis, axisGeometry, axisMaterial, len;
	axisGeometry = new THREE.Geometry();
	axisMaterial = new THREE.LineBasicMaterial({color: 0xAA0000, lineWidth: 1});
	len = 100;
	axisGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-len,0,0)), new THREE.Vertex(new THREE.Vector3(len,0,0)));
	axis = new THREE.Line(axisGeometry, axisMaterial);
	scene.add(axis);
	
	axisGeometry = new THREE.Geometry();
	axisMaterial = new THREE.LineBasicMaterial({color: 0x00AA00, lineWidth: 1});
	axisGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0,-len,0)), new THREE.Vertex(new THREE.Vector3(0,len,0)));
	axis = new THREE.Line(axisGeometry, axisMaterial);
	scene.add(axis);
	
	axisGeometry = new THREE.Geometry();
	axisMaterial = new THREE.LineBasicMaterial({color: 0x0000AA, lineWidth: 1});
	axisGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0,0,-len)), new THREE.Vertex(new THREE.Vector3(0,0,len)));
	axis = new THREE.Line(axisGeometry, axisMaterial);
	scene.add(axis);
}



function makeFlower(size, number) 
{
	// Center geometry
	var centerGeo = new THREE.SphereGeometry(size/2, 32, 32);
	var matrix = new THREE.Matrix4();
	matrix.makeScale(1,.25,1);
	centerGeo.applyMatrix(matrix);
	
	// Center Material
	var centerMat = new THREE.MeshLambertMaterial({color: 0xFFFF00, shading: THREE.SmoothShading});
	var center = new THREE.Mesh(centerGeo, centerMat);
	scene.add(center);
	
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
		
		var petalMat = new THREE.MeshLambertMaterial({color: 0xFFFFFF, shading: THREE.SmoothShading});
		var petal = new THREE.Mesh(petalGeo, petalMat);
		scene.add(petal);
	}
}

function render()
{
	control.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}


			
	

			
			
