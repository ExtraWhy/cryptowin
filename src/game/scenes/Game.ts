import { Scene, Display } from 'phaser';

export class Game extends Scene {
  private spinning: boolean = true;
  private reelCount: number = 5;
  private symbolsPerReel: number = 10;
  private symbolsYSpacing: number = 30;
  private reelSpacing: number = 150;
  private startY: number = 0;
  private winningLineY: number = 300; // Global Y coordinate for the winning symbol
  private spinSpeed: number = 15;
  private coinSymbols: string[] = [
    'bitcoin.png',
    'dogecoin.png',
    'pepe-pepe-logo.png',
    'usd-coin-usdc-logo.png',
    'xrp-xrp-logo.png',
    'tether-usdt-logo.png',
    'solana-sol-logo.png',
  ];
  private reels: Phaser.GameObjects.Container[] = [];

  constructor() {
    super('Game');
  }

  preload() {
    // In Next.js, place your assets in the public folder.
    this.load.atlas('symbols', '/assets/spritesheet.png', '/assets/spritesheet.json');
  }

  create() {
    console.log('create');
    for (let i = 0; i < this.reelCount; i++) {
      const container = this.add.container(100 + i * this.reelSpacing, this.startY);
      for (let j = 0; j < this.symbolsPerReel; j++) {
        const frameName = Phaser.Utils.Array.GetRandom(this.coinSymbols);
        const sprite = this.add.sprite(0, j * (this.symbolHeight() + this.symbolsYSpacing), 'symbols', frameName);
        container.add(sprite);
      }
      this.reels.push(container);
    }

    this.add.rectangle(0, this.scale.height - 200, this.scale.width, 200, this.sys.game.config.backgroundColor.color).setOrigin(0, 0);
    this.add.rectangle(0, 0, this.scale.width, 200, this.sys.game.config.backgroundColor.color).setOrigin(0, 0);
    this.input.on(
      'pointerdown',
      () => {
        if (this.spinning) {
          this.stopSpin();
        } else {
          this.spinning = true;
        }
      },
      this,
    );
  }

  update() {
    if (this.spinning) {
      const gameHeight = Number(this.sys.game.config.height);
      this.reels.forEach((container) => {
        container.y += this.spinSpeed;
        // Use a type guard to ensure each child is a sprite.
        container.list
          .filter((child): child is Phaser.GameObjects.Sprite => child instanceof Phaser.GameObjects.Sprite)
          .forEach((sprite) => {
            if (container.y + sprite.y >= gameHeight + this.symbolHeight()) {
              sprite.y -= this.symbolsPerReel * (this.symbolHeight() + this.symbolsYSpacing);
            }
          });
      });
    }
  }

  private symbolHeight(): number {
    return 100;
  }

  stopSpin() {
    this.spinning = false;
    return;

    this.reels.forEach((container, reelIndex) => {
      let targetSprite!: Phaser.GameObjects.Sprite;
      let smallestDiff = Number.MAX_VALUE;
      container.list
        .filter((child): child is Phaser.GameObjects.Sprite => child instanceof Phaser.GameObjects.Sprite)
        .forEach((sprite) => {
          const globalY = container.y + sprite.y;
          const diff = Math.abs(globalY - this.winningLineY);
          if (diff < smallestDiff) {
            smallestDiff = diff;
            targetSprite = sprite;
          }
        });

      if (targetSprite) {
        const offset = this.winningLineY - (container.y + targetSprite.y);
        container.y += offset;
        targetSprite.setTint(0xffd700);
        console.log(`Reel ${reelIndex + 1} stopped with symbol: ${targetSprite.frame.name}`);
      }
    });

    console.log('Spin stopped.');
  }
}
