import { fileManagerModal } from "../extra/mini-file-manager/src/index";
// import { FileManagerModal } from "mini-file-manager";
// import "mini-file-manager/dist/mini-file-manager.css";

let pickerElt = document.querySelector("#file-picker");
let outputElt = document.querySelector("#output")
let options = JSON.parse(pickerElt.dataset.minifilemanager);

pickerElt.addEventListener("click", () => {
  
  fileManagerModal(options, (selectedFiles) => {
    outputElt.innerHTML = JSON.stringify(selectedFiles, null, 2);
  }, () => {
    outputElt.innerHTML = '';
  });
  
})

