import { config, Config } from "./config";
import { Grid } from "./grid";
import { MoleSpawner } from "./mole-spawner";
import { PlayAndWinPlatform } from "./PlayAndWinPlatform";

export interface Image {
  name: string,
  img: HTMLImageElement | undefined
}

export class Game {
  static ctx: CanvasRenderingContext2D;
  static width: number;
  static height: number;

  static points: number = 0;
  static lives: number | undefined = undefined;
  static timeLeft: number | undefined = undefined;

  gameLoop: number;

  time: number = 0;

  tapToPlay: boolean = true;
  playing: boolean = false;
  gameOver: boolean = false;
  finalScore: number | null = null;

  config: Config;

  grid: Grid;
  moleSpawner: MoleSpawner;

  images: Image[] = [];

  skyImage: ImageBitmap | null = null;
  floorImage: HTMLImageElement | undefined = undefined;

  pew: PlayAndWinPlatform;

  imageTimer: number = 0;

  static frameRate: number = 100;

  constructor(){
    this.getSettingsFromURI(location.search);

    document.addEventListener('DOMContentLoaded', () => { this.preload(); });
    window.addEventListener('resize', ()=> {
      Game.height = window.innerHeight;
      Game.width = window.innerWidth;
      const canvas = document.getElementById("canvas");
      Game.ctx = canvas.getContext("2d");
      Game.ctx.canvas.height = Game.height;
      Game.ctx.canvas.width = Game.width;
      });
  }

  restart(){
    clearInterval(this.gameLoop);
    this.time = 0;
    this.moleSpawner.maxMoles = this.config.maxMoles;
    this.moleSpawner.speedMultiplyer = 1;
    console.log(this.moleSpawner.speedMultiplyer);
    Game.lives = this.config.lives;
    Game.timeLeft = this.config.time;
    Game.points = 0;
    this.finalScore = null;
    this.gameOver = false;
    this.playing = false;
    this.tapToPlay = true;
    this.pew.ready();
  }


  public play(){
    this.pew.gamestarted();
    this.gameLoop = setInterval(()=>{
      this.render();
      if(this.playing && !this.gameOver)
      this.update();
    }, 1000 / Game.frameRate);
  }

  preload(){
    if(this.config.sprites === undefined){
      return;
    }
    for(const [key, value] of Object.entries(this.config.sprites)){
      let img = new Image();
      img.onload = () => {
        this.images.push({
          img: img,
          name: key
        })
        this.imageReady();
      }
      img.onerror = () => {
        this.images.push({
          name: key,
          img: undefined
        });
        this.imageReady();
      }
      this.imageTimer += 1;
      img.src = value.toString();
    }
  }

  imageReady(){
    this.imageTimer--;
    if(this.imageTimer === 0){
      console.log("Start loading")
      this.load();
    }
  }

  

  load(){
    console.log("LOAD")
    const canvas = document.getElementById("canvas");

    canvas.addEventListener("click", (e)=> {
      this.canvasClicked(e as MouseEvent);
    })

    canvas.addEventListener("touchstart", (e)=> {
      this.canvasClicked(e as TouchEvent);
    })

    Game.ctx = canvas.getContext("2d");
    
    Game.height = window.innerHeight;
    Game.width = window.innerWidth;
    Game.ctx.canvas.height = Game.height;
    Game.ctx.canvas.width = Game.width;

    Game.lives = this.config.lives;
    Game.timeLeft = this.config.time;

    // Game.frameRate = this.config.frameRate;

    const moleHillImg = this.images.find(img => img.name === "moleHill")?.img;

    this.floorImage = this.images.find(img => img.name === "ground")?.img;

    const moleImgs = this.images.filter(img => img.name.split("_")[0] === "mole");

    let groundHeight = Game.height * this.config.horizonHeight / 100;

    this.grid = new Grid(this.config, moleHillImg, groundHeight);
    this.moleSpawner = new MoleSpawner(this.config, this.grid.moleHills, moleImgs);

    this.pew = new PlayAndWinPlatform();
    this.pew.ready();

    this.pew.init(this, () => {
      this.restart;
      this.play;
    });
  }

  canvasClicked(e: MouseEvent | TouchEvent){
    if(this.gameOver && this.grid.isEmpty()){
      this.restart();
      return;
    }
    if(this.tapToPlay){
      this.tapToPlay = false;
      setTimeout(() => {
        this.playing = true;
      }, 1000)
      return;
    }
    let x: number, y: number;
    if(e instanceof MouseEvent){
      x = e.clientX;
      y = Game.height - e.clientY;
    } else {
      x = e.touches[0].clientX;
      y = Game.height - e.touches[0].clientY;
    }
    
    let moles = this.moleSpawner.spawnedMoles.sort((a, b)=> {return a.y - b.y})

    for(let i = 0; i < moles.length; i++){
      const mole = moles[i];
      const hitbox = mole.getHitBox();
      if(x > hitbox.x1 && x < hitbox.x2 && y > hitbox.y1 && y < hitbox.y2){
        mole.hit();
        break;
      }
    }
  }

  render(){
    // Sky
    Game.ctx.clearRect(0, 0, Game.width, Game.height);
    Game.drawShape("#33A8FF", 0, 0, Game.width, Game.height);

    if(!this.gameOver && !this.tapToPlay){
      Game.drawText(Game.points.toString(), 20, Game.height - 40, "30px Arial", "white", "start");
    if(Game.lives !== undefined){
      Game.drawText(Game.lives.toString(), Game.width - 40, Game.height - 40, "30px Arial", "white", "end");
      Game.drawText(" ♥︎ ", Game.width - 40 , Game.height - 38, "30px Arial", "red", "start");
    }

    if(Game.timeLeft !== undefined){
      Game.drawText(Math.ceil(Game.timeLeft/1000).toString(), Game.width * (11/20), Game.height - 38, "30px Arial", "white", "end");
      Game.drawText(" ⨶ ", Game.width * (11/20) , Game.height - 38, "30px Arial", "black", "start");
    }
    }
    // Ground
    if(this.floorImage){
      Game.drawImage(this.floorImage, 0, 0, Game.width, Game.height * this.config.horizonHeight / 100);
    } else {
      Game.drawShape("green", 0, 0, Game.width, Game.height * this.config.horizonHeight / 100);
    }

    this.grid.render();

    if(this.tapToPlay && !this.gameOver){
      Game.drawShape("rgba(0, 0, 0, 0.5)", 0, 0, Game.width, Game.height);
      Game.drawText("Tap to play", Game.width / 2, Game.height - 40, "30px Arial", "white", "center");

    }

    if(this.gameOver){
      Game.drawShape("rgba(0, 0, 0, 0.5)", 0, 0, Game.width, Game.height);
      Game.drawText("GAME OVER - Score: " + this.finalScore, Game.width / 2, Game.height - 40, "30px Arial", "white", "center");
    }
    
  }

  update(){
    if(this.gameOver){
      return;
    }
    this.time += 1000 / Game.frameRate
    if(this.time > 0){
      if(this.config.speedIncrease && (this.time % this.config.speedIncrease.time === 0)){
        if(this.moleSpawner.speedMultiplyer - (this.config.speedIncrease.increase - 1) > 0)
        this.moleSpawner.speedMultiplyer -= (this.config.speedIncrease.increase - 1);
      }
      if(this.config.amountOfMolesIncrease && (this.time % this.config.amountOfMolesIncrease.time === 0)){
        if((this.moleSpawner.maxMoles + this.config.amountOfMolesIncrease.increase) < (this.config.columns * this.config.rows - 2)){
          this.moleSpawner.maxMoles += this.config.amountOfMolesIncrease.increase;
        }
      }

    if(this.gameOver === false && ((Game.timeLeft !== undefined && Game.timeLeft === 0) || (Game.lives !== undefined && Game.lives === 0))){
      this.finalScore = Game.points;
      this.gameOver = true;
      this.playing = false;
      
      this.pew.gameover(this.finalScore);


      return;
    }
      if(Game.timeLeft){
        Game.timeLeft -= 10;
      }
      this.grid.update();
      this.moleSpawner.spawn();

    }
  }

  static drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number, filter?: string, crop?: number){
    if(this.ctx === null){
      return;
    }
    // Translate Y
    y = this.height - y - height;
    if(filter){
      this.ctx.filter = filter;
    }
    if(crop === undefined){
      this.ctx.drawImage(image, x, y, width, height);
    } else {
      const sx = 0;
      const sy = 0;
      const sw = image.naturalWidth;
      const sh = image.naturalHeight * crop / 100;
      this.ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
    }
    this.ctx.filter = "none"
  }

  static drawShape(color: string,x: number, y: number, width: number, height: number){
    if(this.ctx === null){
      return;
    }
    if(height < 0){
      height = 0;
    }
    // Translate Y
    y = this.height - y - height;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  static drawText(text: string, x: number, y: number, font: string, color: string = "white", align: CanvasTextAlign = "center"){
    if(this.ctx === null){
      return;
    }
    y = this.height - y;

    this.ctx.textAlign = align;
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  getSettingsFromURI(uri: string){
    this.config = config;
    return;
    let settingString;
    const split = uri.split("&")
    for(let s of split){
      if(s[0] === "s"){
        settingString = atob(s.split("=")[1]);
      }
    }

    if(settingString === undefined){
      this.config = config;
      return;
    }

    let jsonString = "{";

    let settings = settingString.split("\n");
    settings.forEach(s => {
      const keyAndValue = s.split("=");
      if(keyAndValue.length === 1){
        return;
      }
      let line = '"' + keyAndValue[0] + '": ' + keyAndValue[1];
      if(settings.indexOf(s) < (settings.length - 1)){
        line += ",";
      }

      jsonString += line;

    });
    jsonString += "}";
    this.config = JSON.parse(jsonString);
  }
}

