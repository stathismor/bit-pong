import { Rotate } from "./Rotate";
import { Move } from "./Move";
import { SetBody } from "./SetBody";
import { Fountain } from "./Fountain";

const BEHAVIOUR_MAPPER = {
  rotate: Rotate,
  move: Move,
  setBody: SetBody,
  fountain: Fountain,
};

export default BEHAVIOUR_MAPPER;
