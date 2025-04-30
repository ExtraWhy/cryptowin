import WebSocketManager, { ServerMessage } from '@/lib/ws';
import { Scene, Display } from 'phaser';
import Stats from 'stats.js';
import { EventBus } from '../EventBus';
import { ReelMachine } from './Reeling';
import { BetResult } from '@/lib/api/types';
export class BaseSlotScene extends Scene {
  public reeling!: ReelMachine;
  public onUpdate: (() => void) | null = null;

  private stats = new Stats();
  static elements: number[] = [5, 8, 9, 12, 301];

  constructor() {
    console.log('cosonel');
    super('BaseSlotScene');
  }

  create() {
    console.log('create');
    //this.ws.connect('ws://localhost:8081/ws');
    // stats
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
    this.stats.dom.style.position = 'absolute';
    document.getElementById('game-container')?.appendChild(this.stats.dom);
    // end stats

    const graphics = this.add.graphics();
    graphics.fillStyle(0x15130f, 1);

    this.reeling = new ReelMachine(this);

    EventBus.emit('current-scene-ready', this);
  }

  spinAllReels(): Promise<void[]> {
    return this.reeling.spinAllReels();
  }

  handleBetResult(data: BetResult) {
    console.log('phaser bet result receive', data);
    this.reeling.drawWinningSymbols(data.symbols);
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

  //Array.prototype.map = (()) : number[] => {
}
Array.prototype.myReducer = function <T, U>(
  this: T[],
  reducer: (
    accumulator: U,
    currentValue: T,
    currentIndex: number,
    array: T[],
  ) => U,
  initialValue?: U,
): U {
  if (typeof reducer !== 'function') {
    throw new Error(
      `Invalid reducer function provided! Provided value is ${reducer}`,
    );
  }

  let hasInitialValue = arguments.length >= 2;
  if (this.length === 0 && !hasInitialValue) {
    throw new TypeError('Reduce of empty array with no initial value!');
  }
  let accumulatedValue: U = hasInitialValue ? initialValue : (this[0] as U);
  let i: number = hasInitialValue ? 1 : 0;
  for (i; i < this.length; i++) {
    accumulatedValue = reducer(accumulatedValue, this[i], i, this);
  }

  return accumulatedValue;
};

Array.prototype.myMap = function <T, U>(
  this: T[],
  mapper: (element: T, index: number, array: T[]) => U,
): U[] {
  if (typeof mapper !== 'function') {
    throw new TypeError(mapper + ' is not a function');
  }
  let new_elements: U[] = [];
  const length: number = this.length;
  for (let i: number = 0; i < length; i++) {
    if (i in this) new_elements.push(mapper(this[i], i, this));
  }
  return new_elements;
};
