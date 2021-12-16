import { Config } from "./config";
import { Game } from "./game";
import { Mole } from "./mole";
import { MoleHill } from "./mole-hill";

export class Grid {

  moleHills: MoleHill[][] = [];

  constructor(config: Config, moleHill: HTMLImageElement | undefined, floorHeight: number){
      const rows = config.rows;
      const cols = config.columns;

      const holeWidth = Game.width / (cols + 1);
      const holeHeight = floorHeight / (rows + 1);

      const spaceBetweenX = (holeWidth / (cols + 1));
      const spaceBetweenY = (holeHeight / (rows + 1));

      for(let iRow = 0; iRow < rows; iRow++){
        let columns: MoleHill[] = [];
        for(let iCol = 0; iCol < cols; iCol++){
          const x = spaceBetweenX * (iCol + 1) + holeWidth * iCol;
          const y = floorHeight - spaceBetweenY * (iRow + 1) - holeHeight * (iRow + 1);
          columns.push(new MoleHill(x, y, holeWidth, holeHeight, moleHill));
        }
        this.moleHills.push(columns);
      }

  }

  render(){
    for(let iRow = 0; iRow < this.moleHills.length; iRow++){
      for(let iCol = 0; iCol < this.moleHills[iRow].length; iCol++){
        const moleHill: MoleHill = this.moleHills[iRow][iCol];
        if(moleHill.mole){
          moleHill.mole.render();
        }
        moleHill.render();

      }
    }
  }

  update(){
    for(let iRow = 0; iRow < this.moleHills.length; iRow++){
      for(let iCol = 0; iCol < this.moleHills[iRow].length; iCol++){
        const moleHill: MoleHill = this.moleHills[iRow][iCol];
        if(moleHill.mole){
          moleHill.mole.update();
        }
      }
    }
  }

  isEmpty(){
    for(let iRow = 0; iRow < this.moleHills.length; iRow++){
      for(let iCol = 0; iCol < this.moleHills[iRow].length; iCol++){
        const moleHill: MoleHill = this.moleHills[iRow][iCol];
        if(moleHill.mole){
          return false;
        }
      }
    }
    return true;
  }
}
