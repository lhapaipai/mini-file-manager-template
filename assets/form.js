import { FormFilePicker } from "../../mini-file-manager/src/index";
// import { FormFilePicker } from "mini-file-manager";
// import "mini-file-manager/dist/mini-file-manager.css";

document.querySelectorAll(".file-picker").forEach((elt) => {
  FormFilePicker(elt);
});

