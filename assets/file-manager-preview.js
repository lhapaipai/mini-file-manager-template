import { entityFormFilePicker } from "../extra/mini-file-manager/src/index";
// import {fileManager} from "mini-file-manager";
// import "mini-file-manager/dist/style.css";

let outputElt = document.querySelector("#output")

entityFormFilePicker('#file-manager-preview', null, [], (files) => {
  outputElt.innerHTML = JSON.stringify(files, null, 2);
})