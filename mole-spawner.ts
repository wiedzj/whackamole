import { Config, MoleType } from "./config";
import { Image } from "./game";
import { Mole } from "./mole";
import { MoleHill } from "./mole-hill";

export class MoleSpawner {
  moleTypes: MoleType[];
  moleHills: MoleHill[][];
  spawnedMoles: Mole[] = [];
  maxMoles: number;
  speedMultiplyer: number = 1;

  moleImages: Image[] = [];

  spawnList: number[] = [];

  constructor(config: Config, moleHills: MoleHill[][], moleImgs?: Image[]){
    this.moleTypes = config.moles;
    this.moleHills = moleHills;
    this.maxMoles = config.maxMoles;

    if(moleImgs){
          this.moleImages = moleImgs.sort();
    }
    this.generateSpawnList();
  }

  generateSpawnList(){
    this.moleTypes.forEach(mole => {
      for(let i = 0; i < mole.probability; i++){
        this.spawnList.push(this.moleTypes.indexOf(mole));
      }
    });
  }

  spawn(){
    if(this.spawnedMoles.length >= this.maxMoles){
      return;
    }

    if(this.spawnList.length === 0){
      this.generateSpawnList();
    }

    let spawned = false;
    while(spawned === false){
      let randomY = Math.round(Math.random() * (this.moleHills.length - 1));
      let randomX =  Math.round(Math.random() * (this.moleHills[0].length - 1));

      let randomHill = this.moleHills[randomY][randomX];

      if(randomHill.mole === null) {
        let randomMoleIndex = Math.round(Math.random() * (this.spawnList.length - 1));
        let randomMole = this.moleTypes[this.spawnList[randomMoleIndex]];
        this.spawnList.splice(randomMoleIndex, 1);


        let moleImg: Image | undefined = undefined;
        if(randomMole.spriteId){
          moleImg = this.moleImages.find(img => img.name === "mole_" + randomMole.spriteId);
        }
        const mole = new Mole(randomMole, randomHill, this.speedMultiplyer, moleImg?.img);

        randomHill.mole = mole;
        this.spawnedMoles.push(mole);

        spawned = true;

        setTimeout(() => {
          this.spawnedMoles.splice(this.spawnedMoles.indexOf(mole), 1);
          randomHill.mole = null;
        }, (randomMole.crawlOutTime * 2 * this.speedMultiplyer + randomMole.time * this.speedMultiplyer));
      }
    }


  }
}
