export let cupCategory: number = 0;
export let dropCategory: number = 0;
export let tableCategory: number = 0;

export function initCategories(scene: Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics }): void {
  scene.matter.world.resetCollisionIDs();
  cupCategory = scene.matter.world.nextCategory();
  dropCategory = scene.matter.world.nextCategory();
  tableCategory = scene.matter.world.nextCategory();
}
