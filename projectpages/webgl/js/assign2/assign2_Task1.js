
var scene, camera, renderer, light, control, sphere, material, geometry;
init();
makeSphere();
render();
function init()
{
	//Scene setup, camera, renderer, lights, etc.
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	light = new THREE.DirectionalLight(0xffff, 1);
	light.position.set(50, 250,50);
	camera.position.z = 250;
	scene.add(camera);
	scene.add(light);
	
	var ambLight = new THREE.AmbientLight(0x00000f, .03);
	ambLight.position.set(0,-100,0);

	scene.add(ambLight);
	control = new THREE.OrbitControls(camera, renderer.domElement);
	
	document.addEventListener("keydown", docKeyDown, "false");
	
	// Draw AXES
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

function makeSphere() 
{
	
	material = new THREE.MeshLambertMaterial( { color: 0x0000FF, shading: THREE.SmoothShading } ); // smooth by default
	geometry = new THREE.SphereGeometry(15, 50, 50, 0, Math.PI*2, 0, Math.PI);
	sphere = new THREE.Mesh(geometry, material);

	scene.add(sphere);
}

function render()
{
	control.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
// Key listeners
function docKeyDown(key)
{
	switch(key.keyCode)
	{
		case 38: // up
			sphere.position.z += 1;
			break;
		case 40: //down
			sphere.position.z -= 1;
			break;
		case 37: //left
			sphere.position.x -= 1;
			break;
		case 39: //right
			sphere.position.x += 1;
			break;
		case 187:
		case 107: // +,=,num+ = scale up
			//Used current scaling to increment by a little bit each time
			sphere.scale = new THREE.Vector3(sphere.scale.x + .1,sphere.scale.y + .1,sphere.scale.z + .1);
			break;
		case 189:
		case 10: // -,_,num- = scale down
			sphere.scale = new THREE.Vector3(sphere.scale.x - .1,sphere.scale.y - .1,sphere.scale.z - .1);
			
			break;
			
		case 83: //s = FlatShading
			sphere.material.shading = THREE.FlatShading;
			sphere.geometry.normalsNeedUpdate = true;
			break;
		case 81: //q = SmoothShading
			
			sphere.material.shading = THREE.SmoothShading;
			sphere.geometry.normalsNeedUpdate = true;
			break;
		
		case 66: // FOR PART III = press b STILL BROKEN FROM ASSIGN1
		
			sphere.geometry.computeFaceNormals();
			sphere.geometry.computeVertexNormals();
			
			// Compute and assign each vertex color
			for(var i in sphere.geometry.vertices) 
			{ 
				sphere.geometry.vertices.normals[i].normalize();
				sphere.geometry.vertices[i].setHSL(sphere.geometry.vertices.normals[i].x, 
					sphere.geometry.vertices.normals[i].y, sphere.geometry.vertices.normals[i].z);
			}
			// Force material to use vertex colors
			sphere.material.vertexColors = THREE.VertexColors;
			//change each flag
			sphere.geometry.colorsNeedUpdate = true;
			sphere.geometry.normalsNeedUpdate = true;
			break;

		case 88: // x clockwise
			var matrix = new THREE.Matrix4();
			matrix.autoUpdate  = false;
			var angle = -Math.PI/48;
			matrix.makeRotationX(angle);
			sphere.applyMatrix(matrix);
			sphere.verticesNeedUpdate = true;
			break;
		case 89: //y clockwise
			var matrix = new THREE.Matrix4();
			matrix.autoUpdate  = false;
			var angle = -Math.PI/48;
			matrix.makeRotationY(angle);
			sphere.applyMatrix(matrix);
			sphere.verticesNeedUpdate = true;
			break;
		case 90:  // z clockwise
			var matrix = new THREE.Matrix4();
			matrix.autoUpdate  = false;
			var angle = -Math.PI/48;
			matrix.makeRotationZ(angle);
			sphere.applyMatrix(matrix);
			sphere.verticesNeedUpdate = true;
			break;
		// Euler's angles. I could not get shift+char to work, so I made keys directly adjacent to x,y,z
		// what make the Euler rotations happen
		case 67: // c - SHOULD BE CAP X
			sphere.rotation.x += Math.PI/48;
			break;
		case 85: // u - SHOULD BE CAP Y
			sphere.rotation.y += Math.PI/48;
			break;
		case 16: // SHIFT - SHOULD BE CAP Z
			sphere.rotation.z += Math.PI/48;
				break;
	}
}
			
			
