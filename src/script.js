import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { LoopOnce, SphereGeometry, TextureLoader } from 'three'
import CANNON, { Sphere } from 'cannon'
import $ from "./Jquery"



const about = "<p>Shawn Is a person</p>"
const contact = "<div><a href='mailto:shawnyudesign@gmail.com'>shawnyudesign@gmail.com</a></div>"
const portfolio = '<div><ul><li><a href="https://shawnwhy.github.io/Cosmotree/">Cosmo Tree</a></li> <li><a href="https://shawnwhy.github.io/CloudySky/">Sky Over Berlin</a></li><li><a href="https://shawnwhy.github.io/CandieEater/">Diary of a Candy Eater</a></div>'
const news = "<p>Under Construction</p>"
const textureLoader = new THREE.TextureLoader()


var audiobounce = new Audio('/glass.wav');

const playHitSound = (collision) =>
{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 10)
    {
        audiobounce.volume = Math.random()
        audiobounce.currentTime = 0
        audiobounce.play()
    }
}



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const portfolioButton=document.getElementsByClassName("portfolio");
const aboutButton = document.getElementsByClassName("about")
const  contactButton = document.getElementsByClassName("contact")
const  newsButton = document.getElementsByClassName("news")
const  fireButton = document.getElementsByClassName("fire")

$(fireButton).click(()=>{
    createMeteor(
        Math.random()*.5,
        {
            x: (Math.random() + 4) * 3,
            y: (Math.random()*6)-4,
            z: (Math.random() - 0.5) * 3
        }

    )
})

//raycaster
const raycaster = new THREE.Raycaster()

//cannon
console.log(CANNON)
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 30,
        restitution: 0.1
    }
)
const bubbleShape = new CANNON.Sphere(5.6)
const bubbleBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, -8.3, 0),
    shape: bubbleShape,
    material: defaultMaterial
})
world.addBody(bubbleBody)
// const fakeEarthMaterial = new THREE.MeshStandardMaterial({color:'pink'})
// const fakeEarthGeometry = new THREE.SphereGeometry(5.6,20,20)
// const fakeEarthMesh = new THREE.Mesh(fakeEarthGeometry, fakeEarthMaterial)
// fakeEarthMesh.position.copy(bubbleBody.position)
// scene.add(fakeEarthMesh)
    
//physics floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.position=new CANNON.Vec3(0, -20, 0)
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI *0.5
)
world.addBody(floorBody)
//objects to update
const objectsToUpdate = []

// Create sphere
const sphereGeometry = new THREE.SphereGeometry(1, 8, 8)



const createMeteor = (radius, position) =>
{
    const spherecolor = function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      console.log("fire")
      const sphereMaterial = new THREE.MeshStandardMaterial({emissive:spherecolor()})

    // Three.js mesh
    
    const mesh = new THREE.Mesh(star, sphereMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.rotation.y=Math.PI*.5
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 5, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.applyForce(new CANNON.Vec3(- 2000, -500, 0), body.position)
    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })
}

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if(sizes.width>860){
        camera.position.set(7, 5, 0)
        }
        else if (sizes.width>450){
            camera.position.set(7,3,0)
        }
        else{
            camera.position.set(13, 10, 0)
        }

})

const teaTexture= textureLoader.load('/UVimage.png')
const headTexture= textureLoader.load('/skin.jpg')
teaTexture.flipY = false
headTexture.flipY= false


const teaMaterial = new THREE.MeshBasicMaterial({map:teaTexture})
const headMaterial = new THREE.MeshBasicMaterial({map:headTexture})



const mouse = new THREE.Vector2()
mouse.x = null
mouse.y=null

$(".button").click((e)=>{

    console.log("clock")
    e.preventDefault();
    e.stopPropagation();

    $(".monitor").removeClass("invisibleP")
    $(".menue").addClass("invisibleP")
    var ButtonName = $(e.target).attr("name")
    switch(ButtonName){
        case "portfolio":
            $(".display").html(portfolio)
            break;
            case "contact":
            $(".display").html(contact)
            break;
            case "about":
            $(".display").html(about)
            break;
            case "news":
                $(".display").html(news)
                break;
    }


})

$(".xButton").click((e)=>{

    
    e.preventDefault();
    e.stopPropagation();

    $(".monitor").addClass("invisibleP")
    $(".menue").removeClass("invisibleP")

})

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    // console.log(mouse)
})

/**
 * Models
 */
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)
let rotation="on"
let mixer = null
let mixer2 = null
let satelites = null
let teaset = null
let head= null
let globe = null
let turnhead=null
let walk = null
let sateliteGroup=null
let star=null


gltfLoader.load(
    '/teatersoncomplete.gltf',
    (gltf) =>
    {
        
   

        
        teaset=gltf.scene

        console.log(teaset)

        // teaset.scale.set(0.25, 0.25, 0.25)
        scene.add(teaset)
        teaset.traverse((child)=>{
            child.material = teaMaterial
        })

        teaset.children[5].material=headMaterial;

        

        

    }
)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('orange', .5)
scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight('orange', 2)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(- 5, 5, 0)
// scene.add(directionalLight)




/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
if(sizes.width>860){
camera.position.set(7, 5, 0)
}
else if (sizes.width>450){
    camera.position.set(7,3,0)
}
else{
    camera.position.set(9, 4, 0)
}


scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(4, 2, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setClearColor( 'orange',.5);

// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

raycaster.setFromCamera(mouse, camera)



$(portfolioButton).mouseover(()=>{
    // teaset.children[1].position.y=-1;
    teaset.children[1].rotation.x=-.05*Math.PI
    


})
$(aboutButton).mouseover(()=>{
   
    teaset.children[5].position.y=0;
    teaset.children[12].position.y=0;


})
$(contactButton).mouseover(()=>{
    teaset.children[11].position.y=1;
  


})
$(newsButton).mouseover(()=>{
    teaset.children[9].position.y=1;
   

})

$(".button").mouseout(()=>{
     teaset.children[5].position.y=-1.25;
    teaset.children[12].position.y=-1.25;
    teaset.children[1].rotation.x=0
    teaset.children[11].position.y=.8;
    teaset.children[9].position.y=0.02;

})
/**
 * Animate
 */

let oldElapsedTime=null;

const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>





   
{
    for(const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1 / 60, deltaTime, 3)



   


    // if(box != null){
    // const intersects = raycaster.intersectObject(box.children[0].children[0])
    


    // if(intersects.length>0){

    //       box.children[0].children[1].children[0].material.color.set("yellow")
    //       console.log(intersects)
          
            
    //     }
    // else{

        
    //     box.children[0].children[1].children[0].material.color.set("violet")


    // }


    // }


    for(const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
        // object.body.applyForce(new CANNON.Vec3(- 10, 0, 0), object.body.position)
    }

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    controls.update()



    
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()