import { createFormFilePicker } from "mini-file-manager/src/main";
// import "mini-file-manager/dist/style.css";

document.querySelectorAll(".file-picker").forEach((elt) => {
  createFormFilePicker(elt);
});

