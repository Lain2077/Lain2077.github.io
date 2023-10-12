/*
 * Title: EDM4600 Travail final: Roomfolio
 
 * Author: Edo
 
 * Version: 1.0
 
 * Instructions: Feel free to explore my work! Walk around by clicking to where you want to go. There are some objects you can consult.
 
 * Project description: This is a revamp of my portfolio that i will implement to my website shortly. The concept is a room, in which you can explore the different fields of work im exploring.
 
 * Notes: LONG HOURS have been spent trying to figure out a way to implement a collision system for forbidden walking space smoothly to my already existing code.
 The solution I am opting with is one that implies restructuring too much for this submission on May 1st. More infos in the OBSTACLES class tab.
 */

import gifAnimation.*;
//---- PATHFINDER ----//////////////////////////////////////////
////////////////////////////////////////////////////////////////

import pathfinder.*;

boolean cantClick;
boolean pathed;

Graph gs;
PImage graphImage;
int start;
int end;
float nodeSize;

int graphNo = 0;
int algorithm;


int offX = 0, offY = 0;

boolean[] showOption = new boolean[3];

GraphNode[] gNodes, rNodes;
GraphEdge[] gEdges, exploredEdges;

// Pathfinder algorithm
IGraphSearch pathFinder;
// Used to indicate the start and end nodes as selected by the user.
GraphNode startNode, endNode;
boolean selectMode = false;

PImage backImage;

long time;

boolean drawingNodes = true;



float j;
float radius; // set the radius of the circle
float speed; // set the speed at which the circle moves
float x; // set the starting position of the circle to the first node in the route
float y;
float nextXNode;
float nextYNode;
float previousXNode;
float previousYNode;

//---- CHARACTER ----///////////////////////////////////////////
////////////////////////////////////////////////////////////////

//Character images (arrays + currentImg + framecount for anims)
PImage[] down = new PImage[3];
PImage[] up = new PImage[3];
PImage[] left = new PImage[3];
PImage[] right = new PImage[3];
PImage currentImg;
int frameCountMod; // for anims

//Character properties
Chara character; //Class var

float charX; //Character x
float charY; //Character y
float charW; //Character width
float charH; //Character height
float targetX; //x target
float targetY; //y target
float stepSize; // speed

//---- ROOM ASSETS ----/////////////////////////////////////////
////////////////////////////////////////////////////////////////

//Room img
PImage room;

//Clickables

//Gifs
Gif Cam;
Gif Vid;
Gif Comp;
Gif Help;

//Objects
Clickables cam;
Clickables vid;
Clickables comp;
Clickables help;

//Obstacles (TO REMOVE)

//Object and its img string (to load in class)
Obstacles bed;
String bedImg = "bed";

//Vars for managing collisions
boolean overWriting; //overWrite character movement main func
float nextMoveX; //To remove (more infos in obstacles class)
float nextMoveY; //To remove (more infos in obstacles class)


//---- WINDOW LAUNCHER ----/////////////////////////////////////
////////////////////////////////////////////////////////////////

Window window; //Object
int activeWindowNum; //Active window number
boolean justClosed; //Boolean to prevent moving when window opened

void setup() {
  cursor(ARROW);



  //fullScreen();

  //Canva properties
  imageMode(CENTER);
  rectMode(CENTER);
  frameRate(60);
  size(1920, 1080);
  stepSize = width/240; // speed
  noSmooth();

  //path finder init

  ellipseMode(CENTER);
  graphNo = 1;
  nodeSize = 16.0f;
  graphImage = loadImage("assets/grid.png");
  graphImage.resize(int(width*0.70), int(height*0.90));
  gs = new Graph();

  makeGraphFromBWimage(gs, graphImage, null, 30, 30, false);

  gNodes =  gs.getNodeArray();
  gEdges = gs.getAllEdgeArray();
  // Create a path finder object based on the algorithm
  pathFinder = makePathFinder(gs, 3);
  usePathFinder(pathFinder);
  //---- ROOM ----////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  room = loadImage("assets/room.png");


  //---- CLICKABLES ----//////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  //Camera (1:2)
  Cam = new Gif(this, "assets/clickables/cam.gif");
  Cam.play();
  cam = new Clickables(Cam, width*0.52, height*0.37, width/14.76923077, height/4.153846154);

  //TV (Square)
  Vid = new Gif(this, "assets/clickables/vid.gif");
  Vid.play();
  vid = new Clickables(Vid, width*0.24, height*0.38, width/10.6666666667, height/6);

  //Computer (1:2)
  Comp = new Gif(this, "assets/clickables/comp.gif");
  Comp.play();
  comp = new Clickables(Comp, width*0.77, height*0.30, width/14.7692307692, height/4.15384615385);

  //Help (Square)
  Help = new Gif(this, "assets/clickables/help.gif");
  Help.play();
  help = new Clickables(Help, width*0.78, height*0.86, width/14.7692307692, height/8.30769230769);

  //---- CHARACTER ----///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  //Properties to define before creation

  charW = width/25.6; //Define width
  charH = height/7.2; //Define height

  character = new Chara(charX, charY, charW, charH); //Create character

  //Rest of properties
  currentImg = down[0];
  charX = width/2; // starting x
  charY = height/2; // starting y
  targetX = width/2; // starting x
  targetY = height/2; // starting y

  //---- OBSTACLES (TO REMOVE) ----///////////////////////////////
  ////////////////////////////////////////////////////////////////

  bed = new Obstacles(bedImg, width*0.3295, height*0.72, width/3.83, height*0.39, character);

  //---- WINDOW LAUNCHER ----/////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  window = new Window(activeWindowNum);
}

float roomW;
float roomH;
void draw() {

  int frameCountMod = frameCount % 20; //frameCount var for anims


  //---- ASSETS GEN ----//////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  //background
  background(0);
  roomW = width*0.70;
  roomH = height*0.90;
  //room
  image(room, width/2, height/2, roomW, roomH);
  //image(graphImage,width/2, height/2 ,width*0.70, height*0.90);

  if (drawingNodes)
    drawNodes();

  if (selectMode) {
    stroke(0);
    strokeWeight(1.5f);
    if (endNode != null)
      line(startNode.xf(), startNode.yf(), endNode.xf(), endNode.yf());
  }

  //CLICKABLES DISPLAY + CURSOR
  cam.hoverCursor();
  cam.display();
  vid.hoverCursor();
  vid.display();
  comp.hoverCursor();
  comp.display();
  help.hoverCursor();
  help.display();

  //CHARACTER DISPLAY
  character.display();

  drawRoute(rNodes, color(200, 0, 0), 5.0f);
  
  //if (character.hasArrived() && !justClosed) {
  //    character.resetAnim();
  //    window.launcher();
  //    return;
  //}
  //println(rNodes.length);
  if (rNodes.length > 0) {
    // println(rNodes[rNodes.length-2].xf());
  }

  if (pathed == true) {
    println("pathed");

    // keep track of the current node the circle is on
    if (j <= rNodes.length) {
      fill(0, 255, 0); // set the fill color of the circle
      noStroke();
      println("filledd");
      
      if (rNodes.length > 1 && j <= rNodes.length) {
      previousXNode = int(rNodes[int(j) - 1].xf());
      previousYNode = int(rNodes[int(j) - 1].yf());
      // draw the circle
      nextXNode = int(rNodes[int(j)].xf());
      nextYNode = int(rNodes[int(j)].yf());
      
      }
      println("target:" + nextXNode, nextYNode);
      println(charX, charY);

      if (nextXNode < previousXNode) {
        character.moveLeftAnim(frameCountMod);
        charX -= stepSize;
        if (nextXNode > charX) {
          j+=1;
          println("new:" + j);
        }
      }
      // if target X right of charX, move right
      else if (nextXNode > previousXNode) {
        character.moveRightAnim(frameCountMod);
        charX += stepSize;
        if (nextXNode < charX) {
          j+=1;
          println("new:" + j);
        }
      }
      //if target Y is lower than rectangle Y
      else if (nextYNode > previousYNode) {
        character.moveDownAnim(frameCountMod);
        charY += stepSize;
        if (nextYNode < charY + charH/2) {
          j+=1;
          println("new:" + j);
        }
      }
      // if the target Y is higher than charY, move up
      else if (nextYNode < previousYNode) {
        character.moveUpAnim(frameCountMod);
        charY -= stepSize;
        if (nextYNode > charY + charH/2) {
          j+=1;
          println("new:" + j);
        }
      }
    } 
    
   if (j >= rNodes.length) {
   pathed = false;
   }
  }
  //OBSTACLES DISPLAY + OVERRIDDE FUNC (TO REMOVE)
  //bed.display();


  //---- CHARACTER MOVEMENT ----//////////////////////////////////
  ////////////////////////////////////////////////////////////////

  //ANIM RESET + WINDOW LAUNCHER UPON ARRIVAL
  if (character.hasArrived() & justClosed == false) {
    character.resetAnim();
    window.launcher();
    return;
  }
}

void mousePressed() {

  //REDEFINE TARGET IF NO WINDOWS ARE OPENED
  if (activeWindowNum == 0) {
    justClosed = false; //Remove true value to justClosed boolean
    targetX = mouseX; //Redefine targetX
    targetY = mouseY; //Redefine targetY
    // Only consider a mouse press if over the map
    //if(mouseX < 400 && mouseY < 400){
    startNode = gs.getNodeAt(charX, charY+charH/2, 0, 60.0f);
    
    if (comp.clicked()) {
    println("comp clicked");
    //endNode = gs.getNodeAt(width/2 + roomW*0.39, height/2, 0, 30.0f);
    endNode = gs.getNodeAt(comp.x, comp.y*1.9, 0, 20.0f);
    } else {
    endNode = gs.getNodeAt(mouseX, mouseY, 0, 25.0f);
    }
    println(endNode);
    if (endNode!= null && startNode != null) {
      println(startNode);
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
    }
    //}

    //println("Target:" + targetX + "," + targetY); //For debugging
  }
}

void usePathFinder(IGraphSearch pf) {
  time = System.nanoTime();
  pf.search(start, end, true);
  time = System.nanoTime() - time;
  rNodes = pf.getRoute();
  exploredEdges = pf.getExaminedEdges();
}


IGraphSearch makePathFinder(Graph graph, int pathFinder) {
  IGraphSearch pf = null;
  pf = new GraphSearch_Astar(gs, new AshCrowFlight(0.1));
  return pf;
}

//FOR OPTIONS
void drawNodes() {
  pushStyle();
  noStroke();
  fill(255, 0, 255, 72);
  for (GraphNode node : gNodes)
    ellipse(node.xf(), node.yf(), nodeSize, nodeSize);
  popStyle();
}

void drawRoute(GraphNode[] r, int lineCol, float sWeight) {
  if (r.length >= 2) {
    pushStyle();
    stroke(lineCol);
    strokeWeight(sWeight);
    noFill();
    for (int i = 1; i < r.length; i++)
      line(r[i-1].xf(), r[i-1].yf(), r[i].xf(), r[i].yf());
    //Route start
    strokeWeight(2.0f);
    stroke(0, 0, 160);
    fill(0, 0, 255);
    ellipse(r[0].xf(), r[0].yf(), nodeSize, nodeSize);
    // Route end node
    stroke(160, 0, 0);
    fill(255, 0, 0);
    ellipse(r[r.length-1].xf(), r[r.length-1].yf(), nodeSize, nodeSize);
    popStyle();
  }
}

/**
 * Create a tiled graph from an image.
 * This method will accept 1 or 2 images to create a tiled graph (a 2D rectangualr
 * arrangements of nodes.
 *
 */
void makeGraphFromBWimage(Graph g, PImage backImg, PImage costImg, int tilesX, int tilesY, boolean allowDiagonals) {
  int dx = backImg.width / tilesX;
  int dy = backImg.height / tilesY;
  int sx = dx / 2, sy = dy / 2;
  // use deltaX to avoid horizontal wrap around edges
  int deltaX = tilesX + 1; // must be > tilesX

  float hCost = dx, vCost = dy, dCost = sqrt(dx*dx + dy*dy);
  float cost = 0;
  int px, py, nodeID, col;
  int graphWidth = tilesX * dx;
  int graphHeight = tilesY * dy;
  int offsetX = (width - graphWidth) / 2;
  int offsetY = (height - graphHeight) / 2;
  GraphNode aNode;

  py = sy;
  for (int y = 0; y < tilesY; y++) {
    nodeID = deltaX * y + deltaX;
    px = sx;
    for (int x = 0; x < tilesX; x++) {
      // Calculate the cost
      if (costImg == null) {
        col = backImg.get(px, py) & 0xFF;
        println(backImg.get(px, py));
        cost = 1;
      } else {
        col = costImg.get(px, py) & 0xFF;
        cost = 1.0f + (256.0f - col)/ 35.0f;
      }
      // If col is not black then create the node and edges
      if (col != 0) {
        aNode = new GraphNode(nodeID, px + width/6.7, py + height/18);
        g.addNode(aNode);
        if (x > 0) {
          g.addEdge(nodeID, nodeID - 1, hCost * cost);
          //if(allowDiagonals){
          //  g.addEdge(nodeID, nodeID - deltaX - 1, dCost * cost);
          //  g.addEdge(nodeID, nodeID + deltaX - 1, dCost * cost);
          //}
        }
        if (x < tilesX -1) {
          g.addEdge(nodeID, nodeID + 1, hCost * cost);
          //if(allowDiagonals){
          //  g.addEdge(nodeID, nodeID - deltaX + 1, dCost * cost);
          //  g.addEdge(nodeID, nodeID + deltaX + 1, dCost * cost);
          //}
        }
        if (y > 0)
          g.addEdge(nodeID, nodeID - deltaX, vCost * cost);
        if (y < tilesY - 1)
          g.addEdge(nodeID, nodeID + deltaX, vCost * cost);
      }
      px += dx;
      nodeID++;
    }
    py += dy;
  }
}

//void makeNode(String s, Graph g){
//  int nodeID;
//  float x,y, z = 0;
//  String part[] = split(s, " ");
//  if(part.length >= 3){
//    nodeID = Integer.parseInt(part[0]);
//    x = Float.parseFloat(part[1]);
//    y = Float.parseFloat(part[2]);
//    if(part.length >=4)
//      z = Float.parseFloat(part[3]);
//    g.addNode(new GraphNode(nodeID, x, y, z));
//  }
//}
