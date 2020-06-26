import { Rotate } from "./Rotate";
import { Move } from "./Move";
import { SetBody } from "./SetBody";
import { Scale } from "./Scale";
import { ScaleTween } from "./ScaleTween";
import { Fountain } from "./Fountain";

const BEHAVIOUR_MAPPER = {
  rotate: Rotate,
  move: Move,
  setBody: SetBody,
  fountain: Fountain,
  scale: Scale,
  scaleTween: ScaleTween,
};

export default BEHAVIOUR_MAPPER;
