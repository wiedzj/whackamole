export interface Config {
  rows: number;
  columns: number;
  horizonHeight: number;
  maxMoles: number;
  moles: MoleType[];

  speedIncrease?: DifficultyIncrease;
  amountOfMolesIncrease?: DifficultyIncrease;

  lives?: number;
  time?: number;
  sprites?: {};
}

export interface MoleType {
  spriteId?: number;
  color: string;
  probability: number;
  time: number;
  crawlOutTime: number;
  hit?: RewardPunishment;
  miss?: RewardPunishment;
}

export interface DifficultyIncrease {
  time: number,
  increase: number
}

export type RewardPunishmentType = "point" | "live";

export interface RewardPunishment {
  type: RewardPunishmentType,
  amount: number
}

export const config: Config = {
  rows: 4,
  columns: 4,
  horizonHeight: 30,
  maxMoles: 3,
  lives: 5,
  // time: 50000,

  speedIncrease: {
    time: 5000,
    increase: 1.03
  },
  amountOfMolesIncrease: {
    time: 5000,
    increase: 1
  },
  // time: 20000,
  sprites: {
    moleHill: "../assets/mole-hill.png",
    ground: "../assets/grass2.jpeg",
    mole_1: "../assets/mole1.png",
    mole_2: "../assets/poepie.png",
    mole_3: "../assets/kip.png"
  },
  moles: [
    {
    spriteId: 1,
    color: "#E6A951",
    probability: 20,
    time: 1000,
    crawlOutTime: 500,
    hit:
      {
        type: "point",
        amount: 1,
      },
    miss:
      {
        type: "live",
        amount: -1
      }
    },
    {
      spriteId: 2,
      color: "blue",
      probability: 28,
      time: 500,
      crawlOutTime: 1000,
      hit:
        {
          type: "live",
          amount: -1,
        },
      // miss:
      //   {
      //     type: "live",
      //     amount: 0
      //   }
    },{
      spriteId: 3,
      color: "yellow",
      probability: 4,
      time: 750,
      crawlOutTime: 200,
      hit: {
        type: "live",
        amount: 1
      }
    }
  ]
}
