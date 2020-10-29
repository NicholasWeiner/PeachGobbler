// Player for PeachGobbler

// module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events;

let canMovePlayer = true;
let mouth,
    fruit,
    ground,
    butWidth,
    butHeight,
    button;

// Get the game field width/height.
// Note that the logical ingame width/height will always be as they are in config.js
// (in this example it is 540x960). Logical ingame pixels automatically scale to
// physical canvas style size.
const GAME_WIDTH = resizer.getGameWidth();
const GAME_HEIGHT = resizer.getGameHeight();

// ratio that is used for various game calculations to ensure size of objects is correct
const SIZE_FACTOR = GAME_WIDTH * GAME_HEIGHT / 640000; 
// this is a magic number, but I'm not totally sure how to remove it
// it represents the SIZE_FACTOR of the game in it's intitial conditions when I developed it.

const MOUTH_SIZE = GAME_WIDTH/5;

;(function () {

    // This line enables 'strict mode'. It helps you to write cleaner code,
    // like preventing you from using undeclared variables.
    "use strict";

    // Initialize the resizer
    resizer.init();


    // Initialize the template
    template.init();


    //////////////////////////
    // Variable declarations
    //////////////////////////

    // Grab some important values from the resizer
    let myCanvas = resizer.getCanvas();
    //let myContext = myCanvas.getContext("2d");

    // Is the game volume muted?
    let volumeMuted = false;



    //////////////////////////
    // Resize events
    //////////////////////////

    // Every time the Resizer resizes things, do some extra
    // recaculations to position the sample button in the center
    resizer.addResizeEvent(template.resizeBarButtons);

    // Manual resize to ensure that our resize functions are executed
    // (could have also just called resizerBarButtons() but this will do for demonstration purposes)
    resizer.resize();


    //////////////////////////
    // Button events
    //////////////////////////

    // Remove not implemented menus for those buttons we are implementing
    template.removeNotImplemented(template.menuButtons.restart);
    template.removeNotImplemented(template.menuButtons.exit);
    template.removeNotImplemented(template.menuButtons.volume);

    // Confirm the user wants to restart the game
    // (restart not yet implemented, so show "not implemented" menu)
    template.addConfirm(template.menuButtons.restart, "RESTART", function() {
        template.showMenu(template.menus.notImplemented);
    });

    // Confirm if the user wants to exit the game (takes user to main website)
    template.addConfirm(template.menuButtons.exit, "EXIT", template.goToBGL);

    // Change icon of volume button on click
    template.menuButtons.volume.addEventListener("click", function () {
        volumeMuted = !volumeMuted;

        if (volumeMuted) {
            template.setIcon(template.menuButtons.volume, "no-volume-icon");
        }
        else {
            template.setIcon(template.menuButtons.volume, "volume-icon");
        }
    }, false);

    

    /////////////////////////////////////
    // Function definitions
    /////////////////////////////////////

    let engine;

    let render;

    // Example helper function to do an arbitrary thing with the canvas
    function doSomething() {

        const BALL_RADIUS = GAME_WIDTH/20;

        // creates all necessary game objects
        mouth = Bodies.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 170 * SIZE_FACTOR, MOUTH_SIZE, MOUTH_SIZE/2, { isStatic: true });
        ground = Bodies.rectangle(GAME_WIDTH / 2 - 10, GAME_HEIGHT, GAME_WIDTH + 20, 110 * SIZE_FACTOR, { isStatic: true });
        ground.collisionFilter.mask = -1;
        butWidth = 150 * SIZE_FACTOR;
        butHeight = 100 * SIZE_FACTOR;
        button = Bodies.rectangle(GAME_WIDTH - butHeight * 1.5, butHeight * 1.5, butWidth, butHeight, { isStatic: true });

        let x = Bodies.circle(50, 50, 50, {isStatic : true});
        let y = Bodies.circle(25, 25, 25, {isStatic : true});

        let json = '[{"xpos":312.49407810044613,"ypos":479.1056235562246,"shapeType":1,"rotation":3.411748515566235,"properties":{"width":115.67187703891395,"height":166.70656165578117}},{"xpos":277.53292913726716,"ypos":623.6383151443931,"shapeType":4,"rotation":1.3040191666353589,"properties":{"slope":2,"width":96.55734689274962,"height":125.00331816559205}}]';
        let levelQueue = [decode(json), [x], [y]];

        function render_func() {

            canMovePlayer = true;

            // creates an engine
            engine = Engine.create()

            // Makes gravity that scales with height
            // for some reason, at SIZE_FACTOR, collisions are not detected but they are at 95% original speed 
            engine.world.gravity.y = SIZE_FACTOR * .95;

            fruit = Bodies.circle(GAME_WIDTH / 2, 150 * SIZE_FACTOR, BALL_RADIUS, {isStatic : true});
            fruit.collisionFilter.group = -1;

            Body.setPosition(mouth, {x: GAME_WIDTH / 2, y: GAME_HEIGHT - 170 * SIZE_FACTOR});

            // create a renderer
            render = Render.create({
                element: document.body,
                canvas: myCanvas,
                // these options likely represent the whole game screen rather than the mobile screen
                // is there a way to get the mobile screen dimensions?
                options: {
                    width: GAME_WIDTH,
                    height: GAME_HEIGHT
                },
                engine: engine
            });

            // add all of the bodies to the world
            if(levelQueue.length != 0) {
                World.add(engine.world, [ground, fruit, mouth/*, button*/].concat(levelQueue.shift())/*.concat(decode(levelQueue.shift()))*/);
            }

            // run the engine
            Engine.run(engine);

            // run the renderer
            Render.run(render);

            // runs collision events (win/lose)
            Events.on(engine, 'collisionStart', function (event) {
                let pairs = event.pairs;
                let bodyA = pairs[0].bodyA;
                let bodyB = pairs[0].bodyB;

                if (bodyA === fruit || bodyB === fruit) {
                    // if one is mouth and the other is fruit, win condition
                    if (bodyA === mouth || bodyB === mouth) {
                        console.log("win");
                        // uses the difference in position of the bodies to calculate accuracy
                        console.log(Math.abs(bodyA.position.x - bodyB.position.x));
                        clear();
                    }
                    // if one is ground and the other is fruit, lose
                    else if (bodyA === ground || bodyB === ground) {
                        console.log("lose");
                        clear();
                    }
                }
            });
        }

        function clear() {
            console.log("cleared");
            World.clear(engine.world);
            Engine.clear(engine);
            Render.stop(render);
            render.context = null;
            render.textures = {};

            render_func();
        }

        // takes in a level json, returns the level as an array of Matter.js Bodies
        function decode(shapesText) {
            let parsed = JSON.parse(shapesText);
            console.log(parsed);
            let shapes = [];
            console.log(parsed.length);

            shapes = parsed.map(jShape_to_matterShape);

            console.log(shapes);

            return shapes;
        }

        function jShape_to_matterShape(jShape) {
            let shape;
            switch(jShape.shapeType){
                case 0:
                    shape = Bodies.rectangle(jShape.xpos, jShape.ypos, jShape.properties.length, jShape.properties.length, { isStatic: true });
                    break;
                case 1:
                    shape = Bodies.rectangle(jShape.xpos, jShape.ypos, jShape.properties.width, jShape.properties.height, { isStatic: true });
                    break;
                case 2:
                    shape = Bodies.circle(jShape.xpos, jShape.ypos, jShape.properties.radius, { isStatic: true });
                    break;
                // possibly remove/revise triangles/trapezoids to deal with phasing issue
                // phasing issues seem to be resolved with bigger fruit and slower gravity
                case 3:
                case 4:
                    shape = Bodies.trapezoid(jShape.xpos, jShape.ypos, jShape.properties.width, jShape.properties.height, jShape.properties.slope, { isStatic: true });
            }

            shape.collisionFilter.mask = -1;
            shape.friction = 0.025;
            Body.rotate(shape, jShape.rotation);

            return shape;
        }

        render_func();
    }

    /////////////////////////////////////
    // Mainline logic
    /////////////////////////////////////

    // Begin the arbitrary thing example loop
    doSomething();


// Close and execute the IIFE here
})();

// activates on hold and drag
function move(event) {
    if (canMovePlayer) {
        let mousex = event.touches[0].clientX;
        if (mousex > GAME_WIDTH) {
            mousex = GAME_WIDTH;
        }
        else if (mousex < 0) {
            mousex = 0;
        }

        // another magic number used here - not sure why 2 makes this work but it does (on mobile, it doesnt work on desktop)
        Body.setPosition(mouth, { x: 2 * mousex, y: mouth.position.y });
    }
}

// makes the player unable to move and starts the fruit's physics
function phase2() {
    canMovePlayer = false;
    Body.setStatic(fruit, false);
}

document.addEventListener("keypress", function(event) {
    if (event.key == ' ') {
      phase2();
    }
});