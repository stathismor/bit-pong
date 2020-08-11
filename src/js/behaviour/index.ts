import { Rotate } from "./Rotate";
import { Move } from "./Move";
import { SetBody } from "./SetBody";
import { Scale } from "./Scale";
import { ScaleTween } from "./ScaleTween";
import { Fountain } from "./Fountain";
import { RandomPosition } from "./RandomPosition";
import { Jump } from "./Jump";
import { RandomAngle } from "./RandomAngle";
import { Orbit } from "./Orbit";

const BEHAVIOUR_MAPPER = {
  rotate: Rotate,
  move: Move,
  setBody: SetBody,
  fountain: Fountain,
  scale: Scale,
  scaleTween: ScaleTween,
  randomPosition: RandomPosition,
  randomAngle: RandomAngle,
  jump: Jump,
  orbit: Orbit,
};

export default BEHAVIOUR_MAPPER;
