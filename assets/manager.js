import { createFileManager } from "mini-file-manager";
import "mini-file-manager/dist/style.css";

import "./manager.scss";

// config is parsed from data-props
createFileManager("#file-manager");
