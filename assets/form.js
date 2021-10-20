import { FormFilePicker } from "mini-file-manager";
import "mini-file-manager/dist/style.css";

document.querySelectorAll(".file-picker").forEach((elt) => {
  new FormFilePicker(elt);
});

