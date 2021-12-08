import { defineConfig } from 'vite'
import { resolve } from "path";
import { unlinkSync, existsSync } from "fs";
import vue from "@vitejs/plugin-vue";
import postcssConfig from "./postcss.config.js";
import Inspect from 'vite-plugin-inspect'

import symfonyPlugin from 'vite-plugin-symfony';


export default defineConfig({
  plugins: [symfonyPlugin(), vue(), Inspect()],
  server: {
    watch: {
      disableGlobbing: false,
    },
    fs: {
      strict: false,
      allow: [".."],
    },
  },
  css: {
    postcss: postcssConfig
  },
  root: "./assets",
  base: "/build/",
  build: {
    manifest: true,
    emptyOutDir: true,
    assetsDir: "",
    outDir: "../public/build/",
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
        "fileManager": "./assets/file-manager.js",
        "fileManagerModal": "./assets/file-manager-modal.js",
        "form": "./assets/form.js",
        "tinymce": "./assets/tinymce.js",
        "ckeditor": "./assets/ckeditor.js",
      },
    },
  }
});
