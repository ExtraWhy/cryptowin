import { BlendModes, Scene } from 'phaser';

export class WinLineDisplay {
  scene: Scene;
  boxes: Phaser.GameObjects.Graphics[] = [];
  private instance_line: Phaser.GameObjects.Graphics | null = null;
  private interval_id: NodeJS.Timeout;
  private updateProgress: number = 0;
  private updateDuration: number = 700;
  private updatePoints: Phaser.Math.Vector2[] = [];
  private updateLineGraphics: Phaser.GameObjects.Graphics | null = null;

  readonly symbolHeight = 100;
  readonly symbolsYSpacing = 35;
  readonly reelSpacing = 140;

  private lines: number[][] = [
    [1, 1, 1, 1, 1], // 1
    [0, 0, 0, 0, 0], // 2
    [2, 2, 2, 2, 2], // 3
    [0, 1, 2, 1, 0], // 4
    [2, 1, 0, 1, 2], // 5
    [0, 0, 1, 2, 2], // 6
    [2, 2, 1, 0, 0], // 7
    [1, 0, 1, 2, 1], // 8
    [1, 2, 1, 0, 1], // 9
    [0, 1, 1, 1, 2], // 10
    [2, 1, 1, 1, 0], // 11
    [1, 0, 0, 1, 2], // 12
    [1, 2, 2, 1, 0], // 13
    [1, 1, 0, 1, 2], // 14
    [1, 1, 2, 1, 0], // 15
    [0, 0, 1, 2, 1], // 16
    [2, 2, 1, 0, 1], // 17
    [1, 0, 1, 2, 2], // 18
    [1, 2, 1, 0, 0], // 19
    [0, 0, 0, 1, 2], // 20
  ];

  winning_lines: number[] = [];

  constructor(scene: Scene, symbols_count: number = 15) {
    this.scene = scene;

    const overlay = new Phaser.GameObjects.Graphics(this.scene);
    overlay.setBlendMode(BlendModes.SCREEN);

    overlay.lineStyle(4, 0x000000, 0.3); // Shadow: thicker, darker, semi-transparent
    overlay.beginPath();
    overlay.moveTo(5, 5); // offset slightly
    overlay.lineTo(305, 305);
    overlay.strokePath();

    this.drawSymbolBoxes(symbols_count);
    //this.showWinningLines();

    this.scene.add.existing(overlay);
  }

  setWinningLines(lines: number[]) {
    this.winning_lines = [...lines];
    console.log('WINNING LINESSSSSSSSSSSSS', this.winning_lines);
  }

  drawSymbolBoxes(count: number) {
    const boxWidth = 132;
    const boxHeight = 132;

    for (let i = 0; i < count; i++) {
      const graphics = new Phaser.GameObjects.Graphics(this.scene);
      graphics.lineStyle(10, 0xf3b200);
      // Draw centered around (0, 0)
      graphics.strokeRoundedRect(
        -boxWidth / 2,
        -boxHeight / 2,
        boxWidth,
        boxHeight,
        10,
      );

      // Compute centered position
      const col = Math.floor(i / 3);
      const row = i % 3;
      const posX = col * this.reelSpacing + 10 + boxWidth / 2;
      const posY =
        row * (this.symbolsYSpacing + this.symbolHeight + 3) +
        3 +
        boxHeight / 2;

      const container = this.scene.add.container(posX, posY, [graphics]);
      container.setVisible(false);
      container.setAlpha(0);
      container.setScale(0.8);

      this.boxes.push(container);
    }
  }

  showWinningLines(animateWinningLine: (line: number[]) => void) {
    //let ar: any[] = [{ line: 0 }, { line: 5 }, { line: 9 }, { line: 4 }];

    //this.drawLine(5);
    let winning_lines_length = this.winning_lines.length;
    let count = 0;
    let positions: number[] =
      this.lines[this.winning_lines[count % winning_lines_length]];
    this.playWin(positions);
    animateWinningLine(positions);
    this.interval_id = setInterval(() => {
      count++;
      positions = this.lines[this.winning_lines[count % winning_lines_length]];
      this.playWin(positions);
      animateWinningLine(positions);
    }, 1000);
  }

  playWin(positions: number[]) {
    this.drawLineAnimated(positions);
    this.showBoxesForLine(positions);
  }

  clearWins() {
    this.clearLines();
    this.hideBoxes();
    clearInterval(this.interval_id);
  }

  showBoxesForLine(positions: number[]) {
    this.hideBoxes();

    positions.forEach((p, i) => {
      const index = (p % 3) + i * 3;
      const box = this.boxes[index];
      box.setVisible(true);

      this.scene.tweens.add({
        targets: box,
        alpha: 1,
        scale: 1,
        ease: 'Back.Out',
        duration: 300,
        delay: i * 70,
      });
    });
  }

  hideBoxes() {
    this.boxes.forEach((box) => {
      box.setVisible(false);
      box.setAlpha(0);
      box.setScale(0.8);
    });
  }

  drawLineAnimated(positions: number[]) {
    this.clearLines();

    const line = new Phaser.GameObjects.Graphics(this.scene);
    this.instance_line = line;
    this.scene.add.existing(line);

    this.updateProgress = 0;
    this.updateLineGraphics = line;
    this.updatePoints = positions.map((p, i) => {
      const x = i * this.reelSpacing + 78;
      const y = p * (this.symbolsYSpacing + this.symbolHeight) + 70;
      return new Phaser.Math.Vector2(x, y);
    });

    this.scene.events.on('update', this.updateLine, this);
  }

  clearLines() {
    if (this.instance_line) {
      this.instance_line.destroy(); // removes from stage & memory
      this.instance_line = null; // clear reference
    }
    this.scene.events.off('update', this.updateLine, this);
  }

  private updateLine(time: number, delta: number) {
    if (!this.updateLineGraphics) return;

    this.updateProgress += delta / this.updateDuration;
    const easedProgress = Phaser.Math.Easing.Cubic.Out(
      Math.min(this.updateProgress, 1),
    );

    const line = this.updateLineGraphics;
    const points = this.updatePoints;

    line.clear();
    line.lineStyle(10, 0xf3b200, 1);
    line.setBlendMode(BlendModes.SCREEN);
    line.beginPath();
    line.moveTo(points[0].x, points[0].y);

    let totalLength = 0;
    const segmentLengths: number[] = [];

    for (let i = 1; i < points.length; i++) {
      const segmentLength = Phaser.Math.Distance.BetweenPoints(
        points[i - 1],
        points[i],
      );
      segmentLengths.push(segmentLength);
      totalLength += segmentLength;
    }

    let drawnLength = totalLength * easedProgress;
    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      const segLen = segmentLengths[i - 1];

      if (drawnLength >= segLen) {
        line.lineTo(end.x, end.y);
        drawnLength -= segLen;
      } else {
        const t = drawnLength / segLen;
        const midX = Phaser.Math.Linear(start.x, end.x, t);
        const midY = Phaser.Math.Linear(start.y, end.y, t);
        line.lineTo(midX, midY);
        break;
      }
    }

    line.strokePath();

    if (this.updateProgress >= 1) {
      this.scene.events.off('update', this.updateLine, this);
    }
  }
}
