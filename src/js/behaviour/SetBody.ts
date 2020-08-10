const M = Phaser.Physics.Matter.Matter;
const SIDE_WITH = 10;
const SIDES_ANGLE = 13;
const OFFSET = 8;
const SIDES_OFFSET_X = 10;
const SIDES_OFFSET_Y = 4;
const CHAMFER_RADIUS = 5;
const CHAMFER_RADIUS_BOTTOM = 4;

export class SetBody {
  constructor(scene, owner, shape, x, y, angle, hasSensor) {
    if (shape.startsWith("ball") && !shape.includes("admin")) {
      owner.setCircle();
    } else if (shape.startsWith("cup")) {
      this.setCup(owner, x, y, angle, hasSensor);
    } else {
      // Default to rectangle (like admin buttons)
    }
  }

  setCup(owner, x, y, angle, hasSensor): void {
    const cupLeft = M.Bodies.rectangle(
      SIDE_WITH + SIDES_OFFSET_X,
      owner.height / 2 - OFFSET + SIDES_OFFSET_Y,
      SIDE_WITH,
      owner.height - OFFSET,
      {
        angle: Phaser.Math.DegToRad(-SIDES_ANGLE),
        chamfer: { radius: CHAMFER_RADIUS },
      }
    );
    const cupRight = M.Bodies.rectangle(
      owner.width - SIDE_WITH - SIDES_OFFSET_X,
      owner.height / 2 - OFFSET + SIDES_OFFSET_Y,
      SIDE_WITH,
      owner.height - OFFSET,
      {
        angle: Phaser.Math.DegToRad(SIDES_ANGLE),
        chamfer: { radius: CHAMFER_RADIUS },
      }
    );

    const cupBottom = M.Bodies.rectangle(
      owner.width / 2,
      owner.height - SIDE_WITH + 0.5 * OFFSET,
      owner.width / 2,
      SIDE_WITH,
      {
        chamfer: { radius: CHAMFER_RADIUS_BOTTOM },
      }
    );

    const parts = [cupLeft, cupRight, cupBottom];
    if (hasSensor) {
      const sensor = M.Bodies.rectangle(
        owner.width / 2,
        owner.height - 50,
        35,
        50,
        { isSensor: true }
      );
      parts.push(sensor);
    }

    const compoundBody = M.Body.create({
      parts,
    });

    owner.setExistingBody(compoundBody).setAngle(angle).setPosition(x, y);
  }

  update(): void {
    // Not implemented
  }
}
