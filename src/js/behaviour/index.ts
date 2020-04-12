import { Rotate } from "./Rotate";
import { Move } from "./Move";
import { SetBody } from "./SetBody";

const BEHAVIOUR_MAPPER = {
  rotate: Rotate,
  move: Move,
  setBody: SetBody,
};

export default BEHAVIOUR_MAPPER;
