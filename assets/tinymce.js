// import { FileManagerModal } from "mini-file-manager";
// import "mini-file-manager/dist/mini-file-manager.css";

import { fileManagerModal } from "../extra/mini-file-manager/src/index";

let fileManagerOptions = {
  endPoint: '/media-manager',
  entryPoints: [
    {
      'label': 'Uploads',
      'directory': 'tinymce',
      'origin': 'public_uploads',
    }
  ],
  theme: "mini-file-manager-tinymce",
  fileUpload: {
    maxFileSize: 512 * 1024
  }
}
let basePath = `${document.location.origin}/uploads/`

// More infos on :
// https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_callback
tinymce.init({
  selector: 'textarea',
  plugins: 'image code',
  toolbar: 'undo redo | link image | code',
  min_height: 500,
  file_picker_callback: function(callback, value, meta) {
    let selection = [];
    if (value.indexOf(basePath) === 0) {
      selection.push(value.substr(basePath.length))
    }

    fileManagerModal({
      ...fileManagerOptions,
      originalSelection: selection
    }, (selectedFiles) => {
      let file = selectedFiles[0];
      callback(file.url);
    }, () => {
      callback(value);
    });

  }
})