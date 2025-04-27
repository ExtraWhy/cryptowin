import { BaseSlotScene } from './scenes/BaseSlotScene';

let slotScene: Phaser.Scene;
let base_scene: BaseSlotScene;

export function registerScene(scene: Phaser.Scene) {
  console.log('registered scene');
  slotScene = scene;
  base_scene = slotScene as BaseSlotScene;
  let arr: number[] = [1, 2, 3, 4, 5, 109];
  //let ar = arr.myMap((el) => el + 1);
  let ar = arr.myReducer((ac, cur) => ac + cur, 0);
  //console.log('my map', ar);

  let s = '()opqiwjer{[]}';
  //console.log(`is ${s} a string with valid brackets`, hasValidBrackets(s));
}

function hasValidBrackets(s: string): boolean {
  let opening_brackets = ['{', '[', '('];
  let closing_brackets = ['}', ']', ')'];
  let brackets: any[] = [];
  for (let c of s) {
    //console.log('c', c);
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
};
