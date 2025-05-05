import type StatsType from 'stats.js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stats = require('stats.js') as typeof StatsType;
import { Scene } from 'phaser';
import { EventBus } from '@/game/components/EventBus';
import { ReelsManager } from '@/game/components/Reeling';
import { BetResult } from '@/lib/api/types';
import { WinLineDisplay } from '../components/WinLineDisplay';

export class BaseSlotScene extends Scene {
  public reeling!: ReelsManager;
  public winlines!: WinLineDisplay;
  public onUpdate: (() => void) | null = null;

  private stats = new Stats();
  static elements: number[] = [5, 8, 9, 12, 301];

  constructor() {
    super('BaseSlotScene');
  }

  create() {
    // stats
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
    this.stats.dom.style.position = 'absolute';
    document.getElementById('game-container')?.appendChild(this.stats.dom);
    // end stats

    const graphics = this.add.graphics();
    graphics.fillStyle(0x15130f, 1);

    this.reeling = new ReelsManager(this);
    this.winlines = new WinLineDisplay(this);

    EventBus.emit('current-scene-ready', this);
  }

  spinAllReels(): Promise<void[]> {
    return this.reeling.spinAllReels();
  }

  handleBetResult(data: BetResult) {
    //log.debug('phaser bet result receive', data);
    this.reeling.drawWinningSymbols(data.symbols);
    this.winlines.setWinningLines(data.lines);
  }

  stopAllReels(): Promise<void[]> {
    return this.reeling.stopAllReels();
  }

  resetAllReels() {
    this.reeling.resetAllReels();
  }

  setUpdateSpin() {
    this.onUpdate = this.reeling.spin;
  }

  setUpdateStop() {
    this.onUpdate = this.reeling.stop;
  }

  update() {
    this.stats.begin();
    this.onUpdate?.();
    this.stats.end();
  }
}
