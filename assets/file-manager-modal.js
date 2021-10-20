import { FileManagerModal } from "mini-file-manager";
import "mini-file-manager/dist/style.css";

import "./file-manager-modal.css";

let pickerElt = document.querySelector("#file-picker");
let outputElt = document.querySelector("#output")
let options = JSON.parse(pickerElt.dataset.props);

pickerElt.addEventListener("click", () => {
  
  new FileManagerModal(options, (selectedFiles) => {
    outputElt.innerHTML = JSON.stringify(selectedFiles, null, 2);
  }, () => {
    outputElt.innerHTML = '';
  });
  
})

