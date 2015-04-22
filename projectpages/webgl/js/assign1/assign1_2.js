
			var ambientLight, scene, controls, renderer, camera, light;
			init();
			render();
			makeStairs(750, 50, 15);
			
			function init()
			{
				scene = new THREE.Scene();
				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 40000 );
				camera.position.set(-300, 500, -2600);
				camera.position.z = 3500;
				scene.add(camera);
				
				ambientLight = new THREE.AmbientLight( 0x222222 );
			
				light = new THREE.DirectionalLight( 0xffffff, 1.0 );
				light.position.set( 200, 400, 500 );
				
				scene.add(ambientLight);
				scene.add(light);
				
				// Added mouse controls to make it easier to see what is going on
				controls = new THREE.OrbitControls(camera, renderer.domElement);
			}
			
			// Take the three parameters and make the 5 steps
			function makeStairs(stepWidth, stepHeight, stepThickness)
			{
			
				var stepMaterialVertical = new THREE.MeshBasicMaterial( 
				{ 
					color: 0xA85F35 
				});
				var stepMaterialHorizontal = new THREE.MeshBasicMaterial( 
				{ 
					color: 0xBC7349 
				});
				// loop to get each part of the 5 steps
				for(var i = 0; i <5; i++)
				{
					// height from top of one step to bottom of next step up
					var verticalStepHeight = stepHeight;
					var horizontalStepDepth = stepHeight*2;
					var stepHalfThickness = stepThickness/2;
					var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
					var stepHorizontal = new THREE.CubeGeometry(stepWidth, stepThickness, horizontalStepDepth);
					var stepMesh;

					// vertical part of the step
					stepMesh = new THREE.Mesh(stepVertical, stepMaterialVertical);
					stepMesh.position.x = 0;			
					stepMesh.position.y = verticalStepHeight/2 + verticalStepHeight * i;	
					stepMesh.position.z = i * horizontalStepDepth;			
					scene.add(stepMesh);

					// horizontal part
					stepMesh = new THREE.Mesh(stepHorizontal, stepMaterialHorizontal);
					stepMesh.position.x = 0;
					stepMesh.position.y = stepThickness/2 + verticalStepHeight * (i+1);
					stepMesh.position.z = horizontalStepDepth/2 - stepHalfThickness + horizontalStepDepth * i;
					scene.add(stepMesh);
				}
			}
			
			function render() 
			{
				requestAnimationFrame(render);
				renderer.render(scene, camera);	
				controls.update();	
			}



