const M = Phaser.Physics.Matter.Matter;
const SIDE_WITH = 10;
const SIDES_ANGLE = 13;
const OFFSET = 2;
const CHAMFER_RADIUS = 7;

export default class SetBody {
  constructor(scene, owner, shape, x, y, angle, sensor) {
    switch (shape) {
      case "ball":
        owner.setCircle();
        break;
      case "cup":
        const cupLeft = M.Bodies.rectangle(
          SIDE_WITH + OFFSET,
          owner.height / 2,
          SIDE_WITH,
          owner.height,
          {
            angle: Phaser.Math.DegToRad(-SIDES_ANGLE),
            chamfer: { radius: CHAMFER_RADIUS },
          }
        );
        const cupRight = M.Bodies.rectangle(
          owner.width - SIDE_WITH - OFFSET,
          owner.height / 2,
          SIDE_WITH,
          owner.height,
          {
            angle: Phaser.Math.DegToRad(SIDES_ANGLE),
            chamfer: { radius: CHAMFER_RADIUS },
          }
        );

        const parts = [cupLeft, cupRight];
        if (sensor) {
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

  update() {}
}
