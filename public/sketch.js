
/** Connects to the server */
const socket = io();

/** --- GLOBAL VARIABLE --- */

let color_black;
let b_fillColor;
let color_white;
let c_strokeColor;
let color_DarkGrey;
let color_red; // Variable to store colors objects
let c_fillColor; // Variable to store the colors of the circle.


/** --- OBJECTS AND CLASSES --- */

/** Class exclusively used to create the obstacle array */
class obs {
    constructor(posX, posY, dir, h_v) {
        this.posX = posX;
        this.posY = posY;
        this.dir = dir; // Variable used to change the direction of the obstacle.
        this.h_v = h_v;
    }
    display(posX, posY) {
        push();
        fill('red');
        stroke('black');
        ellipse(posX, posY, obstacle.width, obstacle.height);
        pop();
    }
};

/** Object to store functions and variable related to the obstacle */
const obstacle = {
    array: [],
    width: 15,
    height: 15,
    directionChange: 1,
    index: 0, // Variable that store the index of the obstacle to display, default is 0.
    number: 50, // Variable used to define how many obstacle will spawn during the game.
    directionHV: 0, // Variable that define the obstacle's direction, vertical or horizontal. 
    currentNumber: 0, // Variable used to store the number of obstacle currently set to display.
    stepSize: 1, // Variable that define by how muçh pixels the circle will move when a key is pressed.
    /** To fill the obstacle array */
    pushInArray: function () {
        for (let i = 0; i < this.number; i++) {
            let obsPosX = random(20, 620);
            let obsPosY = random(20, 460);
            let obsDir = 1;
            let obsH_v = this._randomMinusOneZero();
            let obstacleV = new obs(obsPosX, obsPosY, obsDir, obsH_v);
            this.array.push(obstacleV);
        }
    },
    _randomMinusOneZero: function () {
        return Math.random() < 0.5 ? -1 : 0;
    }
};

/** Object to store functions and variable related to the circle */
const cercle = {
    stepSize: 2, // Variable that define by how muçh pixels the circle will move when a key is pressed.
    posX: 50,
    posY: 50,
    size: 50,
    display: function (posX, posY, size) {
        push();
        fill(c_fillColor);
        stroke(c_strokeColor);
        circle(posX, posY, size);
        pop();
    }
};

/** Object to store functions related to the displaying of elements */
const display = {
    cercle: function () {
        cercle.display(cercle.posX, cercle.posY, cercle.size);
    },
    obstacle: function (indexObs) {
        let posX = obstacle.array[indexObs]["posX"];
        let posY = obstacle.array[indexObs]["posY"];
        push();
        fill('red');
        stroke('black');
        ellipse(posX, posY, obstacle.width, obstacle.height);
        pop();
    },
    canvasBorder: function () {
        push();
        stroke(b_fillColor);
        line(1, 1, 640, 1);
        line(1, 1, 1, 480);
        line(1, 479, 640, 479);
        line(639, 480, 639, 0);
        pop();
    },
    score: function () {
        t = this._timeInSec();
        if (eventHandlers.isObjectCollisionTrue === true || eventHandlers.isBorderCollisionTrue === true) {
            push();
            fill('white');
            stroke('black');
            strokeWeight(3);
            text("Your Score : " + t + " secondes", 320, 210);
            pop();
        }
    },
    timer: function () {
        let s = this._timeInSec();
        push();
        fill('white');
        stroke('black');
        strokeWeight(3);
        text(`${nf(s, 1, 1)} sec`, 200, 455);
        pop();
    },
    _timeInSec: function () {
        let timeInMs = millis();
        return round(timeInMs / 1000);
    }
};

/** Object to store functions related to updating positions of elements on the canvas */
const positionUpdate = {
    cercle: function () {
        if (keyIsDown(UP_ARROW)) {
            cercle.posY -= cercle.stepSize;
        }
        if (keyIsDown(DOWN_ARROW)) {
            cercle.posY += cercle.stepSize;
        }
        if (keyIsDown(LEFT_ARROW)) {
            cercle.posX -= cercle.stepSize;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            cercle.posX += cercle.stepSize;
        }
    },
    obstacle: function (indexObs) {
        let hv = obstacle.array[indexObs]["h_v"];
        if (hv === 0) {
            this._obstacleHorizontal(indexObs);
        }
        if (hv === -1) {
            this._obstacleVertical(indexObs);
        }
    },
    _obstacleHorizontal: function (indexObs) {
        let posX = obstacle.array[indexObs]["posX"];
        let dir = obstacle.array[indexObs]["dir"];
        let obsBorderX = (posX - obstacle.width / 2);
        let obsBorderXX = (posX + obstacle.width / 2);

        if (obsBorderX > 5 && obsBorderXX < 635) { // If both extermities of the ellipse are inside the canvas the direction doesn't change.
            posX += obstacle.stepSize * dir;
            obstacle.array[indexObs]["posX"] = posX;
        }
        else {
            dir *= -1; // Change the direction by mutiplying direction by -1, if direction is 1 then it becomes -1 and vis versa.
            obstacle.array[indexObs]["dir"] = dir;
            posX += obstacle.stepSize * dir;
            obstacle.array[indexObs]["posX"] = posX;
        }
    },
    _obstacleVertical: function (indexObs) {
        let posY = obstacle.array[indexObs]["posY"];
        let dir = obstacle.array[indexObs]["dir"];
        let obsBorderY = (posY - obstacle.width / 2);
        let obsBorderYY = (posY + obstacle.width / 2);

        if (obsBorderY > 5 && obsBorderYY < 475) {
            posY += obstacle.stepSize * dir;
            obstacle.array[indexObs]["posY"] = posY;
        }
        else {
            dir *= -1;
            obstacle.array[indexObs]["dir"] = dir;
            posY += obstacle.stepSize * dir;
            obstacle.array[indexObs]["posY"] = posY;
        }
    },
};

/** Object to store functions handling important games event (like collision) */
const eventHandlers = {
    isGameOver: false,
    lastTime: 0, // Variable used in obstacleTimer().
    isBorderCollisionTrue: false, // Same thing but for testOutOfScreen.
    obstacleInterval: 5, // Variable that define the amount of seconds before a new obstacle spawn.
    isObjectCollisionTrue: false, // Boolean Variable to track when the function testCollision is activated.

    /** Every 5 seconds add 1 obstacle to the variable that track the amount of obstacle */
    obstacleTimer: function () {
        let time = display._timeInSec();
        let interval = time - this.lastTime;
        if (interval === 5) {
            this.lastTime = time;
            obstacle.currentNumber += 1;
        };
    },
    testObstacleCollision: function (indexObs) {
        let collisionDist = (cercle.size / 2) + (obstacle.width / 2);
        let posX = obstacle.array[indexObs]["posX"];
        let posY = obstacle.array[indexObs]["posY"];
        if (dist(cercle.posX, cercle.posY, posX, posY) < collisionDist) {
            c_fillColor = color_red; // Change the circle's color.
            this.isObjectCollisionTrue = true;
            this.isGameOver = true;
        }
        else {
            this.isObjectCollisionTrue = false;
            this.isGameOver = false;
        }
    },
    testBorderCollision: function () {
        let cborderX = (cercle.posX - cercle.size / 2); // Create variable with the coord that correspond to the circle's border and not the center.
        let cborderY = (cercle.posY - cercle.size / 2);
        let cborderXX = (cercle.posX + cercle.size / 2); // Same thing but for the other side of the circle.
        let cborderYY = (cercle.posY + cercle.size / 2);

        if (cborderX <= 2) {
            this.isBorderCollisionTrue = true;
            b_fillColor = color_red;
            c_strokeColor = color_red; // Change the color of the circle's border to red.
            this.isGameOver = true; // Variable that will be used by the stopLoop function.
        }
        if (cborderY <= 2) {
            this.isBorderCollisionTrue = true;
            b_fillColor = color_red;
            c_strokeColor = color_red;
            this.isGameOver = true;
        }
        if (cborderXX >= 636) {
            this.isBorderCollisionTrue = true;
            b_fillColor = color_red;
            c_strokeColor = color_red;
            this.isGameOver = true;
        }
        if (cborderYY >= 476) {
            this.isBorderCollisionTrue = true;
            b_fillColor = color_red;
            c_strokeColor = color_red;
            this.isGameOver = true;
        }
    },
    stopLoop: function () {
        if (this.isGameOver) { // don't need to use '=== true' cause the if condition by default will be fullfiled if the value of the variable is boolean true.
            noLoop();
        }
    }
};

/** --- Methods to be used frontend with socket.io --- */
const socketMethods = {
    /** Emit with promise and error handling */
    emitToServer: async function(event, arg1, arg2) {
        try {
            const response = await socket.timeout(5000).emitWithAck(event, arg1, arg2);
            console.log(response.status); 
        } catch (e) {
            console.error("Server did not respond in time !");
            alert("Server did not respond in time !");
        }
    },
    receiveFromServer: function(event) {
        socket.on(event, (arg1, callback) => {
            console.log(arg1);
            callback({status: 'Position received by client !'});
        });
    }
};

/** --- P5 EXECUTABLE --- */

function setup() {
    createCanvas(640, 480);
    background(169, 169, 169);
    textSize(40);
    textAlign(CENTER, CENTER);
    cercle.posX = random(50, 600);
    cercle.posY = random(50, 400);
    obstacle.directionHV = obstacle._randomMinusOneZero(); // Set directionHV to either -1 or 0 so the obstacle can either travel vertically or horizontally.
    color_red = color(255, 0, 0); // Variable that store colors.
    color_white = color(240, 240, 240);
    color_black = color(60, 60, 60);
    color_DarkGrey = color(47, 79, 79);
    c_fillColor = color_white;
    c_strokeColor = color_black;
    b_fillColor = color_DarkGrey;
    /** Create the obstacle objects and push them in obstacle array */
    obstacle.pushInArray();
};

function draw() {
    /** Set background color */
    background(169, 169, 169);
    /** To prevent the obstacle from being erased when the game end */
    for (let i = 0; i <= obstacle.currentNumber; i++) {
        obstacleIndex = i;
        display.obstacle(obstacleIndex);
    };
    /** Test if the circle is colliding with the border */
    eventHandlers.testBorderCollision();
    /** Increase nb of obstacle every 5 seconds */
    eventHandlers.obstacleTimer();
    /** Display the circle, border, timer and score upon death */
    display.cercle();
    display.canvasBorder();
    display.timer();
    display.score();
    /** Update circle position */
    positionUpdate.cercle();
    /** Send circle position to the server */
    // socketMethods.emitToServer('playerPosition', cercle.posX, cercle.posY);
    /** Receive positions of other players */
    // socketMethods.receiveFromServer('playersPosition');
    /** Stop the loop upon death */
    eventHandlers.stopLoop();
    /** Loop to execute certains functions to a certain number of obstacle objects in an array */
    for (let i = 0; i <= obstacle.currentNumber; i++) {
        obstacleIndex = i;
        eventHandlers.testObstacleCollision(obstacleIndex);
        if (eventHandlers.isObjectCollisionTrue === true) {
            display.obstacle(obstacleIndex);
            break
        };
        display.obstacle(obstacleIndex);
        positionUpdate.obstacle(obstacleIndex);
    };
};

socketMethods.emitToServer('playerPosition', cercle.posX, cercle.posY);

socketMethods.receiveFromServer('playerPosition');