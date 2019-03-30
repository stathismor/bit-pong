export let cupCategory = null;
export let dropCategory = null;
export let tableCategory = null;

export function initCategories(scene) {
  cupCategory = scene.matter.world.nextCategory();
  dropCategory = scene.matter.world.nextCategory();
  tableCategory = scene.matter.world.nextCategory();
}
