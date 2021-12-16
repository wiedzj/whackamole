import { Game } from "./game";
import { Mole } from "./mole";

export class MoleHill {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number = 0;

  mole: Mole | null = null;
  image: HTMLImageElement | null = null;;

  constructor(x: number, y: number, width: number, height: number, image: HTMLImageElement | undefined){
    this.x = x;
    this.y = y;

    this.width = width;

    if(image){
      this.aspectRatio = image.naturalWidth / width;
      this.height = image.naturalHeight / this.aspectRatio;
      this.image = image;
    } else {
      this.height = height;
    }

  }

  render(){
    if(this.image){
      Game.drawImage(this.image, this.x, this.y, this.width, this.height)
    } else {
      Game.drawShape("black", this.x, this.y, this.width, this.height);
    }
  }
}
