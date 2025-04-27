import { Boot } from './scenes/Boot';
import { BaseSlotScene as MainGame } from './scenes/BaseSlotScene';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 720,
  height: 414,
  parent: 'game-container',
  backgroundColor: '181611',
  scale: {
    mode: Phaser.Scale.FIT,
  },
  scene: [Boot, MainGame],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
