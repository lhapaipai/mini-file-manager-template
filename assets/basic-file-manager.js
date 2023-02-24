import { fileManager } from "../extra/mini-file-manager/src/index";

// import {fileManager} from "mini-file-manager";
// import "mini-file-manager/dist/style.css";

// config is parsed from data-minifilemanager
fileManager("#file-manager", {
  endPoint: '/media-manager',
  entryPoints: [
    {
      directory: 'manager',
      readOnly: false,
      icon: 'famfm-folder',
      label: 'Manager',

      origin: 'public_uploads',
      webPrefix: '/uploads'
    },
    {
      directory: '',
      readOnly: false,
      icon: 'famfm-folder',
      label: 'Secret',

      origin: 'private_uploads',
      webPrefix: ''
    }
  ],
  indexes: true,
  canRenameFile: false
});
