
			var scene, camera, renderer, light, control, sphere, material, geometry;
			init();
			makeSphere();
			render();
			function init()
			{
				scene = new THREE.Scene();
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

				renderer = new THREE.WebGLRenderer();
				renderer.setSize(window.innerWidth, window.innerHeight);
				document.body.appendChild(renderer.domElement);
				light = new THREE.DirectionalLight(0xffff, 0.5);
				light.position.set(50, 250, 0);
				camera.position.z = 250;
				scene.add(camera);
				scene.add(light);
				
				//used for testing, removed for submission: assignment pae says camera is fixed
				//control = new THREE.OrbitControls(camera, renderer.domElement);
				
				document.addEventListener("keydown", docKeyDown, "false");
			}
			
			
			
			function makeSphere() 
			{
				
				material = new THREE.MeshLambertMaterial( { color: 0x80FC66, shading: THREE.SmoothShading } ); // smooth by default
				geometry = new THREE.SphereGeometry(50, 50, 50, 0, Math.PI*2, 0, Math.PI);
				sphere = new THREE.Mesh(geometry, material);

				scene.add(sphere);
			}
			
			function render()
			{
				requestAnimationFrame(render);
				renderer.render(scene, camera);
			}
			
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
						//sphere.shading = THREE.FlatShading;
						break;
					case 39: //right
						sphere.position.x += 1;
						//sphere.shading = THREE.SmoothShading;
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
						
					// For the differences in shading, I messed around with doing it both ways
					// 1) change current shading and update
					// 2) remove the sphere and recreate. This also resets its position since it was removed
					case 83: //s = FlatShading
						sphere.material.shading = THREE.FlatShading;
						// FOUND this from threeJS github, shading is baked in from mesh creation
						// Must change flag 
						sphere.geometry.normalsNeedUpdate = true;
						break;
					case 81: //q = SmoothShading
						scene.remove(sphere);
						material = new THREE.MeshLambertMaterial( { color: 0x80FC66, shading: THREE.SmoothShading } );
						geometry.normalsNeedUpdate = true;
						sphere = new THREE.Mesh(geometry, material);
						scene.add(sphere);
						break;
					
					case 66: // FOR PART III = press b
					// I didn't know how to test if this was working correctly, but I followed the algorithm described
					// in the assignment page and from what is written, it seems to me that adding color attributes to
					// the vertices is what we are after in baking.
						// Provided methods
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
				}
			}
			
			
