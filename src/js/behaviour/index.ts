import { Rotate } from "./Rotate";
import { Move } from "./Move";
import { SetBody } from "./SetBody";
import { Scale } from "./Scale";
import { ScaleTween } from "./ScaleTween";
import { Fountain } from "./Fountain";
import { RandomPosition } from "./RandomPosition";
import { RandomAngle } from "./RandomAngle";

const BEHAVIOUR_MAPPER = {
  rotate: Rotate,
  move: Move,
  setBody: SetBody,
  fountain: Fountain,
  scale: Scale,
  scaleTween: ScaleTween,
  randomPosition: RandomPosition,
  randomAngle: RandomAngle,
};

export default BEHAVIOUR_MAPPER;
