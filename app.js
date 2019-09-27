var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 600 / 600, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( 600, 600 );
document.body.appendChild( renderer.domElement );

const loader = new THREE.TextureLoader();

var face = new THREE.Group();

var pyraGeo = new THREE.ConeGeometry( 30, 50, 4 );
var pyraMaterial = new THREE.MeshBasicMaterial({map: loader.load('a/texture.jpg'),});
var pyramid = new THREE.Mesh( pyraGeo, pyraMaterial );

var irisGeo = new THREE.CircleGeometry(5, 32);
var irisMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFF00} );
var iris = new THREE.Mesh(irisGeo, irisMaterial);
//scene.add( pyramid );

//face.add(pyramid);
face.add(iris);

scene.add(face);

camera.position.z = 100;

var light = new THREE.PointLight(0xFFFF00);
light.position.set(10, 0, 25);
scene.add(light);

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

  pyramid.rotation.y += 0.01; // uppfaerir rotation a y-as
}

animate();
