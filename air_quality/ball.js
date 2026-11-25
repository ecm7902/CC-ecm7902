class Ball{
    constructor(x, y, r){
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.r = r;

        this.ctx = drawingContext;
        this.c = this.getColor();
}
    display(){
        let gradient = drawingContext.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.r);
          


        let r = red(this.c);
        let g = green(this.c);
        let b = blue(this.c);

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        // console.log('Gradient Color Stops:', gradient);



        this.ctx.fillStyle = gradient;
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);

    }
    move(){
    this.pos.add(this.vel);
    
    if (this.pos.x > width) {
      this.vel.x *= -1;
      this.pos.x = width;
    } else if (this.pos.x < 0) {
      this.vel.x *= -1;
      this.pos.x = 0;
    }
    if (this.pos.y > height) {
      this.vel.y *= -1;
      this.pos.y = height;
    } else if (this.pos.y < 0) {
      this.vel.y *= -1;
      this.pos.y = 0;
    }
    }

    

    getColor() {

      if (pm2_5_value < 9) {

        return random(good);
      }
      if (pm2_5_value >= 9 && pm2_5_value < 35.5) {
        return random(moderate);
      }
      if (pm2_5_value >= 35.5 && pm2_5_value < 55.5) {
        return random(unhealthySensitive);
      }
      if (pm2_5_value >= 55.5 && pm2_5_value < 125.5) {
        return random(unhealthy);
      }
      if (pm2_5_value >= 125.5 && pm2_5_value < 225.5) {
        return random(veryUnhealthy);
      }
      if (pm2_5_value >= 225.5) {
        return random(hazardous);
      }

      // console.log('Color:', color);
      return color(r, g, b);

  }
}       

