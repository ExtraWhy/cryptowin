import WebSocketManager, { ServerMessage } from '@/lib/ws';
import { Scene, Display } from 'phaser';
import Stats from 'stats.js';

type SlotState = 'idle' | 'starting' | 'spinning' | 'stopping' | 'stopped';
enum SlotMachineEvent {
  TOGGLE,
  START_COMPLETE,
  STOP_START,
  STOP_SPIN,
  STOP_COMPLETE,
  RESET_COMPLETE,
}
type FiniteStateMachine = {
  current_state: SlotState;
  states: Record<SlotState, any>;
};

interface Reel {
  container: Phaser.GameObjects.Container;
  speed: number;
  maxSpeed: number;
  acceleration: number;
  height: number;
  replacedFrames: boolean;
  stopping: boolean;
}

export class Game extends Scene {
  private reelCount: number = 5;
  private symbolsPerReel: number = 7;
  private symbolHeight: number = 100;
  private symbolsYSpacing: number = 35;
  private reelSpacing: number = 140;
  private startY: number = -60;
  private stats = new Stats();
  private stopPositions: number[] = [];
  private coinSymbols: string[] = [
    'bitcoin.png',
    'dogecoin.png',
    'pepe-pepe-logo.png',
    'usd-coin-usdc-logo.png',
    'tether-usdt-logo.png',
    'solana-sol-logo.png',
    'symbol2.png',
    'xrp-xrp-logo.png',
    '7.png',
    '9.png',
    '10.png',
    't.png',
    'j.png',
    'ethereumq.png',
    'bitcoin10.png',
  ];
  private reels: Reel[] = [];

  private lines: number[][] = [
    [1, 1, 1, 1, 1], // 0
    [0, 0, 0, 0, 0], // 1
    [2, 2, 2, 2, 2], // 2
    [0, 1, 2, 1, 0], // 3
    [2, 1, 0, 1, 2], // 4
    [0, 0, 1, 2, 2], // 5
    [2, 2, 1, 0, 0], // 6
    [1, 0, 1, 2, 1], // 7
    [1, 2, 1, 0, 1], // 8
    [0, 1, 1, 1, 2], // 9
  ];

  private reelResults: string[] = [];
  private winningLines: number[] = [];
  private spaceKey!: Phaser.Input.Keyboard.Key;

  private onUpdate: (() => void) | null = null;

  private slot_machine!: FiniteStateMachine;
  private ws = WebSocketManager();
  private wsm!: Phaser.GameObjects.Text;
  private ws_timer!: Phaser.GameObjects.Text;
  private wss!: Phaser.GameObjects.Graphics;

  constructor() {
    super('Game');
    this.initStateMachine();
  }

  initStateMachine() {
    this.slot_machine = {
      current_state: 'idle',
      states: {
        idle: {
          TOGGLE: 'starting',
          entry: () =>
            this.time.delayedCall(3000, () => {
              this.send(SlotMachineEvent.TOGGLE);
            }),
        },
        starting: {
          entry: () => this.spinAllReels(),
          START_COMPLETE: 'spinning',
        },
        spinning: {
          entry: () =>
            this.time.delayedCall(1000, () => {
              this.send(SlotMachineEvent.STOP_SPIN);
            }),
          STOP_SPIN: 'stopping',
          TOGGLE: 'stopping',
        },
        stopping: {
          entry: () => this.stopAllReels(),
          STOP_COMPLETE: 'stopped',
        },
        stopped: {
          entry: () => this.resetAllReels(),
          RESET_COMPLETE: 'idle',
        },
      },
    };
  }

  drawRandomWinningSymbols() {
    this.reelResults = Array.from({ length: 15 }, () => {
      const randomIndex = Math.floor(Math.random() * this.coinSymbols.length);
      return this.coinSymbols[randomIndex];
    });
  }

  send(event_enum: SlotMachineEvent): void {
    const event = SlotMachineEvent[event_enum];
    const stateDef = this.slot_machine.states[this.slot_machine.current_state];
    const nextState: SlotState = stateDef?.[event];

    if (!nextState) {
      console.warn(
        `Invalid transition: ${this.slot_machine.current_state} -> ${event}`,
      );
      return;
    }

    //console.log(`Transition: ${this.slot_machine.current_state} -> ${nextState} on ${event}`);
    this.slot_machine.current_state = nextState;

    const entryEffect = this.slot_machine.states[nextState]?.entry;
    if (typeof entryEffect === 'function') entryEffect();
  }

  create() {
    console.log('abase_scene.onUpdate = spinsdf');
    //this.ws.connect('ws://localhost:8081/ws');
    // stats
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
    this.stats.dom.style.position = 'absolute';
    document.getElementById('game-container')?.appendChild(this.stats.dom);
    // end stats

    const graphics = this.add.graphics();
    const overlay = new Phaser.GameObjects.Graphics(this);
    graphics.fillStyle(0x15130f, 1);
    overlay.lineStyle(2, 0x383838, 1);
    overlay.fillStyle(0x15130f, 1);

    for (let i = 0; i < this.reelCount; i++) {
      //graphics.fillRoundedRect(12 + i * this.reelSpacing, 0, 132, 413, 10);
      let posY: number =
        -3 * (this.symbolHeight + this.symbolsYSpacing) + this.startY;

      const container = this.add.container(80 + i * this.reelSpacing, posY);
      for (let j = 0; j < this.symbolsPerReel; j++) {
        const frameName = Phaser.Utils.Array.GetRandom(this.coinSymbols);
        const symbolY = j * (this.symbolHeight + this.symbolsYSpacing);
        const sprite = this.add.sprite(0, symbolY, 'symbols', frameName);
        if (j > 3 && j < 7) this.stopPositions.push(symbolY);
        container.add(sprite);
      }

      overlay.fillRoundedRect(12 + i * this.reelSpacing, 0, 132, 21, 10);
      overlay.fillRoundedRect(12 + i * this.reelSpacing, 395, 132, 18, 10);

      overlay.strokeRoundedRect(12 + i * this.reelSpacing, 0, 132, 413, 10);
      this.reels.push({
        container,
        speed: 0,
        acceleration: 0,
        maxSpeed: 0,
        replacedFrames: false,
        stopping: false,
        height:
          (this.reelCount + 2) * (this.symbolHeight + this.symbolsYSpacing),
      });
    }

    // Prevent spacebar from scrolling the page
    window.addEventListener('keydown', function (e) {
      if (e.code === 'Space') {
        e.preventDefault();
      }
    });
    if (this.input && this.input.keyboard) {
      this.spaceKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      );
      this.spaceKey.on('down', () => this.send(SlotMachineEvent.TOGGLE), this);
    }

    this.add.existing(overlay);

    //this.add.rectangle(0, this.scale.height - 155, this.scale.width, 200, this.sys.game.config.backgroundColor.color).setOrigin(0, 0);
    //this.add.rectangle(0, 0, this.scale.width, 200, this.sys.game.config.backgroundColor.color).setOrigin(0, 0);
    this.input.on(
      'pointerdown',
      () => this.send(SlotMachineEvent.TOGGLE),
      this,
    );
    this.wsm = this.add.text(100, 124, '', {
      fontSize: '28px',
      color: '#ffffff',
    });
    this.wsm.setVisible(false);
    this.wss = new Phaser.GameObjects.Graphics(this);
    this.wss.y = 40;
    this.add.existing(this.wss);
    this.ws_timer = this.add.text(100, 124, '', {
      fontSize: '28px',
      color: '#ffffff',
    });
  }

  resetAllReels() {
    let result_texture_index = 0;
    this.reels.forEach((reel, reel_index) => {
      const { container } = reel;
      reel.replacedFrames = false;
      reel.stopping = false;
      let posY: number =
        -3 * (this.symbolHeight + this.symbolsYSpacing) + this.startY;
      container.y = posY;

      (container.list as Phaser.GameObjects.Sprite[]).forEach(
        (sprite: Phaser.GameObjects.Sprite, col_index: number) => {
          const symbolY =
            col_index * (this.symbolHeight + this.symbolsYSpacing);

          sprite.y = symbolY;
          (sprite as any).stopPosition = null;
          //if ( sprite.y )
          let randomTexture = Phaser.Utils.Array.GetRandom(this.coinSymbols);
          let flashing_indexes: number[] = [];
          if (col_index >= container.list.length - 3) {
            randomTexture =
              this.reelResults[
                reel_index * 3 + col_index - (container.list.length - 3)
              ];
            // 1,2,1,2,1
            if (this.winningLines.length) {
              this.winningLines.map((line: number) => {
                console.log(
                  this.lines[line][reel_index],
                  col_index - (container.list.length - 3),
                );
                if (
                  this.lines[line][reel_index] ==
                  col_index - (container.list.length - 3)
                ) {
                  console.log('matching index');
                  //flashing_indexes.push(sprite)

}

  resetAllReels() {
    this.reels.forEach((reel, reel_index) => {
      const { container } = reel;
      reel.replacedFrames = false;
      reel.stopping = false;
      let posY: number =
        -3 * (this.symbolHeight + this.symbolsYSpacing) + this.startY;
      container.y = posY;

      (container.list as Phaser.GameObjects.Sprite[]).forEach(
        (sprite: Phaser.GameObjects.Sprite, col_index: number) => {
          const symbolY =
            col_index * (this.symbolHeight + this.symbolsYSpacing);

          sprite.y = symbolY;
          (sprite as any).stopPosition = null;
          let randomTexture = Phaser.Utils.Array.GetRandom(this.coinSymbols);
          if (col_index >= container.list.length - 3) {
            randomTexture =
              this.reelResults[
                reel_index * 3 + col_index - (container.list.length - 3)
              ];
            //randomTexture = 'dogecoin.png';
          } else {
            this.scene.tweens.add({
              targets: sprite,
              scale: 1.2,
              yoyo: true,
              ease: 'Power2',
              duration: 1000,
              repeat: -1,
            });
          }
          sprite.setTexture('symbols', randomTexture);
        },
      );
    });
  }

                }
              });
            }
            //randomTexture = 'dogecoin.png';
          }
          sprite.setTexture('symbols', randomTexture);
        },
      );
    });
    this.send(SlotMachineEvent.RESET_COMPLETE);
    this.wsm.setVisible(true);
    this.winningLines = [];
  }

  spinAllReels() {
    const maxSpeed = 50; // peak speed per frame
    const acceleration = 0.9; // how fast it reaches max speed
    const nudgeOffset = 21;
    const delayBetweenReels = 20;
    let socket_received: boolean = false;
    let tweens_completed: boolean = false;
    this.wsm.setVisible(false);
    this.wss.clear();
    this.wss.fillStyle(0xf5bc42, 1);
    this.wss.fillRoundedRect(0, 0, 50, 50, 3);

    let handle: number;
    const end = performance.now();
    const updateText = () => {
      this.ws_timer.setText('ms ' + String(performance.now() - end));
      handle = requestAnimationFrame(updateText);
    };
    requestAnimationFrame(updateText);
    const checkForStartComplete = () => {
      if (socket_received && tweens_completed) {
        this.send(SlotMachineEvent.START_COMPLETE);
      }
    };

    this.ws.onMessage((data: ServerMessage) => {
      this.wss.clear();
      this.wss.fillStyle(0x00ff00);
      this.wss.fillRoundedRect(0, 0, 50, 50, 3);
      cancelAnimationFrame(handle);
      this.ws_timer.setText('ms ' + String(performance.now() - end));

      const binary_reels = atob(data.reels);
      const symbols: number[] = [];
      for (let i = 0; i < binary_reels.length; i++) {
        symbols.push(binary_reels.charCodeAt(i));
      }
      console.log('symbold', symbols);

      this.reelResults = Array.from({ length: 15 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return this.coinSymbols[symbols[col * 5 + row]];
      });
      console.log('results', this.reelResults);
      if (data.lines) {
        this.winningLines = [...atob(data.lines)].map((char) =>
          char.charCodeAt(0),
        );
      }
      console.log('winninglines', this.winningLines);

      const text =
        data.won > 0
          ? `🎉 You won ${data.won} coins!`
          : `😢 Better luck next time.`;
      this.wsm.setText(text);

      socket_received = true;
      checkForStartComplete();
    });

    this.ws.send({
      id: 1,
      money: 100,
    });

    //();
    this.tweens.killAll();
    this.reels.forEach((reel, index) => {
      reel.speed = 0;
      reel.maxSpeed = maxSpeed;
      reel.acceleration = acceleration;

      const container = reel.container;
      const initialY = container.y;

      // Nudge up briefly
      this.tweenPromise({
        targets: container,
        y: initialY - nudgeOffset,
        delay: index * delayBetweenReels,
        duration: 150,
        ease: 'Sine.easeOut',
      }).then(() => {
        if (index === 0) this.onUpdate = this.updateSpinning;
        if (index === this.reels.length - 1) {
          tweens_completed = true;
          checkForStartComplete();
          //this.send(SlotMachineEvent.START_COMPLETE);
        }
      });
    });
  }

  tweenPromise(tween_params: any): Promise<void> {
    return new Promise((resolve) => {
      tween_params.onComplete = () => resolve();
      this.tweens.add(tween_params);
    });
  }

  updateSpinning() {
    this.reels.forEach((reel) => {
      // Accelerate
      if (reel.speed < reel.maxSpeed) {
        reel.speed += reel.acceleration;
      }

      // Spin Symbols
      this.shiftSymbols(reel);
    });
  }

  shiftSymbols(reel: Reel, shiftToTop: boolean = true) {
    const { container } = reel;
    let outsideSprite: Phaser.GameObjects.Sprite | null = null;
    (container.list as Phaser.GameObjects.Sprite[]).forEach(
      (sprite: Phaser.GameObjects.Sprite) => {
        sprite.y += reel.speed;

        if (sprite.y >= reel.height) {
          outsideSprite = sprite;
          let randomTexture = Phaser.Utils.Array.GetRandom(this.coinSymbols);
          outsideSprite.setTexture('symbols', randomTexture);
        }
      },
    );

    const minY = Math.min(
      ...container.list.map((s) => (s as Phaser.GameObjects.Sprite).y),
    );
    if (
      shiftToTop &&
      outsideSprite &&
      (outsideSprite as Phaser.GameObjects.Sprite).y
    ) {
      (outsideSprite as Phaser.GameObjects.Sprite).y =
        minY - this.symbolHeight - this.symbolsYSpacing;
    }
  }

  updateStopping() {
    this.reels.forEach((reel, index) => {
      const { container } = reel;
      this.shiftSymbols(reel, !reel.stopping);
      if (reel.stopping) {
        this.shiftSymbols(reel, false);
        let shallStop: boolean = false;

        if (!reel.replacedFrames) {
          const topThree = container.list
            .filter((child) => child instanceof Phaser.GameObjects.Sprite)
            .sort((a, b) => a.y - b.y)
            .slice(0, 3) as Phaser.GameObjects.Sprite[];

          topThree.forEach(
            (sprite: Phaser.GameObjects.Sprite, symbol_index: number) => {
              (sprite as any).stopPosition =
                this.stopPositions[symbol_index] + 42;
              sprite.setTexture(
                'symbols',
                this.reelResults[index * 3 + symbol_index],
              );
            },
          );
        }
        reel.replacedFrames = true;

        (container.list as Phaser.GameObjects.Sprite[]).forEach(
          (sprite: Phaser.GameObjects.Sprite) => {
            let yAdvance: number = reel.speed;

            if (
              (sprite as any).stopPosition &&
              sprite.y + reel.speed > (sprite as any).stopPosition
            ) {
              shallStop = true;
              yAdvance = (sprite as any).stopPosition - sprite.y;
            }
            sprite.y += yAdvance;
          },
        );

        if (shallStop) {
          const container = reel.container;
          reel.speed = 0;
          reel.replacedFrames = false;
          container.list
            .filter((child) => child instanceof Phaser.GameObjects.Sprite)
            .map((sprite) => ((sprite as any).stopPosition = null));

          const initialY = container.y;

          // Nudge up briefly

          this.tweenPromise({
            targets: container,
            y: initialY - 21,
            duration: 30,
            ease: 'Sine.easeOut',
            onComplete: () => {
              //if (index === this.reels.length - 1) this.resetAllReels();
            },
          }).then(() => {
            if (index === this.reels.length - 1) {
              this.send(SlotMachineEvent.STOP_COMPLETE);
            }
          });
        }
      }
    });
  }

  stopAllReels() {
    this.onUpdate = this.updateStopping;
    this.time.removeAllEvents();
    this.reels.forEach((reel, index) => {
      this.time.delayedCall(index * 30, () => {
        reel.speed = reel.maxSpeed;
        reel.stopping = true;
      });
    });
  }

  update() {
    this.stats.begin();
    this.onUpdate?.();
    this.stats.end();
  }
}
