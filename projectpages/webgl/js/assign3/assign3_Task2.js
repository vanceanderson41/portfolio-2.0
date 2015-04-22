
var scene, camera, renderer, light, control, clock, time, change;
var bulb0, bulb1, bulb2, bulb3, bulb4, bulb5, bulb6, bulb7;
var sphere, sl0, sl1, sl2, sl3, sl4, sl5, sl6, sl7;

// vars for viewports
var views = [
{ 
	left: 0.5,
	bottom: 0,
	width: 0.5,
	height: 0.5,
	eye: [0, 230, 0],
	up: [ 0, 1, 0 ],
	fov: 45
},
{
	left: 0,
	bottom: 0,
	width: 0.5,
	height: 0.5,
	eye: [2, 0, -225],
	up: [ 0, 1, 0 ],
	fov: 45
},
{
	left: 0,
	bottom: .5,
	width: 1,
	height: 0.5,
	eye: [200, 200, 200],
	up: [ 0, 1, 0 ],
	fov: 45
}
];

init();
addFlowers();
makeDisco();
render();

function init()
{
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	renderer.shadowMapEnabled = true;
	
	for (var ii =  0; ii < views.length; ++ii ) {

		var view = views[ii];
		camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, .1, 10000 );
		camera.position.x = view.eye[ 0 ];
		camera.position.y = view.eye[ 1 ];
		camera.position.z = view.eye[ 2 ];
		camera.lookAt(new THREE.Vector3(0,0,0));
		view.camera = camera;
		
		// controls for top viewport
		if(ii == 2)
		{
			control = new THREE.OrbitControls(views[ii].camera, renderer.domElement);
		}
	}
	
	// Setup of scene, camera, lighting
	scene = new THREE.Scene();
	
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

	// The Plane
	var geometry = new THREE.PlaneGeometry( 200, 200 );
	var mat = new THREE.Matrix4();
	mat.makeRotationX(Math.PI/2);

	geometry.applyMatrix(mat);
	mat.makeTranslation(0,-30,0);
	geometry.applyMatrix(mat);

	var material = new THREE.MeshPhongMaterial({color: 0x8b4513, side: THREE.DoubleSide});
	var plane = new THREE.Mesh(geometry, material);
	plane.receiveShadow = true;
	scene.add(plane);	
	
	// clock for rotation
	clock = new THREE.Clock();
	var l = new THREE.DirectionalLight(0xffffff, 0.25);
	l.position.set(0,1,0);
	l.castShadow = false;
	scene.add(l);
	
}



function makeFlower(size, number, color1, color2) 
{
	// Center geometry
	var centerGeo = new THREE.SphereGeometry(size/2, 32, 32);
	var matrix = new THREE.Matrix4();
	matrix.makeScale(1,.25,1);
	centerGeo.applyMatrix(matrix);
	
	// Center Material
	var centerMat = new THREE.MeshLambertMaterial({shading: THREE.SmoothShading});
	centerMat.color.set(color1);
	var center = new THREE.Mesh(centerGeo, centerMat);
	center.castShadow = true;
	
	// vars needed for the petals
	var sMatrix = new THREE.Matrix4();
	var tMatrix = new THREE.Matrix4();
	sMatrix.makeScale(1,.25,.5);
	tMatrix.makeTranslation(size, 0, 0);
	var rMatrix = new THREE.Matrix4();
	
	for(var i=0; i < number; i++)
	{
		var petalGeo = new THREE.SphereGeometry(size/2, 20, 20);
		var ggMat = new THREE.Matrix4();
	
		rMatrix.makeRotationY(2*Math.PI/(number) * i);
		
		petalGeo.applyMatrix(sMatrix);
		petalGeo.applyMatrix(tMatrix);
		petalGeo.applyMatrix(rMatrix);
		
		petalGeo.castShadow = true;
		
		
		var petalMat = new THREE.MeshLambertMaterial({shading: THREE.SmoothShading});
		petalMat.color.set(color2);
		var petal = new THREE.Mesh(petalGeo, petalMat);
		petal.castShadow = true;
		petal.receiveShadow = true;
		center.add(petal);
	}
	
	// stems
	var stemGeo = new THREE.CylinderGeometry(.5,1,30,32);
	tMatrix.makeTranslation(0,-15,0);
	stemGeo.applyMatrix(tMatrix);
	var stemMat = new THREE.MeshLambertMaterial({color: 0x00FF00, shading: THREE.SmoothShading});
	var stem = new THREE.Mesh(stemGeo, stemMat);
	stem.castShadow = true;
	center.add(stem);
	
	return center;
}

function render()
{
	// this is what makes the lights point at the bulbs 
	// while the sphere rotates
	var vector = new THREE.Vector3();
	vector.setFromMatrixPosition( bulb0.matrixWorld );
	sl0.target.position.set(vector.x, vector.y, vector.z);
	
	vector.setFromMatrixPosition( bulb1.matrixWorld );
	sl1.target.position.set(vector.x, vector.y, vector.z);
	
	vector.setFromMatrixPosition( bulb2.matrixWorld );
	sl2.target.position.set(vector.x, vector.y, vector.z);
	
	vector.setFromMatrixPosition( bulb3.matrixWorld );
	sl3.target.position.set(vector.x, vector.y, vector.z);
	
	vector.setFromMatrixPosition( bulb4.matrixWorld );
	sl4.target.position.set(vector.x, vector.y, vector.z);
	
	vector.setFromMatrixPosition( bulb5.matrixWorld );
	sl5.target.position.set(vector.x, vector.y, vector.z);
	
	vector.setFromMatrixPosition( bulb6.matrixWorld );
	sl6.target.position.set(vector.x, vector.y, vector.z);
	
	vector.setFromMatrixPosition( bulb7.matrixWorld );
	sl7.target.position.set(vector.x, vector.y, vector.z);
	
	
	for ( var ii = 0; ii < views.length; ++ii ) 
	{
		view = views[ii];
		camera = view.camera;

		// This is how mrdoob did it in the examples
		var left   = Math.floor( window.innerWidth  * view.left );
		var bottom = Math.floor( window.innerHeight * view.bottom );
		var width  = Math.floor( window.innerWidth  * view.width );
		var height = Math.floor( window.innerHeight * view.height );
		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest ( true );
		renderer.setClearColor( view.background );

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.render( scene, camera );
	}
	
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	changed = clock.getDelta();
	debug(changed);
	// The rotation
	sphere.rotation.y += (changed * Math.PI / 180)*12;
	
	
}

function addFlowers()
{
	var i = 0;
	for(i; i < 10; i++)
	{
		// get random num petals
		var petals = Math.floor((Math.random()*16)+6);
		var size = Math.floor((Math.random()*18)+10);
		
		var color1 = randColor();
		var color2 = randColor();

		var ob = makeFlower(size, petals, color1, color2);
		ob.position.x = randInt(-100,100);
		
		ob.position.z = randInt(-100,100);
		ob.traverse( function ( object ) {
			if ( object instanceof THREE.Mesh ) {
				object.castShadow = true;
				object.receiveShadow = true;
			}
		} );
		scene.add(ob);
	} 
}

function makeDisco()
{
	var sphereGeo = new THREE.SphereGeometry(6, 32, 32);
	var c = randColor();
	var sphereMat = new THREE.MeshPhongMaterial({color: 0x996633, 
		ambient: 0x996633, 
		specular: 0x050505,
		shininess: 100});
	var falloff = 25;
		
	sphere = new THREE.Mesh(sphereGeo, sphereMat);

	//bulb0
	sphereGeo = new THREE.SphereGeometry(1, 32, 32);
	c = randColor();

	sphereMat = new THREE.MeshLambertMaterial({color: c, shading: THREE.SmoothShading});
	bulb0 = new THREE.Mesh(sphereGeo, sphereMat);
	bulb0.position.set(-5.2, -2.5, 0);
	sphere.add(bulb0);

	sl0 = new THREE.SpotLight(c);
	sl0.castShadow = true;
	sl0.angle =  falloff* Math.PI / 180;
	sl0.position.y = 6;
	sphere.add(sl0);

	//bulb1
	sphereGeo = new THREE.SphereGeometry(1, 32, 32);
	c = randColor();
	sphereMat = new THREE.MeshLambertMaterial({color: c, shading: THREE.SmoothShading});
	bulb1 = new THREE.Mesh(sphereGeo, sphereMat);
	bulb1.position.set(5.2, -2.5, 0);
	sphere.add(bulb1);

	sl1 = new THREE.SpotLight(c);
	sl1.castShadow = true;
	sl1.angle = falloff * Math.PI / 180;
	sl1.position.y = 6;
	sphere.add(sl1);

	//bulb2
	sphereGeo = new THREE.SphereGeometry(1, 32, 32);
	c = randColor();
	sphereMat = new THREE.MeshLambertMaterial({color: c, shading: THREE.SmoothShading});
	bulb2 = new THREE.Mesh(sphereGeo, sphereMat);
	bulb2.position.set(0, -2.5, 5.2);
	sphere.add(bulb2);

	sl2 = new THREE.SpotLight(c);
	sl2.castShadow = true;
	sl2.angle = falloff * Math.PI / 180;
	sl2.position.y = 6;
	sphere.add(sl2);

	//bulb3
	sphereGeo = new THREE.SphereGeometry(1, 32, 32);
	c = randColor();
	sphereMat = new THREE.MeshLambertMaterial({color: c, shading: THREE.SmoothShading});
	bulb3 = new THREE.Mesh(sphereGeo, sphereMat);
	bulb3.position.set(0, -2.5, -5.2);
	sphere.add(bulb3);

	sl3 = new THREE.SpotLight(c);
	sl3.castShadow = true;
	sl3.angle = falloff * Math.PI / 180;
	sl3.position.y = 6;
	sphere.add(sl3);


	//bulb4
	sphereGeo = new THREE.SphereGeometry(1, 32, 32);
	c = randColor();
	sphereMat = new THREE.MeshLambertMaterial({color: c, shading: THREE.SmoothShading});
	bulb4 = new THREE.Mesh(sphereGeo, sphereMat);
	bulb4.position.set(-3.2, -4.95, -3.8);
	sphere.add(bulb4);


	sl4 = new THREE.SpotLight(c);
	sl4.castShadow = true;
	sl4.angle = falloff * Math.PI / 180;
	sl4.position.y = 6;
	sphere.add(sl4);

	//bulb5
	sphereGeo = new THREE.SphereGeometry(1, 32, 32);
	c = randColor();
	sphereMat = new THREE.MeshLambertMaterial({color: c, shading: THREE.SmoothShading});
	bulb5 = new THREE.Mesh(sphereGeo, sphereMat);
	bulb5.position.set(3.2, -4.95, -3.8);
	sphere.add(bulb5);

	sl5 = new THREE.SpotLight(c);
	sl5.castShadow = true;
	sl5.angle = falloff * Math.PI / 180;
	sl5.position.y = 6;
	sphere.add(sl5);

	//bulb6
	sphereGeo = new THREE.SphereGeometry(1, 32, 32);
	c = randColor();
	sphereMat = new THREE.MeshLambertMaterial({color: c, shading: THREE.SmoothShading});
	bulb6 = new THREE.Mesh(sphereGeo, sphereMat);
	bulb6.position.set(3.2, -4.95, 3.8);
	sphere.add(bulb6);

	sl6 = new THREE.SpotLight(c);
	sl6.castShadow = true;
	sl6.angle = falloff * Math.PI / 180;
	sl6.position.y = 6;
	sphere.add(sl6);

	//bulb7
	sphereGeo = new THREE.SphereGeometry(1, 32, 32);
	c = randColor();
	sphereMat = new THREE.MeshLambertMaterial({color: c, shading: THREE.SmoothShading});
	bulb7 = new THREE.Mesh(sphereGeo, sphereMat);
	bulb7.position.set(-3.2, -4.95, 3.8);
	sphere.add(bulb7);

	sl7 = new THREE.SpotLight(c);
	sl7.castShadow = true;
	sl7.angle = falloff * Math.PI / 180;
	sl7.position.y = 6;
	//sphere.add(sl7);
	
	sphere.position.y = 55;
	scene.add(sphere);
}

// some helpers
function randInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randColor()
{
	var n = Math.random()*16777215;
	theColor = new THREE.Color(n);
	hex = theColor.getHex();
	return hex;
}

function debug(msg)
{
	document.getElementById('debug').value=msg
}