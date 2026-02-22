import * as constants from "../constants";

const TRACE_DISTANCE = 60;

interface LaunchableSprite extends Phaser.Physics.Matter.Sprite {
  launched: boolean;
}

export class OwnerTrace {
  scene: Phaser.Scene;
  owner: LaunchableSprite;
  prevOwnerTracePos: { x: number; y: number };
  ownerTraceGroup: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene, owner: Phaser.Physics.Matter.Sprite, frame: string) {
    this.scene = scene;
    this.owner = owner as LaunchableSprite;
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

  update(): void {
    if (
      this.owner.launched &&
      (this.owner.body as MatterJS.BodyType).speed > 3 &&
      Phaser.Math.Distance.Between(
        this.prevOwnerTracePos.x,
        this.prevOwnerTracePos.y,
        this.owner.x,
        this.owner.y,
      ) > TRACE_DISTANCE
    ) {
      const ownerTrace = this.ownerTraceGroup.getFirstDead() as Phaser.GameObjects.Image | null;
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

  static onComplete(tween: Phaser.Tweens.Tween): void {
    const target = tween.targets[0] as Phaser.GameObjects.Image;
    target.setVisible(false);
    target.setActive(false);
  }
}
