import { Scene, GameObjects, Tweens } from 'phaser';

export interface Reel {
  container: Phaser.GameObjects.Container;
  speed: number;
  maxSpeed: number;
  acceleration: number;
  height: number;
  replacedFrames: boolean;
  stopping: boolean;
  stopResolve?: () => void;
}

export class ReelMachine {
  // ===  defaults you had as top-level constants ===
  public readonly reelCount = 5;
  public readonly symbolsPerReel = 7;
  public readonly symbolHeight = 100;
  public readonly symbolsYSpacing = 35;
  public readonly reelSpacing = 140;
  public readonly startY = -60;

  public readonly coinSymbols: string[] = [
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




  private scene: Scene;
  private reels: Reel[];

  private reelResults: string[] = [];
  private stopPositions: number[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
    this.reels = [];
    const overlay = new Phaser.GameObjects.Graphics(this.scene);
    overlay.lineStyle(2, 0x383838, 1);
    overlay.fillStyle(0x15130f, 1);

    for (let i = 0; i < this.reelCount; i++) {
      //graphics.fillRoundedRect(12 + i * this.reelSpacing, 0, 132, 413, 10);
      let posY: number =
        -3 * (this.symbolHeight + this.symbolsYSpacing) + this.startY;

      const container = this.scene.add.container(
        80 + i * this.reelSpacing,
        posY,
      );

      for (let j = 0; j < this.symbolsPerReel; j++) {
        const frameName = Phaser.Utils.Array.GetRandom(this.coinSymbols);
        const symbolY = j * (this.symbolHeight + this.symbolsYSpacing);
        const sprite = this.scene.add.sprite(0, symbolY, 'symbols', frameName);
        container.add(sprite);
        if (j > 3 && j < 7) this.stopPositions.push(symbolY);
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

    this.scene.add.existing(overlay);

    //this.add.rectangle(0, this.scale.height - 155, this.scale.width, 200, this.sys.game.config.backgroundColor.color).setOrigin(0, 0);
    //this.add.rectangle(0, 0, this.scale.width, 200, this.sys.game.config.backgroundColor.color).setOrigin(0, 0);
    //
  }

  drawRandomWinningSymbols() {
    this.reelResults = Array.from({ length: 15 }, () => {
      const randomIndex = Math.floor(Math.random() * this.coinSymbols.length);
      return this.coinSymbols[randomIndex];
    });
  }

  public spinAllReels(): Promise<void[]> {
    const maxSpeed = 50; // peak speed per frame
    const acceleration = 0.9; // how fast it reaches max speed
    const nudgeOffset = 21;
    const delayBetweenReels = 20;

    this.drawRandomWinningSymbols();

    this.scene.tweens.killAll();

    const promises = this.reels.map((reel, index) => {
      reel.speed = 0;
      reel.maxSpeed = maxSpeed;
      reel.acceleration = acceleration;

      const container = reel.container;
      const initialY = container.y;

      return this.tweenPromise({
        targets: container,
        y: initialY - nudgeOffset,
        delay: index * delayBetweenReels,
        duration: 150,
        ease: 'Sine.easeOut',
      });
    });

    return Promise.all(promises);
  }

  stopAllReels(): Promise<void[]> {
    console.log('hey');
    this.scene.time.removeAllEvents();

    const finishPromises = this.reels.map(
      (reel) =>
        new Promise<void>((resolve) => {
          reel.stopResolve = resolve;
        }),
    );

    this.reels.forEach((reel, index) => {
      this.scene.time.delayedCall(index * 30, () => {
        reel.speed = reel.maxSpeed;
        reel.stopping = true;
      });
    });

    return Promise.all(finishPromises);
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
          }
          sprite.setTexture('symbols', randomTexture);
        },
      );
    });
  }

  spin = (): void => {
    this.reels.forEach((reel) => {
      if (reel.speed < reel.maxSpeed) {
        reel.speed += reel.acceleration;
      }
      this.shiftSymbols(reel);
    });
  };

  stop = (): void => {
    this.reels.forEach((reel, idx) => {
      if (!reel.stopping) {
        this.shiftSymbols(reel, true);
      } else {
        this.handleStoppingReel(reel, idx);
      }
    });
  };

  private handleStoppingReel(reel: Reel, reelIndex: number): void {
    this.shiftSymbols(reel, false);
    if (!reel.replacedFrames) {
      this.prepareStopFrames(reel, reelIndex);
      reel.replacedFrames = true;
    }

    const shouldFinish = this.advanceSprites(reel);
    if (shouldFinish) {
      this.finishReel(reel);
    }
  }

  private finishReel(reel: Reel): void {
    const { container } = reel;
    reel.speed = 0;
    reel.replacedFrames = false;
    reel.stopping = false;

    // clear stop markers
    container.list.forEach((c) => {
      if (c instanceof Phaser.GameObjects.Sprite) {
        (c as any).stopPosition = null;
      }
    });

    // do the nudge tween and, when it’s done, fire the resolver
    this.tweenPromise({
      targets: container,
      y: container.y - 21,
      duration: 30,
      ease: 'Sine.easeOut',
    }).then(() => {
      reel.stopResolve?.();
    });
  }

  private prepareStopFrames(reel: Reel, reelIndex: number): void {
    const topThree = reel.container.list
      .filter(
        (c): c is Phaser.GameObjects.Sprite =>
          c instanceof Phaser.GameObjects.Sprite,
      )
      .sort((a, b) => a.y - b.y)
      .slice(0, 3);

    topThree.forEach((sprite, symIdx) => {
      const resultFrame = this.reelResults[reelIndex * 3 + symIdx];
      // compute stopPosition if you have specific Y; otherwise you can
      // use sprite.y + some offset
      (sprite as any).stopPosition = this.stopPositions[symIdx] + 42;
      sprite.setTexture('symbols', resultFrame);
    });
  }

  private advanceSprites(reel: Reel): boolean {
    let shouldFinish = false;

    (reel.container.list as Phaser.GameObjects.Sprite[]).forEach((sprite) => {
      const sp = sprite as any;
      let dy = reel.speed;

      if (sp.stopPosition != null && sprite.y + reel.speed > sp.stopPosition) {
        dy = sp.stopPosition - sprite.y;
        shouldFinish = true;
      }
      sprite.y += dy;
    });

    return shouldFinish;
  }

  private tweenPromise(params: any): Promise<void> {
    return new Promise((resolve) => {
      params.onComplete = () => resolve();
      this.scene.tweens.add(params);
    });
  }

  private shiftSymbols(reel: Reel, shiftToTop: boolean = true): void {
    const { container } = reel;
    let outsideSprite: Phaser.GameObjects.Sprite | null = null;

    (container.list as Phaser.GameObjects.Sprite[]).forEach((sprite) => {
      sprite.y += reel.speed;

      if (sprite.y >= reel.height) {
        outsideSprite = sprite;
        const randomTexture = Phaser.Utils.Array.GetRandom(this.coinSymbols);
        sprite.setTexture('symbols', randomTexture);
      }
    });

    if (shiftToTop && outsideSprite) {
      const minY = Math.min(
        ...container.list.map((s) => (s as Phaser.GameObjects.Sprite).y),
      );
      outsideSprite.y = minY - this.symbolHeight - this.symbolsYSpacing;
    }
  }
}
