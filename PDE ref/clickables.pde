class Clickables {

  //hoverCursor img and its boolean
  PImage hoverCursor;
  boolean hovered;

  //Properties
  PImage img; //Clickable image
  float x;
  float y;
  float w;
  float h;

  //Constructor to pass vars and load cursor
  Clickables(PImage img, float x, float y, float w, float h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hovered = false;
    hoverCursor = loadImage("assets/gui/hoverCursor.png");
  }

  //Display func
  void display() {
    image(img, x, y, w, h);
  }

  //Check if hovering
  boolean isHovered() {
    return mouseX > (x - w/2) && mouseX < (x + w/2) && mouseY > (y - h/2) && mouseY < (y + h/2);
  }

  //Apply necessary cursor
  void hoverCursor() {
    boolean isHovered = isHovered();
    if (isHovered && !hovered) {
      cursor(hoverCursor);
      hovered = true; //Somehow needed. else the cursor flickers between arrow and scope
    } else if (!isHovered && hovered) {
      cursor(ARROW);
      hovered = false; //Somehow needed. else the cursor flickers between arrow and scope
    }
  }

  //Boolean function to check if a clickable has been clicked
  boolean clicked() {
  return targetX > (x - w/2) && targetX < (x + w/2) && targetY > (y - h/2) && targetY < (y + h/2);
  }
}
