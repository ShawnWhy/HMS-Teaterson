import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {SphereGeometry, TextureLoader } from 'three'
import $ from "./Jquery"
import gsap from "gsap";



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


//raycaster
const raycaster = new THREE.Raycaster()

//cannon

// const fakeEarthMaterial = new THREE.MeshStandardMaterial({color:'pink'})
// const fakeEarthGeometry = new THREE.SphereGeometry(5.6,20,20)
// const fakeEarthMesh = new THREE.Mesh(fakeEarthGeometry, fakeEarthMaterial)
// fakeEarthMesh.position.copy(bubbleBody.position)
// scene.add(fakeEarthMesh)
    
//physics floor
//objects to update
const objectsToUpdate = []

// Create sphere
const sphereGeometry = new THREE.SphereGeometry(1, 8, 8)


const danceroutine = ()=>{
    

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

$(".play").click((e)=>{

    
    e.preventDefault();
    e.stopPropagation();

   dance="on"
   $(".play").addClass("invisibleP")
   $(".stop").removeClass("invisibleP")
   gsap.to(teaset.children[8].rotation,{duration:1,x:Math.PI*.25})
   gsap.to(teaset.children[8].position,{duration:1,z:1.5})
   gsap.to(teaset.children[8].position,{duration:1,y:.4})


})

$(".stop").click((e)=>{

    
    e.preventDefault();
    e.stopPropagation();

   dance="off"
   $(".play").removeClass("invisibleP")
   $(".stop").addClass("invisibleP")
   gsap.to(teaset.children[8].rotation,{duration:.5,x:Math.PI*0})
   gsap.to(teaset.children[8].position,{duration:.5,z:.7})
   gsap.to(teaset.children[8].position,{duration:.5,y:.2})
   gsap.to( teaset.children[5].position,{duration:.3,y:-1.45})
    gsap.to( teaset.children[12].position,{duration:.3,y:-1.45})
    gsap.to( teaset.children[11].position,{duration:.3,y:.8})
    gsap.to( teaset.children[1].rotation,{duration:.6,y:0})


   

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
let dance="off"
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
        teaset.children[3].position.y-=.2
        teaset.children[12].position.y-=.2
        teaset.children[5].position.y-=.2
        teaset.children[8].position.y-=.1
        
        
            

        

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
    // teaset.children[1].rotation.x=-.05*Math.PI
    gsap.to( teaset.children[1].rotation,{duration:.3,x:-.05*Math.PI})

    


})
$(aboutButton).mouseover(()=>{
   
    // teaset.children[5].position.y=-.5;
    // teaset.children[12].position.y=-.5;
    gsap.to( teaset.children[5].position,{duration:.3,y:-.5})
    gsap.to( teaset.children[12].position,{duration:.3,y:-.5})




})
$(contactButton).mouseover(()=>{
    gsap.to( teaset.children[11].position,{duration:.3,y:1})

    // teaset.children[11].position.y=1;
  


})
$(newsButton).mouseover(()=>{
    gsap.to( teaset.children[9].position,{duration:.3,y:1})

    // teaset.children[9].position.y=1;
   

})

$(".button").mouseout(()=>{
    gsap.to( teaset.children[5].position,{duration:.3,y:-1.45})
    gsap.to( teaset.children[12].position,{duration:.3,y:-1.45})
    gsap.to( teaset.children[1].rotation,{duration:.3,x:0})
    gsap.to( teaset.children[11].position,{duration:.3,y:.8})
    gsap.to( teaset.children[9].position,{duration:.3,y:.02})
    gsap.to( teaset.children[1].rotation,{duration:.3,y:0})

    // teaset.children[12].position.y=-1.45;
    // teaset.children[1].rotation.x=0
    // teaset.children[11].position.y=.8;
    // teaset.children[9].position.y=0.02;

})
/**
 * Animate
 */

let oldElapsedTime=null;


const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>
   
{



  
    
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    if(dance=="on"){

        teaset.children[11].rotation.y+=.01;
        teaset.children[7].rotation.y-=.01;

        teaset.children[2].rotation.y+=.01;
        teaset.children[12].position.y=(Math.abs(Math.sin(elapsedTime*1.5)))*.4-1.45
        teaset.children[11].position.y=(Math.abs(Math.sin(elapsedTime*1.5-1.5)))*.4+.8
        teaset.children[5].position.y=(Math.abs(Math.sin(elapsedTime*1.5)))*.4-1.45
        teaset.children[1].rotation.y=(Math.sin(elapsedTime*1.3))-Math.PI*.25

        
        
        // teaset.children[8].position.z=-.1


    
    }



   


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