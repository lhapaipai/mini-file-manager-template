import { openFileManager } from "mini-file-manager";
import "mini-file-manager/dist/style.css";

import "./file-picker.css";

let pickerElt = document.querySelector("#file-picker");
let outputElt = document.querySelector("#output")
let options = JSON.parse(pickerElt.dataset.props);

pickerElt.addEventListener("click", () => {
  
  openFileManager(options, (selectedFiles) => {
    outputElt.innerHTML = JSON.stringify(selectedFiles, null, 2);
  }, () => {
    outputElt.innerHTML = '';
  });
  
})

