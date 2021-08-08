// import { createFileManager } from "mini-file-manager";
// import "mini-file-manager/dist/style.css";

import { createFileManager } from "mini-file-manager/src/main-without-theme";

import "mini-file-manager/src/css/index.scss";
import "mini-notifier/dist/style.css";

// config is parsed from data-props
createFileManager("#file-manager");
