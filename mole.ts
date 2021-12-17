import { MoleType } from "./config";
import { Game } from "./game";
import { MoleHill } from "./mole-hill";

interface HitBox {
  x1: number,
  x2: number,
  y1: number,
  y2: number
}

export class Mole {
  x: number;
  y: number;
  width: number;

  height: number = 0;
  maxHeight: number;
  moleHillHeight: number;

  crawlOutTime: number;

  time: number = 0;
  maxTime: number;

  moleConfig: MoleType;

  hitBoxWidth: number;
  hitBoxX: number;

  isHit: boolean = false;
  isMissed: boolean = false;

  img: HTMLImageElement | undefined = undefined;
  hitImg: HTMLImageElement | undefined = undefined;
  missImg: HTMLImageElement | undefined = undefined;

  constructor(config: MoleType, moleHill: MoleHill, speedIncrease: number, img?: HTMLImageElement){
    this.moleConfig = config;
    this.crawlOutTime = config.crawlOutTime * speedIncrease;
    this.maxTime = config.time * speedIncrease;
    this.y = moleHill.y;

    this.hitBoxWidth = moleHill.width;
    this.hitBoxX = moleHill.x;

    this.moleHillHeight = moleHill.height;

    if(img){
      this.img = img;
      this.width = img.naturalWidth / moleHill.aspectRatio;
      this.maxHeight = img.naturalHeight / moleHill.aspectRatio;
      this.x = moleHill.x + (moleHill.width - this.width) / 2;
    } else {
      this.maxHeight = moleHill.width;
      this.x = moleHill.x + moleHill.width / 4;
      this.width = moleHill.width / 2;
    }
  }

  hit(){
    if(this.isHit === true){
      return;
    }
    this.isHit = true;
    if(this.moleConfig.hit === undefined){
      return;
    }
    switch(this.moleConfig.hit.type){
      case 'live': {
        if(Game.lives !== undefined)
          Game.lives += this.moleConfig.hit.amount;
        break;
      }
      case 'point': {
        Game.points += this.moleConfig.hit.amount;
        console.log(Game.points);
        break;
      }
    }
  }

  getHitBox(): HitBox {
    return {
      x1: Math.floor(this.hitBoxX - 2),
      x2: Math.floor(this.hitBoxX + this.hitBoxWidth + 2),
      y1: Math.floor(this.y - 2),
      y2: Math.floor(this.y + this.height + 2)
    }
  }

  miss(){
    if(this.isMissed){
      return;
    }
    this.isMissed = true;
    if(this.moleConfig.miss === undefined){
      return;
    }
    switch(this.moleConfig.miss.type){
      case 'live': {
        if(Game.lives !== undefined && Game.lives !== 0)
          Game.lives += this.moleConfig.miss.amount;
        break;
      }
      case 'point': {
        Game.points += this.moleConfig.miss.amount;
        break;
      }
    }
  }

  render(){
    if(this.isHit){
      this.height -= this.maxHeight / (20);
      if(this.height < 0){
        this.height = 0;
      }
    } else {
      if(this.height < this.maxHeight && this.time < this.maxTime){
        this.height += this.maxHeight / (this.crawlOutTime / (1000 /Game.frameRate));
      } else if(this.time >= this.maxTime){
        this.height -= this.maxHeight / (this.crawlOutTime / (1000 / Game.frameRate));
        if(this.height < 0){
          this.height = 0;
        }
      } else {
        this.time += 1000 / Game.frameRate;
      }

      
    }

    if(this.img){
      Game.drawImage(this.img, this.x, this.y, this.width, this.height, this.isHit ? "brightness(0%)" : undefined, this.height / this.maxHeight * 100);
    } else {
      Game.drawShape(this.isHit ? "red" : this.moleConfig.color, this.x, this.y, this.width, this.height);
    }
  }

  update(){
    if (this.time >= this.maxTime && this.height <= this.moleHillHeight && this.isMissed === false && this.isHit == false){
      this.miss();
    }
  }
}
