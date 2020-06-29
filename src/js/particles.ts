import * as constants from "./constants";

export let successEmitter = null;
export let spillParticles = null;
export let rainParticles = null;

export function initParticles(scene): void {
  const config = scene.sys.game.CONFIG;
  spillParticles = scene.add.particles(constants.TEXTURE_ATLAS).setDepth(10);
  rainParticles = scene.add.particles(constants.TEXTURE_ATLAS).setDepth(30);

  successEmitter = spillParticles.createEmitter({
    speedY: { min: 200, max: 400 },
    lifespan: { min: 1500, max: 2500 },
    quantity: 3,
    on: false,
    x: { min: 0, max: config.width },
    y: 0,
    frame: ["drop_dark", "drop_light"],
    alpha: { start: 1, end: 0.25, ease: "Quint.easeIn" },
  });
  successEmitter.setFrame(["drop_dark", "drop_light"]);

  scene.events.once("shutdown", spillParticles.destroy);
  scene.events.once("shutdown", rainParticles.destroy);
}
