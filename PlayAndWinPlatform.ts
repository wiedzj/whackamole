// Message to the platform
export type EventTypes = 'play' | 'gameover' | 'ready';
export interface GameOverData {
    score: number;
}
export type EventData = GameOverData;
export interface GameEvent {
    eventName: EventTypes;
    data?: EventData;
}

// Messages from the platform
export type PlatformEventTypes = 'play';
export interface PlatFormEvent {
    eventName: PlatformEventTypes;
}

export interface PEWGame {
   play;
}

export class PlayAndWinPlatform {
  private game: PEWGame;
  constructor() {
    console.log('PewPlatform CREATED');
    window.addEventListener('message', (ev: MessageEvent) => {
      console.log('RECEIVE message', ev);
      this.receive(ev.data);
    });

    if (window === top) {
      // console.error('THIS GAME CAN ONLY BE PLAYED ON THE PLAYANDWIN PLATFORM');
      // window.document.body.innerHTML = 'Error: Play and win platform not found';
      // return;
    }

    (<any>window).pew = this;

    // this.ready();
  }

  private receive(data: PlatFormEvent) {
    console.log('G: RECEIVE', data);
    switch (data.eventName) {
      case 'play':
        this.game.play(); // Send play message to the game
        break;
    }
    // document.getElementById('messages').value = document.getElementById('messages').value + "\n" + data;
  }

  public init(game: PEWGame, ready: {(): void}) {
    this.game = game;
    ready();
  }

  /**
   * Retrieve updated score from game
   */
  public updatescore(score: number) {

  }

  /**
   * Retrieve play event when game actualy starts
   */
  public gamestarted() {
    console.log('G: SEND', 'play');
    this.sendEvent({ eventName: 'play' });
  }

  public play() {
    this.game.play();
  }

  /**
   * Retrieve gameover event from game whith endsoce
   */
  public gameover(score: number) {
    console.log('G: SEND', 'Gameover');
    // const score = Math.round(Math.random() * 1000);
    this.sendEvent({ eventName: 'gameover', data: { score } });
  }

  /**
   * Receive ready event from game when allowed to use start
   */
  public ready() {
    console.log('G: SEND', 'Ready');
    this.sendEvent({ eventName: 'ready' });
  }

  /**
   * Send message to the game platform
   * @param event
   */
  private sendEvent(event: GameEvent) {
    console.log(event);
    window.top.postMessage(event, '*');
  }
}
