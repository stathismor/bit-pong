import Sounds from "../../assets/sounds/*.mp3";
import { iterate } from "./utils";

export default Object.assign(...iterate(Sounds, ""));
