// This IIFE (aka closure) is for style preference only; it helps to prevent
// things inside from polluting the global namespace. It is completely optional.

// The leading semicolon is also a defensive measure when concatenating several
// JavaScript files into one.

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
    let myContext = myCanvas.getContext("2d");

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

    // function render_func() {

    //     canMovePlayer = true;

    //     // creates an engine
    //     engine = Engine.create()

    //     // Makes gravity that scales with height
    //     // for some reason, at SIZE_FACTOR, collisions are not detected but they are at 95% original speed 
    //     engine.world.gravity.y = SIZE_FACTOR * .95;

    //     // why does fruit keep it's gravity?
    //     // it should clear after intitializing the new fruit
    //     // maybe place an object under it that's invisible?
    //     // or make a super script that intializes this script every time
    //     fruit = Bodies.circle(SCREEN_WIDTH / 2, 50, BALL_RADIUS, {isStatic : true});
    //     fruit.collisionFilter.group = -1;

    //     // create a renderer
    //     render = Render.create({
    //         element: document.body,
    //         canvas: game-canvas,
    //         options: {
    //             width: SCREEN_WIDTH,
    //             height: SCREEN_HEIGHT
    //         },
    //         engine: engine
    //     });

    //     // add all of the bodies to the world
    //     if(levelQueue.length != 0) {
    //         World.add(engine.world, [ground, base, fruit, teethA, teethB, mouth, button].concat(levelQueue.shift())/*.concat(decode(levelQueue.shift()))*/);
    //     }

    //     // run the engine
    //     Engine.run(engine);

    //     // run the renderer
    //     Render.run(render);

    //     // runs collision events (win/lose)
    //     Events.on(engine, 'collisionStart', function (event) {
    //         let pairs = event.pairs;
    //         let bodyA = pairs[0].bodyA;
    //         let bodyB = pairs[0].bodyB;

    //         if (bodyA === fruit || bodyB === fruit) {
    //             // if one is mouth and the other is fruit, win condition
    //             if (bodyA === mouth || bodyB === mouth) {
    //                 console.log("win");
    //                 // uses the difference in position of the bodies to calculate accuracy
    //                 console.log(Math.abs(bodyA.position.x - bodyB.position.x));
    //                 clear();
    //             }
    //             // if one is ground and the other is fruit, lose
    //             if (bodyA === ground || bodyB === ground) {
    //                 console.log("lose");
    //                 clear();
    //             }
    //         }
    //     });
    // }

    // function clear() {
    //     console.log("cleared");
    //     World.clear(engine.world);
    //     Engine.clear(engine);
    //     Render.stop(render);
    //     render.context = null;
    //     render.textures = {};

    //     render_func();
    // }

    // // activates on hold and drag
    // function move(event) {
    //     if (canMovePlayer) {
    //         let mousex = event.touches[0].clientX;
    //         if (mousex > SCREEN_WIDTH) {
    //             mousex = SCREEN_WIDTH;
    //         }
    //         if (mousex < 0) {
    //             mousex = 0;
    //         }

    //         Body.translate(mouth, { x: mousex - mouth.position.x, y: 0 });
    //         Body.translate(teethA, { x: mousex - teethA.position.x - 30 * SIZE_FACTOR, y: 0 });
    //         Body.translate(teethB, { x: mousex - teethB.position.x + 30 * SIZE_FACTOR, y: 0 });
    //         Body.translate(base, { x: mousex - base.position.x, y: 0 });
    //     }
    // }

    // // makes the player unable to move and starts the fruit's physics
    // function phase2() {
    //     canMovePlayer = false;
    //     Body.setStatic(fruit, false);
    // }

    // // checks if the start button is pressed
    // function startButtonPressed(event) {
    //     let mousex = event.touches[0].clientX;
    //     let mousey = event.touches[0].clientY;
    //     let butxrange = [button.position.x - butWidth / 2, button.position.x + butWidth / 2];
    //     let butyrange = [button.position.y - butHeight / 2, button.position.y + butHeight / 2];
    //     if (mousex >= butxrange[0] && mousex <= butxrange[1] && mousey >= butyrange[0] && mousey <= butyrange[1]) {
    //         phase2();
    //     }
    // }

    // // takes in a level json, returns the level as an array of Matte.js Bodies
    // function decode(shapesText) {
    //     let parse = JSON.parse(shapesText);
    //     console.log(parse);
    //     shapes = [];

    //     for (let i = 0; i < parse.length; i++) {
    //         let shape;

    //         switch (parse[i].shapeType) {
    //             case 0:
    //                 shape = Bodies.rectangle(parse[i].xpos, parse[i].ypos, parse[i].properties.length, parse[i].properties.length, { isStatic: true });
    //                 break;
    //             case 1:
    //                 shape = Bodies.rectangle(parse[i].xpos, parse[i].ypos, parse[i].properties.width, parse[i].properties.height, { isStatic: true });
    //                 break;
    //             case 2:
    //                 shape = Bodies.circle(parse[i].xpos, parse[i].ypos, parse[i].properties.radius, { isStatic: true });
    //                 break;
    //             // possibly remove/revise triangles/trapezoids to deal with phasing issue
    //             // phasing issues seem to be resolved with bigger fruit and slower gravity
    //             case 3:
    //             case 4:
    //                 shape = Bodies.trapezoid(parse[i].xpos, parse[i].ypos, parse[i].properties.width, parse[i].properties.height, parse[i].properties.slope, { isStatic: true });
    //         }

    //         shape.collisionFilter.mask = -1;
    //         shape.friction = 0.025;
    //         Body.rotate(shape, parse[i].rotation);

    //         shapes[i] = shape;
    //     }

    //     return shapes;
    // }

    // render_func();

    // module aliases
    let Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Events = Matter.Events;

    let engine;

    let render;

    // creates all necessary game objects
    let base = Bodies.rectangle(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 110 * SIZE_FACTOR, 100 * SIZE_FACTOR, 160 * SIZE_FACTOR, { isStatic: true });
    let mouth = Bodies.rectangle(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 170 * SIZE_FACTOR, MOUTH_SIZE, MOUTH_SIZE/2, { isStatic: true });
    let teethA = Bodies.polygon(SCREEN_WIDTH / 2 - 30 * SIZE_FACTOR, SCREEN_HEIGHT - 200 * SIZE_FACTOR, 3, 20 * SIZE_FACTOR, { isStatic: true })
    Body.rotate(teethA, 7 * (Math.PI / 6));
    let teethB = Bodies.polygon(SCREEN_WIDTH / 2 + 30 * SIZE_FACTOR, SCREEN_HEIGHT - 200 * SIZE_FACTOR, 3, 20 * SIZE_FACTOR, { isStatic: true })
    Body.rotate(teethB, 7 * (Math.PI / 6));
    let fruit;
    let ground = Bodies.rectangle(SCREEN_WIDTH / 2 - 10, SCREEN_HEIGHT, SCREEN_WIDTH + 20, 110 * SIZE_FACTOR, { isStatic: true });
    ground.collisionFilter.mask = -1;
    let butWidth = 150 * SIZE_FACTOR;
    let butHeight = 100 * SIZE_FACTOR;
    let button = Bodies.rectangle(SCREEN_WIDTH - butHeight * 1.5, butHeight * 1.5, butWidth, butHeight, { isStatic: true });

    let canMovePlayer = true;

    let x = Bodies.circle(50, 50, 50, {isStatic : true});
    let y = Bodies.circle(25, 25, 25, {isStatic : true});

    let levelQueue = [[x], [y], [x], [y]];

    // Example helper function to do an arbitrary thing with the canvas
    let doSomething = (function() {

        // copy everything from MonsterPhysics into here?

        // Get the game field width/height.
        // Note that the logical ingame width/height will always be as they are in config.js
        // (in this example it is 540x960). Logical ingame pixels automatically scale to
        // physical canvas style size.
        const GAME_WIDTH = resizer.getGameWidth();
        const GAME_HEIGHT = resizer.getGameHeight();

        // constants
        let SIZE_FACTOR = GAME_WIDTH * GAME_HEIGHT / 640000; 
        // this is a magic number, but I'm not totally sure how to remove it
        // it represents the SIZE_FACTOR of the game in it's intitial conditions when I developed it.
        let BALL_RADIUS = GAME_WIDTH/20;
        let MOUTH_SIZE = GAME_WIDTH/5;

        // 10px margin on all sides
        const margin = 10;

        // The number of frames after which to change colors
        const CHANGE_FRAME = 120;

        // The number of frames passed so far
        let frames = 0;

        // The color to fill
        let color;

        return function() {
            // 1 frame has passed
            frames = (frames+1) % CHANGE_FRAME;

            // Grab a random color every 120 frames (approx. 2 seconds, ideally)
            if (frames === 0) {
                color = "#" + Math.floor( Math.random()*1000000 );
            }

            // Set the color
            myContext.fillStyle = color;

            // Color within the margins
            myContext.fillRect(margin, margin, GAME_WIDTH-(margin*2), GAME_HEIGHT-(margin*2));

            // Execute this function again in the next frame
            window.requestAnimationFrame(doSomething);
        };
    })();




    /////////////////////////////////////
    // Mainline logic
    /////////////////////////////////////

    // Begin the arbitrary thing example loop
    doSomething();


// Close and execute the IIFE here
})();