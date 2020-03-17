export default class Move {
  constructor(scene, owner) {
    scene.tweens.add({
      targets: owner,
      ease: 'Sine.easeInOut',
      duration: 2100,
      yoyo: true,
      x: 550,
      repeat: -1
    });
  }

  update() {}
}
