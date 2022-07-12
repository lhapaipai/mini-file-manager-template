import { defineConfig } from 'vite'
import { resolve } from "path";
import { unlinkSync, existsSync } from "fs";
import vue from "@vitejs/plugin-vue";
import postcssConfig from "./postcss.config.js";
import Inspect from 'vite-plugin-inspect'
import fs from "fs";

import symfonyPlugin from 'vite-plugin-symfony';
import copy from 'rollup-plugin-copy'

export default defineConfig({
  plugins: [symfonyPlugin(), vue()],
  server: {
    watch: {
      disableGlobbing: false,
    },
    fs: {
      strict: false,
      allow: [".."],
    },
    // https: {
    //   key: fs.readFileSync('.local/certs/localhost.key'),
    //   cert: fs.readFileSync('.local/certs/localhost.crt'),
    // },
    // cors: ["https://127.0.0.1:8000"],
    // origin: 'http://localhost:3000'
  },
  css: {
    postcss: postcssConfig
  },
  root: ".",
  base: "/build/",
  publicDir: "images_to_copy",
  build: {
    manifest: true,
    emptyOutDir: true,
    assetsDir: "",
    outDir: "./public/build/",
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
        "fileManager": "./assets/file-manager.js",
        "fileManagerModal": "./assets/file-manager-modal.js",
        "form": "./assets/form.js",
        "tinymce": "./assets/tinymce.js",
        "ckeditor": "./assets/ckeditor.js",
        "ogoxeTheme": "./assets/ogoxe-ui/app.js",
        "formFilePicker": "./assets/form-file-picker.js"
      },
    },
  },
  resolve: {
    alias: {
      'mini-file-manager': '../../mini-file-manager'
    }
  }
});
