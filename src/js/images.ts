import Images from "../../assets/images/*.png";
import { iterate } from "./utils";

export default Object.assign(...iterate(Images, ""));
