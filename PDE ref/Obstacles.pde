// LEFT THIS CLASS AND CONCERNED OBJECT (BED) FOR CONSULTATION PURPOSES ONLY.
// Spent way too much time on this collision implementation to conclude I will just implement a PathFinder algorithm later.
// Implementing a PathFinder algorithm implies revamping the whole movement structure of my character.
// The problems I faced here would've been similar for an anti-click function (Outside map, on elevated objects etc) and are fixable with a PathFinder.
// Therefore please don't make this section weight too much on correction :D

class Obstacles {

  //Properties
  float x;
  float y;
  float w;
  float h;
  String imgname;
  PImage img;

  //Passing character to control it
  Chara character;

  //Constructor to pass vars and load obstacle img
  Obstacles(String imgname, float x, float y, float w, float h, Chara character) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.character = character;
    img = loadImage("assets/deco/" + imgname + ".png");
  }

  //Display function
  void display() {
    image(img, x, y, w, h);
  }
}
