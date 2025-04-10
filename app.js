const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { adaptToDeviceRatio: true });

const createScene = function() {
    const scene = new BABYLON.Scene(engine);
    
    // Creiamo una skybox stellata
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/space", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    
    // Aggiungiamo una camera con supporto touch
    const camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true, true); // Il terzo parametro abilita il controllo touch
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 20;
    camera.pinchPrecision = 50; // Migliora la sensibilità del pinch-to-zoom
    camera.wheelPrecision = 50; // Migliora la sensibilità dello zoom
    camera.panningSensibility = 50; // Migliora la sensibilità del panning

    // Ottimizziamo i controlli touch
    camera.inputs.attached.pointers.multiTouchPanning = true; // Abilita il panning multi-touch
    camera.inputs.attached.pointers.multiTouchPanAndZoom = true; // Abilita zoom e pan simultanei

    // Aggiungiamo una luce
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Carichiamo il file PLY
    BABYLON.SceneLoader.ImportMesh("", "./", "colored-pointcloud.ply", scene, function (meshes) {
        const boundingInfo = meshes[0].getBoundingInfo();
        const center = boundingInfo.boundingBox.centerWorld;
        camera.setTarget(center);
        camera.radius = boundingInfo.boundingBox.maximumWorld.subtract(boundingInfo.boundingBox.minimumWorld).length() * 2;
        
        // Misura drastica: invertiamo la scala anziché ruotare
        meshes[0].scaling = new BABYLON.Vector3(1, -1, 1);
        
        // Ottimizziamo il rendering per dispositivi mobili
        meshes[0].freezeWorldMatrix(); // Ottimizza le performance
    });

    return scene;
}

const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
}); 