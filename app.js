var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 600 / 600, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type	= THREE.PCFSoftShadowMap;
renderer.setSize( 600, 600 );
document.body.appendChild( renderer.domElement );

var active = false;

renderer.domElement.addEventListener("mousemove", onmousemove, false);
renderer.domElement.addEventListener('mouseout', function() {
	active = false;
});
renderer.domElement.addEventListener('mouseleave', function() {
	active = false;
});

const loader = new THREE.TextureLoader();
loader.crossOrigin = true;

// golf
var pGeo = new THREE.PlaneGeometry(300, 300);
var pMaterial = new THREE.MeshPhongMaterial( {color: 0xee7621, side: 2} );
var plane = new THREE.Mesh( pGeo, pMaterial );

plane.receiveShadow = true;
plane.rotation.x = -1.55;
plane.position.y = -24;

var face = new THREE.Group();

function onmousemove(event) {
  mouse = (event.clientX / window.innerWidth) * 2 - 1;

	face.rotation.y = (mouse - (face.position.x + 0.78));
	active = true;
}

var pyraGeo = new THREE.ConeGeometry( 30, 50, 4 );
loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/4268-bump.jpg', function(texture) {
	var pyraMaterial = new THREE.MeshPhongMaterial( {color: 0xFFFF00, bumpMap: texture} );
	var pyramid = new THREE.Mesh( pyraGeo, pyraMaterial );
	face.add(pyramid);
	pyramid.castShadow = true;
	pyramid.receiveShadow = false;
	pyramid.rotation.y = 0.78;
})

// framan
var fIrisGeo = new THREE.CircleGeometry(4, 32);
var fIrisMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
var fIris = new THREE.Mesh(fIrisGeo, fIrisMaterial);

fIris.position.z = 13.1;
fIris.position.y = -5;
fIris.rotation.x = -0.35;

var xi = 0, yi = 0;

var fEyeShape = new THREE.Shape();
fEyeShape.moveTo( xi - 10, yi);
fEyeShape.quadraticCurveTo(xi, yi + 10, xi + 10, yi);
fEyeShape.quadraticCurveTo(xi, yi - 10, xi - 10, yi);

var fShapeGeo = new THREE.ShapeGeometry(fEyeShape);
var fShapeMaterial = new THREE.MeshLambertMaterial( {color: 0xEE7621, opacity: 0.7, transparent: true} );
var fShape = new THREE.Mesh(fShapeGeo, fShapeMaterial);

fShape.position.z = 13;
fShape.position.y = -5;
fShape.rotation.x = -0.35;

// haegri
var hIrisGeo = new THREE.CircleGeometry(4, 32);
var hIrisMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
var hIris = new THREE.Mesh(hIrisGeo, hIrisMaterial);

hIris.position.x = 13.1;
hIris.position.y = -5;

hIris.rotation.x = -1.5;
hIris.rotation.y = 1.2;
hIris.rotation.z = 1.5;

var xi = 0, yi = 0;

var hEyeShape = new THREE.Shape();
hEyeShape.moveTo( xi - 10, yi);
hEyeShape.quadraticCurveTo(xi, yi + 10, xi + 10, yi);
hEyeShape.quadraticCurveTo(xi, yi - 10, xi - 10, yi);

var hShapeGeo = new THREE.ShapeGeometry(hEyeShape);
var hShapeMaterial = new THREE.MeshLambertMaterial( {color: 0xEE7621, opacity: 0.7, transparent: true} );
var hShape = new THREE.Mesh(hShapeGeo, hShapeMaterial);

hShape.position.x = 13;
hShape.position.y = -5;

hShape.rotation.x = -1.5;
hShape.rotation.y = 1.2;
hShape.rotation.z = 1.5;

// bak
var bIrisGeo = new THREE.CircleGeometry(4, 32);
var bIrisMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: 1} );
var bIris = new THREE.Mesh(bIrisGeo, bIrisMaterial);

bIris.position.z = -13.1;
bIris.position.y = -5;

bIris.rotation.x = 0.35;

var xi = 0, yi = 0;

var bEyeShape = new THREE.Shape();
bEyeShape.moveTo( xi - 10, yi);
bEyeShape.quadraticCurveTo(xi, yi + 10, xi + 10, yi);
bEyeShape.quadraticCurveTo(xi, yi - 10, xi - 10, yi);

var bShapeGeo = new THREE.ShapeGeometry(bEyeShape);
var bShapeMaterial = new THREE.MeshLambertMaterial( {color: 0xEE7621, opacity: 0.7, transparent: true, side: 1} );
var bShape = new THREE.Mesh(bShapeGeo, bShapeMaterial);

bShape.position.z = -13;
bShape.position.y = -5;
bShape.rotation.x = 0.35;

// haegri
var vIrisGeo = new THREE.CircleGeometry(4, 32);
var vIrisMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: 1} );
var vIris = new THREE.Mesh(vIrisGeo, vIrisMaterial);

vIris.position.x = -13.1;
vIris.position.y = -5;

vIris.rotation.x = 1.5;
vIris.rotation.y = 1.2;
vIris.rotation.z = -1.5;

var xi = 0, yi = 0;

var vEyeShape = new THREE.Shape();
vEyeShape.moveTo( xi - 10, yi);
vEyeShape.quadraticCurveTo(xi, yi + 10, xi + 10, yi);
vEyeShape.quadraticCurveTo(xi, yi - 10, xi - 10, yi);

var vShapeGeo = new THREE.ShapeGeometry(vEyeShape);
var vShapeMaterial = new THREE.MeshLambertMaterial( {color: 0xEE7621, opacity: 0.7, transparent: true, side: 2} );
var vShape = new THREE.Mesh(vShapeGeo, vShapeMaterial);

vShape.position.x = -13;
vShape.position.y = -5;

vShape.rotation.x = 1.5;
vShape.rotation.y = 1.2;
vShape.rotation.z = -1.5;

// setja i face obejct
//face.add(pyramid);
// framan
face.add(fIris);
face.add(fShape);
// haegri
face.add(hIris);
face.add(hShape);
// bak
face.add(bIris);
face.add(bShape);
// vinstri
face.add(vIris);
face.add(vShape);
// baeta face og plane i scene
scene.add(face);
scene.add(plane);


// camera setup
// framan
camera.position.z = 100;

// framan og haegri
//camera.position.z = 60;
//camera.position.x = 60;
//camera.rotation.y = 0.8;

// haegri
//camera.rotation.y = 1.56;
//camera.position.x = 100;
//camera.position.z = 0;

// haegri og bak
//camera.position.x = 60;
//camera.position.z = -60;
//camera.rotation.y = 2.35;

// framan og vinstri
//camera.position.z = 60;
//camera.position.x = -60;
//camera.rotation.y = -0.8;

var light = new THREE.PointLight(0xFFFFFF, 2, 100);
light.position.set(-5, 35, -15);
light.rotation.y = 1.5;
light.castShadow = true;
scene.add(light);
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;

//var helper = new THREE.CameraHelper( light.shadow.camera );
//scene.add( helper );

function animate() {

	requestAnimationFrame( animate );
	renderer.render( scene, camera );

	if (active === false) {
		face.rotation.y += 0.01;
	}
}

animate();
