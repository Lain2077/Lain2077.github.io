/*
 * Title: EDM4600 Travail final: Roomfolio
 
 * Author: Edo
 
 * Version: 1.0
 
 * Instructions: Feel free to explore my work! Walk around by clicking to where you want to go. There are some objects you can consult.
 
 * Project description: This is a revamp of my portfolio that i will implement to my website shortly. The concept is a room, in which you can explore the different fields of work im exploring.
 
 * Notes: LONG HOURS have been spent trying to figure out a way to implement a collision system for forbidden walking space smoothly to my already existing code.
 The solution I am opting with is one that implies restructuring too much for this submission on May 1st. More infos in the OBSTACLES class tab.
 */
// [processing-p5-convert] import gifAnimation.*;
//---- PATHFINDER ----//////////////////////////////////////////
////////////////////////////////////////////////////////////////
// [processing-p5-convert] import pathfinder.*;
let cantClick;
let pathed;
let gs;
let graphImage;
let start;
let end;
let nodeSize;
let graphNo = 0;
let algorithm;
let offX = 0,
    offY = 0;
let showOption = new Array(3);
let gNodes, rNodes;
let gEdges, exploredEdges; // Pathfinder algorithm
let pathFinder; // Used to indicate the start and end nodes as selected by the user.
let startNode, endNode;
let selectMode = false;
let backImage;
let time;
let drawingNodes = true;
let j;
let radius; // set the radius of the circle
let speed; // set the speed at which the circle moves
let x; // set the starting position of the circle to the first node in the route
let y;
let nextXNode;
let nextYNode;
let previousXNode;
let previousYNode; //---- CHARACTER ----///////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Character images (arrays + currentImg + framecount for anims)
let down = new Array(3);
let up = new Array(3);
let left = new Array(3);
let right = new Array(3);
let currentImg;
let frameCountMod; // for anims
//Character properties
let character; //Class var
let charX; //Character x
let charY; //Character y
let charW; //Character width
let charH; //Character height
let targetX; //x target
let targetY; //y target
let stepSize; // speed
//---- ROOM ASSETS ----/////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Room img
let room; //Clickables
//Gifs
let Cam;
let Vid;
let Comp;
let Help; //Objects
let cam;
let vid;
let comp;
let help; //Obstacles (TO REMOVE)
//Object and its img string (to load in class)
let bed;
let bedImg = "bed"; //Vars for managing collisions
let overWriting; //overWrite character movement main func
let nextMoveX; //To remove (more infos in obstacles class)
let nextMoveY; //To remove (more infos in obstacles class)
//---- WINDOW LAUNCHER ----/////////////////////////////////////
////////////////////////////////////////////////////////////////
let window; //Object
let activeWindowNum; //Active window number
let justClosed; //Boolean to prevent moving when window opened
function setup() {
    cursor(ARROW); //fullScreen();
    //Canva properties
    imageMode(CENTER);
    rectMode(CENTER);
    frameRate(60);
    createCanvas(1920, 1080);
    stepSize = width / 240; // speed
    noSmooth(); //path finder init
    ellipseMode(CENTER);
    graphNo = 1;
    nodeSize = 16.0;
    graphImage.resize(int(width * 0.7), int(height * 0.9));
    gs = new Graph();
    makeGraphFromBWimage(gs, graphImage, null, 30, 30, false);
    gNodes = gs.getNodeArray();
    gEdges = gs.getAllEdgeArray(); // Create a path finder object based on the algorithm
    pathFinder = makePathFinder(gs, 3);
    usePathFinder(pathFinder); //---- ROOM ----////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //---- CLICKABLES ----//////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //Camera (1:2)
    Cam = new Gif(this, "assets/clickables/cam.gif");
    Cam.play();
    cam = new Clickables(
        Cam,
        width * 0.52,
        height * 0.37,
        width / 14.76923077,
        height / 4.153846154
    ); //TV (Square)
    Vid = new Gif(this, "assets/clickables/vid.gif");
    Vid.play();
    vid = new Clickables(
        Vid,
        width * 0.24,
        height * 0.38,
        width / 10.6666666667,
        height / 6
    ); //Computer (1:2)
    Comp = new Gif(this, "assets/clickables/comp.gif");
    Comp.play();
    comp = new Clickables(
        Comp,
        width * 0.77,
        height * 0.3,
        width / 14.7692307692,
        height / 4.15384615385
    ); //Help (Square)
    Help = new Gif(this, "assets/clickables/help.gif");
    Help.play();
    help = new Clickables(
        Help,
        width * 0.78,
        height * 0.86,
        width / 14.7692307692,
        height / 8.30769230769
    ); //---- CHARACTER ----///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //Properties to define before creation
    charW = width / 25.6; //Define width
    charH = height / 7.2; //Define height
    character = new Chara(charX, charY, charW, charH); //Create character
    //Rest of properties
    currentImg = down[0];
    charX = width / 2; // starting x
    charY = height / 2; // starting y
    targetX = width / 2; // starting x
    targetY = height / 2; // starting y
    //---- OBSTACLES (TO REMOVE) ----///////////////////////////////
    ////////////////////////////////////////////////////////////////
    bed = new Obstacles(
        bedImg,
        width * 0.3295,
        height * 0.72,
        width / 3.83,
        height * 0.39,
        character
    ); //---- WINDOW LAUNCHER ----/////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    window = new Window(activeWindowNum);
}
function preload() {
    graphImage = loadImage("assets/grid.png");
    room = loadImage("assets/room.png");
}
let roomW;
let roomH;
function draw() {
    let frameCountMod = frameCount % 20; //frameCount var for anims
    //---- ASSETS GEN ----//////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //background
    background(0);
    roomW = width * 0.7;
    roomH               = height * 0.9; //room
    image(room, width / 2, height / 2, roomW, roomH); //image(graphImage,width/2, height/2 ,width*0.70, height*0.90);
    if (drawingNodes) drawNodes();
    if (selectMode) {
        stroke(0);
        strokeWeight(1.5);
        if (endNode != null)
            line(startNode.xf(), startNode.yf(), endNode.xf(), endNode.yf());
    } //CLICKABLES DISPLAY + CURSOR
    cam.hoverCursor();
    cam.display();
    vid.hoverCursor();
    vid.display();
    comp.hoverCursor();
    comp.display();
    help.hoverCursor();
    help.display(); //CHARACTER DISPLAY
    character.display();
    drawRoute(rNodes, color(200, 0, 0), 5.0); //if (character.hasArrived() && !justClosed) {
    //    character.resetAnim();
    //    window.launcher();
    //    return;
    //}
    //println(rNodes.length);
    if (rNodes.length > 0) {
        // println(rNodes[rNodes.length-2].xf());
    }
    if (pathed == true) {
        console.log("pathed"); // keep track of the current node the circle is on
        if (j <= rNodes.length) {
            fill(0, 255, 0); // set the fill color of the circle
            noStroke();
            console.log("filledd");
            if (rNodes.length > 1 && j <= rNodes.length) {
                previousXNode = int(rNodes[int(j) - 1].xf());
                previousYNode = int(rNodes[int(j) - 1].yf()); // draw the circle
                nextXNode = int(rNodes[int(j)].xf());
                nextYNode = int(rNodes[int(j)].yf());
            }
            console.log("target:" + nextXNode, nextYNode);
            console.log(charX, charY);
            if (nextXNode < previousXNode) {
                character.moveLeftAnim(frameCountMod);
                charX -= stepSize;
                if (nextXNode > charX) {
                    j += 1;
                    console.log("new:" + j);
                }
            } // if target X right of charX, move right
            else if (nextXNode > previousXNode) {
                character.moveRightAnim(frameCountMod);
                charX += stepSize;
                if (nextXNode < charX) {
                    j += 1;
                    console.log("new:" + j);
                }
            } //if target Y is lower than rectangle Y
            else if (nextYNode > previousYNode) {
                character.moveDownAnim(frameCountMod);
                charY += stepSize;
                if (nextYNode < charY + charH / 2) {
                    j += 1;
                    console.log("new:" + j);
                }
            } // if the target Y is higher than charY, move up
            else if (nextYNode < previousYNode) {
                character.moveUpAnim(frameCountMod);
                charY -= stepSize;
                if (nextYNode > charY + charH / 2) {
                    j += 1;
                    console.log("new:" + j);
                }
            }
        }
        if (j >= rNodes.length) {
            pathed = false;
        }
    } //OBSTACLES DISPLAY + OVERRIDDE FUNC (TO REMOVE)
    //bed.display();
    //---- CHARACTER MOVEMENT ----//////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //ANIM RESET + WINDOW LAUNCHER UPON ARRIVAL
    if (character.hasArrived() & (justClosed == false)) {
        character.resetAnim();
        window.launcher();
        return;
    }
}
function mousePressed() {
    //REDEFINE TARGET IF NO WINDOWS ARE OPENED
    if (activeWindowNum == 0) {
        justClosed = false; //Remove true value to justClosed boolean
        targetX = mouseX; //Redefine targetX
        targetY = mouseY; //Redefine targetY
        // Only consider a mouse press if over the map
        //if(mouseX < 400 && mouseY < 400){
        startNode = gs.getNodeAt(charX, charY + charH / 2, 0, 60.0);
        if (comp.clicked()) {
            console.log("comp clicked"); //endNode = gs.getNodeAt(width/2 + roomW*0.39, height/2, 0, 30.0f);
            endNode = gs.getNodeAt(comp.x, comp.y * 1.9, 0, 20.0);
        } else {
            endNode = gs.getNodeAt(mouseX, mouseY, 0, 25.0);
        }
        console.log(endNode);
        if (endNode != null && startNode != null) {
            console.log(startNode);
            start = startNode.id();
            end = endNode.id();
            usePathFinder(pathFinder);
            pathed = true;
            j = 1;
            radius = 20; // set the radius of the circle
            speed = 2.0; // set the speed at which the circle moves
            x = rNodes[0].xf(); // set the starting position of the circle to the first node in the route
            y = rNodes[0].yf();
            startNode = null;
            endNode = null;
        } //}
        //println("Target:" + targetX + "," + targetY); //For debugging
    }
}
function usePathFinder(pf) {
    time = System.nanoTime();
    pf.search(start, end, true);
    time = System.nanoTime() - time;
    rNodes = pf.getRoute();
    exploredEdges = pf.getExaminedEdges();
}
function makePathFinder(graph, pathFinder) {
    let pf = null;
    pf = new GraphSearch_Astar(gs, new AshCrowFlight(0.1));
    return pf;
} //FOR OPTIONS
function drawNodes() {
    pushStyle();
    noStroke();
    fill(255, 0, 255, 72);
    for (let node of gNodes) ellipse(node.xf(), node.yf(), nodeSize, nodeSize);
    popStyle();
}
function drawRoute(r, lineCol, sWeight) {
    if (r.length >= 2) {
        pushStyle();
        stroke(lineCol);
        strokeWeight(sWeight);
        noFill();
        for (let i = 1; i < r.length; i++)
            line(r[i - 1].xf(), r[i - 1].yf(), r[i].xf(), r[i].yf()); //Route start
        strokeWeight(2.0);
        stroke(0, 0, 160);
        fill(0, 0, 255);
        ellipse(r[0].xf(), r[0].yf(), nodeSize, nodeSize); // Route end node
        stroke(160, 0, 0);
        fill(255, 0, 0);
        ellipse(r[r.length - 1].xf(), r[r.length - 1].yf(), nodeSize, nodeSize);
        popStyle();
    }
}
/**
 * Create a tiled graph from an image.
 * This method will accept 1 or 2 images to create a tiled graph (a 2D rectangualr
 * arrangements of nodes.
 *
 */
function makeGraphFromBWimage(
    g,
    backImg,
    costImg,
    tilesX,
    tilesY,
    allowDiagonals
) {
    let dx = backImg.width / tilesX;
    let dy = backImg.height / tilesY;
    let sx = dx / 2,
        sy = dy / 2; // use deltaX to avoid horizontal wrap around edges
    let deltaX = tilesX + 1; // must be > tilesX
    let hCost = dx,
        vCost = dy,
        dCost = sqrt(dx * dx + dy * dy);
    let cost = 0;
    let px, py, nodeID, col;
    let graphWidth = tilesX * dx;
    let graphHeight = tilesY * dy;
    let offsetX = (width - graphWidth) / 2;
    let offsetY = (height - graphHeight) / 2;
    let aNode;
    py = sy;
    for (let y = 0; y < tilesY; y++) {
        nodeID = deltaX * y + deltaX;
        px = sx;
        for (let x = 0; x < tilesX; x++) {
            // Calculate the cost
            if (costImg == null) {
                col = backImg.get(px, py) & 0xff;
                console.log(backImg.get(px, py));
                cost = 1;
            } else {
                col = costImg.get(px, py) & 0xff;
                cost = 1.0 + (256.0 - col) / 35.0;
            } // If col is not black then create the node and edges
            if (col != 0) {
                aNode = new GraphNode(
                    nodeID,
                    px + width / 6.7,
                    py + height / 18
                );
                g.addNode(aNode);
                if (x > 0) {
                    g.addEdge(nodeID, nodeID - 1, hCost * cost); //if(allowDiagonals){
                    //  g.addEdge(nodeID, nodeID - deltaX - 1, dCost * cost);
                    //  g.addEdge(nodeID, nodeID + deltaX - 1, dCost * cost);
                    //}
                }
                if (x < tilesX - 1) {
                    g.addEdge(nodeID, nodeID + 1, hCost * cost);
                }
                if (y > 0) g.addEdge(nodeID, nodeID - deltaX, vCost * cost);
                if (y < tilesY - 1)
                    g.addEdge(nodeID, nodeID + deltaX, vCost * cost);
            }
            px += dx;
            nodeID++;
        }
        py += dy;
    }
}
