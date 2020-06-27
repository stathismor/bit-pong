import * as constants from "../constants";

const TRACE_DISTANCE = 60;

export class OwnerTrace {
  constructor(scene, owner, frame) {
    this.scene = scene;
    this.owner = owner;
    this.prevOwnerTracePos = { x: owner.x, y: owner.y };

    this.ownerTraceGroup = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame,
      repeat: 12,
      active: false,
      visible: false,
      setScale: { x: owner.scale, y: owner.scale },
    });
  }

  update(delta): void {
    if (
      this.owner.launched &&
      this.owner.body.speed > 3 &&
      Phaser.Math.Distance.Between(
        this.prevOwnerTracePos.x,
        this.prevOwnerTracePos.y,
        this.owner.x,
        this.owner.y
      ) > TRACE_DISTANCE
    ) {
      const ownerTrace = this.ownerTraceGroup.getFirstDead();
      if (ownerTrace) {
        ownerTrace.x = this.owner.x;
        ownerTrace.y = this.owner.y;
        ownerTrace.rotation = this.owner.rotation;
        ownerTrace.setActive(true);
        ownerTrace.setVisible(true);

        this.scene.tweens.add({
          targets: ownerTrace,
          ease: "Sine.easeOut",
          duration: 550,
          delay: 0,
          pause: false,
          onComplete: OwnerTrace.onComplete,
          alpha: {
            getStart: (): number => 0.17,
            getEnd: (): number => 0,
          },
        });
        this.prevOwnerTracePos = { x: this.owner.x, y: this.owner.y };
      }
    }
  }

  static onComplete(tween): void {
    const target = tween.targets[0];
    target.setVisible(false);
    target.setActive(false);
  }
}
