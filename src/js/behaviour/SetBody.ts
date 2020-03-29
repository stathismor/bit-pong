const M = Phaser.Physics.Matter.Matter;
const SIDE_WITH = 10;
const SIDES_ANGLE = 13;
const OFFSET = 2;
const CHAMFER_RADIUS = 7;
const CHAMFER_RADIUS_BOTTOM = 2;

export default class SetBody {
  constructor(scene, owner, shape, x, y, angle, hasSensor) {
    switch (shape) {
      case "ball":
        owner.setCircle();
        break;
      case "cup":
        const cupLeft = M.Bodies.rectangle(
          SIDE_WITH + OFFSET,
          owner.height / 2 - OFFSET,
          SIDE_WITH,
          owner.height - OFFSET,
          {
            angle: Phaser.Math.DegToRad(-SIDES_ANGLE),
            chamfer: { radius: CHAMFER_RADIUS },
          }
        );
        const cupRight = M.Bodies.rectangle(
          owner.width - SIDE_WITH - OFFSET,
          owner.height / 2 - OFFSET,
          SIDE_WITH,
          owner.height - OFFSET,
          {
            angle: Phaser.Math.DegToRad(SIDES_ANGLE),
            chamfer: { radius: CHAMFER_RADIUS },
          }
        );

        const cupBottom = M.Bodies.rectangle(
          owner.width / 2,
          owner.height - SIDE_WITH + 2 * OFFSET,
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
            owner.height - 25,
            20,
            25,
            { isSensor: true }
          );
          parts.push(sensor);
        }

        const compoundBody = M.Body.create({
          parts,
        });

        owner.setExistingBody(compoundBody).setAngle(angle).setPosition(x, y);
        break;
      default:
        // OOPs
        break;
    }
  }

  update(): void {
    // Not implemented
  }
}
