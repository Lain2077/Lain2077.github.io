class Chara {

  //Properties
  float x;
  float y;
  float w;
  float h;

  //Constructor to pass vars and load character imgs
  Chara(float x, float y, float w, float h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    //down imgs
    down[0] = loadImage("assets/char/down0.png");
    down[1] = loadImage("assets/char/down1.png");
    down[2] = loadImage("assets/char/down2.png");

    //up igms
    up[0] = loadImage("assets/char/up0.png");
    up[1] = loadImage("assets/char/up1.png");
    up[2] = loadImage("assets/char/up2.png");

    //left imgs
    left[0] = loadImage("assets/char/left0.png");
    left[1] = loadImage("assets/char/left1.png");
    left[2] = loadImage("assets/char/left2.png");

    //right imgs
    right[0] = loadImage("assets/char/right0.png");
    right[1] = loadImage("assets/char/right1.png");
    right[2] = loadImage("assets/char/right2.png");
  }

  //Display func
  void display() {
    image(currentImg, charX, charY, w, h);
  }

  //Anim based on frameCount for DOWN
  void moveDownAnim(int frameCountMod) {
    if (frameCountMod == 0) {
      currentImg = down[1];
    } else if (frameCountMod == 5) {
      currentImg = down[0];
    } else if (frameCountMod == 10) {
      currentImg = down[2];
    } else if (frameCountMod == 15) {
      currentImg = down[0];
    }

    //Movement down
    //nextMoveY = charY + min(stepSize, targetY - charY);
    //charY = nextMoveY; //Implemented a nextMove structure for obstacles collision. Failed attempt.
    //charY += min(stepSize, targetY - charY); (Keeping this line for further adjustments)
  }

  //Anim based on frameCount for LEFT
  void moveLeftAnim(int frameCountMod) {
    if (frameCountMod == 0) {
      currentImg = left[1];
    } else if (frameCountMod == 5) {
      currentImg = left[0];
    } else if (frameCountMod == 10) {
      currentImg = left[2];
    } else if (frameCountMod == 15) {
      currentImg = left[0];
     }

    //Movement left
    //nextMoveX = charX - min(stepSize, charX - targetX);
    //charX = nextMoveX;
    //charX -= min(stepSize, charX - targetX; (Keeping this line for further adjustments)
  }

  //Anim based on frameCount for RIGHT
  void moveRightAnim(int frameCountMod) {
    if (frameCountMod == 0) {
      currentImg = right[1];
    } else if (frameCountMod == 5) {
      currentImg = right[0];
    } else if (frameCountMod == 10) {
      currentImg = right[2];
    } else if (frameCountMod == 15) {
      currentImg = right[0];
    }

    //Movement right
    //nextMoveX = charX + min(stepSize, targetX - charX);
    //charX = nextMoveX;
    //charX += min(stepSize, targetX - charX); (Keeping this line for further adjustments)
  }

  //Anim based on frameCount for UP
  void moveUpAnim(int frameCountMod) {
    if (frameCountMod == 0) {
      currentImg = up[1];
    } else if (frameCountMod == 5) {
      currentImg = up[0];
    } else if (frameCountMod == 10) {
      currentImg = up[2];
    } else if (frameCountMod == 15) {
      currentImg = up[0];
    }

    //Movement up
    //nextMoveY = charY - min(stepSize, charY - targetY);
    //charY = nextMoveY;
    //charY -= min(stepSize, charY - targetY); (Keeping this line for further adjustments)
  }

  //Boolean to determine if character has arrived its destination
  boolean hasArrived() {
    return j>= rNodes.length;
  }

  //Reset animation to make character idle when idle
  void resetAnim() {
    if (currentImg == down[1] | currentImg == down[2]) {
      currentImg = down[0];
    } else if (currentImg == up[1] | currentImg == up[2]) {
      currentImg = up[0];
    } else if (currentImg == left[1] | currentImg == left[2]) {
      currentImg = left[0];
    } else if (currentImg == right[1] | currentImg == right[2]) {
      currentImg = right[0];
    }
  }
}
