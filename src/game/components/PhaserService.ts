import { BetResult } from '@/lib/api/types';
import { BaseSlotScene } from '@/game/scenes/BaseSlotScene';

let slotScene: Phaser.Scene;
let base_scene: BaseSlotScene;

export function registerScene(scene: Phaser.Scene) {
  slotScene = scene;
  base_scene = slotScene as BaseSlotScene;
}

export const slotAPI = {
  startSpin: () => {
    // Returns a Promise which the state machine transitions to spinning state, after start is complete by getting server bet response and initial nudge animation
    return base_scene.spinAllReels();
  },
  stopSpin: () => base_scene.stopAllReels(),
  setUpdateSpin: () => base_scene.setUpdateSpin(),
  setUpdateStop: () => base_scene.setUpdateStop(),
  resetAllReels: () => base_scene.resetAllReels(),
  handleBetResult: (data: BetResult) => base_scene.handleBetResult(data),
  showLineWins: () =>
    base_scene.winlines.showWinningLines(base_scene.reeling.animateWinningLine),
  clearWins: () => {
    base_scene.winlines.clearWins();
    base_scene.reeling.clearAnimatingSymbols();
  },
};
