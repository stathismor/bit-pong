const SIDE_WITH = 10;
const SIDES_ANGLE = 13;
const OFFSET = 8;
const SIDES_OFFSET_X = 10;
const SIDES_OFFSET_Y = 4;
const CHAMFER_RADIUS = 5;
const CHAMFER_RADIUS_BOTTOM = 4;

interface MatterScene extends Phaser.Scene {
  matter: Phaser.Physics.Matter.MatterPhysics;
}

export class SetBody {
  constructor(scene: Phaser.Scene, owner: Phaser.Physics.Matter.Sprite, shape: string, x: number, y: number, angle: number, hasSensor: boolean) {
    if (shape.startsWith("ball") && !shape.includes("admin")) {
      owner.setCircle(owner.width / 2);
    } else if (shape.startsWith("cup")) {
      this.setCup(scene, owner, x, y, angle, hasSensor);
    } else {
      // Default to rectangle (like admin buttons)
    }
  }

  setCup(scene: Phaser.Scene, owner: Phaser.Physics.Matter.Sprite, x: number, y: number, angle: number, hasSensor: boolean): void {
    const matter = (scene as MatterScene).matter;
    const Bodies = matter.bodies;
    const Body = matter.body;

    const cupLeft = Bodies.rectangle(
      SIDE_WITH + SIDES_OFFSET_X,
      owner.height / 2 - OFFSET + SIDES_OFFSET_Y,
      SIDE_WITH,
      owner.height - OFFSET,
      {
        angle: Phaser.Math.DegToRad(-SIDES_ANGLE),
        chamfer: { radius: CHAMFER_RADIUS },
      },
    );
    const cupRight = Bodies.rectangle(
      owner.width - SIDE_WITH - SIDES_OFFSET_X,
      owner.height / 2 - OFFSET + SIDES_OFFSET_Y,
      SIDE_WITH,
      owner.height - OFFSET,
      {
        angle: Phaser.Math.DegToRad(SIDES_ANGLE),
        chamfer: { radius: CHAMFER_RADIUS },
      },
    );

    const cupBottom = Bodies.rectangle(
      owner.width / 2,
      owner.height - SIDE_WITH + 0.5 * OFFSET,
      owner.width / 2,
      SIDE_WITH,
      {
        chamfer: { radius: CHAMFER_RADIUS_BOTTOM },
      },
    );

    const parts = [cupLeft, cupRight, cupBottom];
    if (hasSensor) {
      const sensor = Bodies.rectangle(
        owner.width / 2,
        owner.height - 50,
        35,
        50,
        { isSensor: true },
      );
      parts.push(sensor);
    }

    const compoundBody = Body.create({
      parts,
    });

    owner.setExistingBody(compoundBody).setAngle(angle).setPosition(x, y);
  }

  update(): void {
    // Not implemented
  }
}
