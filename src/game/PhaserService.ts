import { BetResult } from '@/lib/api/types';
import { BaseSlotScene } from './scenes/BaseSlotScene';

let slotScene: Phaser.Scene;
let base_scene: BaseSlotScene;

export function registerScene(scene: Phaser.Scene) {
  slotScene = scene;
  base_scene = slotScene as BaseSlotScene;
}

function hasValidBrackets(s: string): boolean {
  let opening_brackets = ['{', '[', '('];
  let closing_brackets = ['}', ']', ')'];
  let brackets: any[] = [];
  for (let c of s) {
    if (opening_brackets.indexOf(c) !== -1) {
      brackets.push(closing_brackets[opening_brackets.indexOf(c)]);
    } else if (brackets.indexOf(c) !== -1) {
      let closed_bracket = brackets.pop();
      //If closing bracket not matching opened string has invalid brackets and we exit
      if (closed_bracket != c) return false;
    }
  }

  // If everything is ok and all brackets are removed from the stack and during for check then string has valid brackets or no brackets at all
  return brackets.length === 0;
}

export const slotAPI = {
  startSpin: () => {
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
