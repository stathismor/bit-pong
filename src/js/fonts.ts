import Fonts from "../../assets/fonts/*.xml";
import { iterate } from "./utils";

export default Object.assign(...iterate(Fonts, ""));
