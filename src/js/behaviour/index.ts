import { Rotate } from "./Rotate";
import { Move } from "./Move";
import { SetBody } from "./SetBody";
import { Scale } from "./Scale";
import { Fountain } from "./Fountain";

const BEHAVIOUR_MAPPER = {
  rotate: Rotate,
  move: Move,
  setBody: SetBody,
  fountain: Fountain,
  scale: Scale,
};

export default BEHAVIOUR_MAPPER;
