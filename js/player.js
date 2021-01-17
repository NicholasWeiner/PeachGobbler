// This line enables 'strict mode'. It helps you to write cleaner code,
// like preventing you from using undeclared variables.
"use strict";

// Player for PeachGobbler
// module aliases
const Engine = Matter.Engine,
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
    button,
    score = 0;

/* 
 * Get the game field width/height.
 * Note that the logical ingame width/height will always be as they are in 
 * config.js
 * (in this example it is 540x960). Logical ingame pixels automatically scale to
 * physical canvas style size. 
*/
const GAME_WIDTH = resizer.getGameWidth();
const GAME_HEIGHT = resizer.getGameHeight();

/*
 * ratio that is used for various game calculations to ensure size of objects 
 * is correct
 */
const SIZE_FACTOR = GAME_WIDTH * GAME_HEIGHT / 640000;
/*
 * this is a magic number, but I'm not totally sure how to remove it
 * it represents the SIZE_FACTOR of the game in it's intitial conditions when 
 * I developed it.
 */

const MOUTH_SIZE = GAME_WIDTH / 5;

; (function () {

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

    /* 
     * Manual resize to ensure that our resize functions are executed
     * (could have also just called resizerBarButtons() but this will do for 
     * demonstration purposes) 
     */
    resizer.resize();


    //////////////////////////
    // Button events
    //////////////////////////

    // Remove not implemented menus for those buttons we are implementing
    template.removeNotImplemented(template.menuButtons.restart);
    template.removeNotImplemented(template.menuButtons.exit);
    template.removeNotImplemented(template.menuButtons.volume);

    /**
     * Confirm the user wants to restart the game
     * (restart not yet implemented, so show "not implemented" menu)
     */
    template.addConfirm(template.menuButtons.restart, "RESTART", function () {
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

    // keep these defined outside so they can be accessed by other functions
    let engine;

    let render;

    // Example helper function to do an arbitrary thing with the canvas
    function startPlayer() {

        const BALL_RADIUS = GAME_WIDTH / 20;

        // creates all necessary game objects
        mouth = Bodies.rectangle(
            GAME_WIDTH / 2,
            GAME_HEIGHT - 170 * SIZE_FACTOR,
            MOUTH_SIZE, MOUTH_SIZE / 2,
            { isStatic: true }
        );
        ground = Bodies.rectangle(
            GAME_WIDTH / 2 - 10,
            GAME_HEIGHT,
            GAME_WIDTH + 20,
            110 * SIZE_FACTOR,
            { isStatic: true }
        );
        ground.collisionFilter.mask = -1;
        butWidth = 150 * SIZE_FACTOR;
        butHeight = 100 * SIZE_FACTOR;
        button = Bodies.rectangle(
            GAME_WIDTH - butHeight * 1.5,
            butHeight * 1.5,
            butWidth,
            butHeight,
            { isStatic: true }
        );

        // will be removed in the final version
        let levelIterator = 1;
        const json = '[{"xpos":296.04969113272455,"ypos":296.9246157592158,"shapeType":1,"rotation":2.8970397822470453,"properties":{"width":98.22653961869237,"height":66.28608161010914}},{"xpos":159.95817405600124,"ypos":349.4683553241442,"shapeType":4,"rotation":0.6049009232817155,"properties":{"slope":2,"width":120.68025905586347,"height":141.06125392730237}}]';
        const json1 = '[{"xpos":119.13535473516163,"ypos":462.32563968296074,"shapeType":1,"rotation":3.7404756835945845,"properties":{"width":85.5249395499793,"height":54.37824772255924}},{"xpos":173.9080312165458,"ypos":429.96031702585606,"shapeType":2,"rotation":2.3056576771462844,"properties":{"radius":75.18129493025866}},{"xpos":209.0344193052301,"ypos":410.2555824470453,"shapeType":0,"rotation":2.373170842975902,"properties":{"length":162.64133664634107}},{"xpos":157.49602491072824,"ypos":566.5367552278203,"shapeType":0,"rotation":2.049697007884801,"properties":{"length":77.95300291137153}}]';
        const json2 = '[{"xpos":111.70738226872875,"ypos":291.9143324011509,"shapeType":1,"rotation":4.926676457854034,"properties":{"width":121.5621390228912,"height":167.8990135151037}},{"xpos":230.13436863902632,"ypos":547.2361402845762,"shapeType":4,"rotation":1.278674237373954,"properties":{"slope":2,"width":98.06936394503997,"height":83.24788389530286}},{"xpos":93.09469677740574,"ypos":278.7937975549847,"shapeType":3,"rotation":3.6068022419160566,"properties":{"slope":1,"width":134.75926227942207,"height":155.2564914281312}},{"xpos":268.9813379922802,"ypos":638.8381108794143,"shapeType":3,"rotation":5.987996685432264,"properties":{"slope":1,"width":78.0692141311929,"height":139.64872708906026}},{"xpos":346.5566984615984,"ypos":388.5917451996556,"shapeType":0,"rotation":2.3952118934414504,"properties":{"length":130.15944428833367}}]';
        const json3 = '[{"xpos":448.64224366106106,"ypos":594.1247284780807,"shapeType":3,"rotation":5.953589765238622,"properties":{"slope":1,"width":172.68327691248336,"height":150.31163755460798}},{"xpos":329.28438641706015,"ypos":575.0274498959159,"shapeType":0,"rotation":3.062940536356303,"properties":{"length":144.47859565392446}},{"xpos":410.92721068754037,"ypos":510.02072332727886,"shapeType":3,"rotation":2.3848314938697555,"properties":{"slope":1,"width":81.7823240628515,"height":151.4484038761779}},{"xpos":351.60133298895096,"ypos":451.11774964893243,"shapeType":0,"rotation":2.4848859240234433,"properties":{"length":112.49271393604849}}]';
        const json4 = '[{"xpos":366.1079423861477,"ypos":614.3668668964253,"shapeType":3,"rotation":2.450100526939864,"properties":{"slope":1,"width":170.66546697817213,"height":72.6622521446745}},{"xpos":354.92198367447753,"ypos":361.77657619197123,"shapeType":2,"rotation":3.675548164460196,"properties":{"radius":30.446647775427596}},{"xpos":448.2764174709369,"ypos":404.15669744822003,"shapeType":4,"rotation":0.040795835878501364,"properties":{"slope":2,"width":59.70542304068113,"height":58.34664948247845}}]';
        const json5 = '[{"xpos":434.37942930937237,"ypos":583.8133737747173,"shapeType":4,"rotation":5.874809965121344,"properties":{"slope":2,"width":70.30680271107389,"height":89.13664606872719}},{"xpos":200.29701801445077,"ypos":450.181586757121,"shapeType":2,"rotation":2.1979852630008176,"properties":{"radius":52.134508887307355}},{"xpos":362.5572193248998,"ypos":533.1820742761458,"shapeType":0,"rotation":6.1933269998807505,"properties":{"length":101.60841270824848}}]';
        const json6 = '[{"xpos":115.98250117370968,"ypos":311.44904168173946,"shapeType":2,"rotation":4.363559610898064,"properties":{"radius":53.86332175897119}},{"xpos":187.1404866288708,"ypos":530.0966832579161,"shapeType":2,"rotation":2.012048449245027,"properties":{"radius":57.0227805416704}},{"xpos":392.335112611209,"ypos":285.2442150506641,"shapeType":1,"rotation":5.647375239281797,"properties":{"width":75.01987994712377,"height":160.91778590538058}}]';
        const json7 = '[{"xpos":202.77697801132805,"ypos":438.7985789016433,"shapeType":1,"rotation":1.6827607097213022,"properties":{"width":65.19218346876241,"height":81.20813013904072}},{"xpos":375.39481216013405,"ypos":256.9021241555944,"shapeType":2,"rotation":4.487276690078188,"properties":{"radius":60.128962062978566}}]';
        const json8 = '[{"xpos":277.5689620527302,"ypos":605.9286650024841,"shapeType":1,"rotation":5.488000456649611,"properties":{"width":148.65017407217584,"height":177.36815615513513}},{"xpos":347.96776647239267,"ypos":611.3406337593758,"shapeType":3,"rotation":4.875277369441641,"properties":{"slope":1,"width":69.58921422788849,"height":167.57590453962968}},{"xpos":132.54008636243043,"ypos":416.6098260317731,"shapeType":0,"rotation":5.004313430709568,"properties":{"length":71.98947150764735}}]';
        let levelQueue = [decode(json), decode(json1), decode(json2), decode(json3), decode(json4), decode(json5), decode(json6), decode(json7), decode(json8)];

        function renderPlayer() {

            document.getElementById("bar-label").innerHTML =
                'LEVEL:' + '\xa0' + '\xa0' + levelIterator;

            canMovePlayer = true;

            // creates an engine
            engine = Engine.create()

            /**
             * Makes gravity that scales with height
             * for some reason, at SIZE_FACTOR, collisions are not detected but 
             * they are at 95% original speed
             */
            engine.world.gravity.y = SIZE_FACTOR * .95;

            fruit = Bodies.circle(
                GAME_WIDTH / 2,
                150 * SIZE_FACTOR,
                BALL_RADIUS,
                { isStatic: true }
            );
            fruit.collisionFilter.group = -1;

            Body.setPosition(
                mouth,
                { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 170 * SIZE_FACTOR }
            );

            // create a renderer
            render = Render.create({
                element: document.body,
                canvas: myCanvas,
                options: {
                    width: GAME_WIDTH,
                    height: GAME_HEIGHT
                },
                engine: engine
            });

            // add all of the bodies to the world
            if (levelQueue.length !== 0) {
                World.add(
                    engine.world,
                    [ground, fruit, mouth].concat(levelQueue.shift())
                );
            }

            // run the engine
            Engine.run(engine);

            // run the renderer
            Render.run(render);

            // runs collision events (win/lose)
            Events.on(engine, 'collisionStart', function (event) {
                const { bodyA: bodyA, bodyB: bodyB } = event.pairs[0];

                if (bodyA === fruit || bodyB === fruit) {
                    // if one is mouth and the other is fruit, win condition
                    if (bodyA === mouth || bodyB === mouth) {
                        console.log("win");
                        /*
                         * uses the difference in position of the bodies to 
                         * calculate accuracy
                         */
                        score += Math.abs(bodyA.position.x - bodyB.position.x);
                        clear();
                    }
                    // if one is ground and the other is fruit, lose
                    else if (bodyA === ground || bodyB === ground) {
                        console.log("lose");
                        score += MOUTH_SIZE;
                        clear();
                    }
                }
            });
        }

        // clears world and gets it ready for next level
        function clear() {
            //console.log("cleared");
            console.log("score: " + score)
            World.clear(engine.world);
            Engine.clear(engine);
            Render.stop(render);
            render.context = null;
            render.textures = {};

            levelIterator++;
            renderPlayer();
        }

        /*
         * takes in a level json,
         * returns the level as an array of Matter.js Bodies
         */

        function decode(shapesText) {
            const parsed = JSON.parse(shapesText);
            const shapes = parsed.map(jShape_to_matterShape);
            return shapes;
        }

        function jShape_to_matterShape(jShape) {
            const {
                xpos: xpos,
                ypos: ypos,
                shapeType: shapeType,
                rotation: rotation,
                properties: properties
            } = jShape;
            let shape;
            switch (shapeType) {
                case 0:
                    shape = Bodies.rectangle(
                        xpos,
                        ypos,
                        properties.length,
                        properties.length,
                        { isStatic: true }
                    );
                    break;
                case 1:
                    shape = Bodies.rectangle(
                        xpos,
                        ypos,
                        properties.width,
                        properties.height,
                        { isStatic: true }
                    );
                    break;
                case 2:
                    shape = Bodies.circle(
                        xpos,
                        ypos,
                        properties.radius,
                        { isStatic: true }
                    );
                    break;
                // phasing issues resolved with bigger fruit & slower gravity
                case 3:
                case 4:
                    shape = Bodies.trapezoid(
                        xpos,
                        ypos,
                        properties.width,
                        properties.height,
                        properties.slope,
                        { isStatic: true }
                    );
            }

            shape.collisionFilter.mask = -1;
            shape.friction = 0.025;
            Body.rotate(shape, rotation);

            return shape;
        }

        renderPlayer();
    }

    /////////////////////////////////////
    // Mainline logic
    /////////////////////////////////////
    startPlayer();


    // Close and execute the IIFE here
})();


// other functions that interact with HTML

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

        Body.setPosition(mouth, { x: 2 * mousex, y: mouth.position.y });
    }
}

// takes care of click and touch click events
document.onclick = function (event) {
    // activates phase 2 if you touch the top 5th of the screen
    const CUTOFF = GAME_HEIGHT / 5;
    let mousey = event.clientY;

    if (mousey <= CUTOFF) {
        phase2();
    }
};

// makes the player unable to move and starts the fruit's physics
function phase2() {
    canMovePlayer = false;
    Body.setStatic(fruit, false);
}

document.addEventListener("keypress", function (event) {
    if (event.key === ' ') {
        phase2();
    }
});