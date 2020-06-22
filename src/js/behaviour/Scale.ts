const DEFAULT_SCALE = 1;

export class Scale {
  constructor(scene, owner, options) {
    const scale = options && options.value ? options.value : DEFAULT_SCALE;

    owner.setScale(scale);
  }

  update(delta): void {}
}
