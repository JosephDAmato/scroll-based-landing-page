/**
 * this feature locks the camera to a subtle normalized x,y of the mouse. We take the mouse position and normalize it between .5 & -.5 to match our canvas' Cartesian grid
 *
 * call ParallaXY and pass it the group you would like to have a subtle side to side and up and down shift.
 * call ParallaXY.tick() so the position is updated on each frame
 */

import { Vector2 } from "three";
class ParallaxXY {
  constructor(group) {
    // set mouse properties
    this.mouse = new Vector2();
    this.mouse.x = 0;
    this.mouse.y = 0;
    // update the mouse
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX / window.innerWidth - 0.5;
      this.mouse.y = e.clientY / window.innerHeight - 0.5;
    });
    // set group to add movement effect
    this.group = group;
  }

  tick() {
    let parallaxX = this.mouse.x;
    this.group.position.x += parallaxX - this.group.position.x;
    let parallaxY = this.mouse.y;
    this.group.position.y += parallaxY - this.group.position.y;
  }
}

export { ParallaxXY };
