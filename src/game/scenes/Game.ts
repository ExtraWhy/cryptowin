import { Scene, Display } from 'phaser';
import Stats from 'stats.js';

type SlotState = 'idle' | 'starting' | 'spinning' | 'stopping' | 'stopped';
enum SlotMachineEvent {
  TOGGLE,
  START_COMPLETE,
  STOP_START,
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
  private spinning: boolean = false;
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
    'xrp-xrp-logo.png',
    'tether-usdt-logo.png',
    'solana-sol-logo.png',
  ];
  private reels: Reel[] = [];

  private reelResults: string[] = [];
  private spaceKey!: Phaser.Input.Keyboard.Key;

  private onUpdate: (() => void) | null = null;

  private slot_machine!: FiniteStateMachine;

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
        },
        starting: {
          entry: () => this.spinAllReels(),
          START_COMPLETE: 'spinning',
        },
        spinning: {
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

  drawWinningSymbols() {
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
      console.warn(`Invalid transition: ${this.slot_machine.current_state} -> ${event}`);
      return;
    }

    console.log(`Transition: ${this.slot_machine.current_state} -> ${nextState} on ${event}`);
    this.slot_machine.current_state = nextState;

    const entryEffect = this.slot_machine.states[nextState]?.entry;
    if (typeof entryEffect === 'function') entryEffect();
  }

  preload() {
    // In Next.js, place your assets in the public folder.
    this.load.atlas('symbols', '/assets/spritesheet.png', '/assets/spritesheet.json');
  }

  create() {
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
      let posY: number = -3 * (this.symbolHeight + this.symbolsYSpacing) + this.startY;

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
        height: (this.reelCount + 2) * (this.symbolHeight + this.symbolsYSpacing),
      });
    }

    // Prevent spacebar from scrolling the page
    window.addEventListener('keydown', function (e) {
      if (e.code === 'Space') {
        e.preventDefault();
      }
    });
    if (this.input && this.input.keyboard) {
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.spaceKey.on('down', () => this.send(SlotMachineEvent.TOGGLE), this);
    }

    this.add.existing(overlay);

    //this.add.rectangle(0, this.scale.height - 155, this.scale.width, 200, this.sys.game.config.backgroundColor.color).setOrigin(0, 0);
    //this.add.rectangle(0, 0, this.scale.width, 200, this.sys.game.config.backgroundColor.color).setOrigin(0, 0);
    this.input.on('pointerdown', () => this.send(SlotMachineEvent.TOGGLE), this);
  }

  resetAllReels() {
    let result_texture_index = 0;
    this.reels.forEach((reel) => {
      const { container } = reel;
      reel.replacedFrames = false;
      reel.stopping = false;
      let posY: number = -3 * (this.symbolHeight + this.symbolsYSpacing) + this.startY;
      container.y = posY;

      (container.list as Phaser.GameObjects.Sprite[]).forEach((sprite: Phaser.GameObjects.Sprite, i: number) => {
        const symbolY = i * (this.symbolHeight + this.symbolsYSpacing);

        sprite.y = symbolY;
        (sprite as any).stopPosition = null;
        //if ( sprite.y )
        let randomTexture = Phaser.Utils.Array.GetRandom(this.coinSymbols);
        if (i >= container.list.length - 3) {
          randomTexture = this.reelResults[result_texture_index++];
          //randomTexture = 'dogecoin.png';
        }
        sprite.setTexture('symbols', randomTexture);
      });
    });
    this.send(SlotMachineEvent.RESET_COMPLETE);
  }

  spinAllReels() {
    const maxSpeed = 50; // peak speed per frame
    const acceleration = 0.9; // how fast it reaches max speed
    const nudgeOffset = 21;
    const delayBetweenReels = 20;
    this.drawWinningSymbols();
    //this.tweens.killAll();
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
          this.send(SlotMachineEvent.START_COMPLETE);
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
    (container.list as Phaser.GameObjects.Sprite[]).forEach((sprite: Phaser.GameObjects.Sprite) => {
      sprite.y += reel.speed;

      if (sprite.y >= reel.height) {
        outsideSprite = sprite;
        let randomTexture = Phaser.Utils.Array.GetRandom(this.coinSymbols);
        outsideSprite.setTexture('symbols', randomTexture);
      }
    });

    const minY = Math.min(...container.list.map((s) => (s as Phaser.GameObjects.Sprite).y));
    if (shiftToTop && outsideSprite && (outsideSprite as Phaser.GameObjects.Sprite).y) {
      (outsideSprite as Phaser.GameObjects.Sprite).y = minY - this.symbolHeight - this.symbolsYSpacing;
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

          topThree.forEach((sprite: Phaser.GameObjects.Sprite, symbol_index: number) => {
            (sprite as any).stopPosition = this.stopPositions[symbol_index] + 42;
            sprite.setTexture('symbols', this.reelResults[index * 3 + symbol_index]);
          });
        }
        reel.replacedFrames = true;

        (container.list as Phaser.GameObjects.Sprite[]).forEach((sprite: Phaser.GameObjects.Sprite) => {
          let yAdvance: number = reel.speed;

          if ((sprite as any).stopPosition && sprite.y + reel.speed > (sprite as any).stopPosition) {
            shallStop = true;
            yAdvance = (sprite as any).stopPosition - sprite.y;
          }
          sprite.y += yAdvance;
        });

        if (shallStop) {
          const container = reel.container;
          reel.speed = 0;
          reel.replacedFrames = false;
          container.list.filter((child) => child instanceof Phaser.GameObjects.Sprite).map((sprite) => ((sprite as any).stopPosition = null));

          const initialY = container.y;

          // Nudge up briefly

          this.tweenPromise({
            targets: container,
            y: initialY - 21,
            duration: 80,
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
    this.reels.forEach((reel, index) => {
      this.time.delayedCall(index * 80, () => {
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
