import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import vue from "@vitejs/plugin-vue";
import fs from 'fs';
import dotenv from 'dotenv';
import path from "path";

let entryPoints = {
  "app": "./assets/app.scss",
  "fileManager": "./assets/file-manager.js",
  "fileManagerModal": "./assets/file-manager-modal.js",
  "fileManagerPreview": "./assets/file-manager-preview.js",
  "formFilePicker": "./assets/form-file-picker.js",
  "tinymce": "./assets/tinymce.js",
  "ckeditor": "./assets/ckeditor.js"
};

let cwd = process.cwd();
let envFiles = ['.env', '.env.local']

let themes = [];
envFiles.map(envFile => path.join(cwd, envFile))
  .filter(fs.existsSync)
  .map(envFile => fs.readFileSync(envFile))
  .map(dotenv.parse)
  .forEach(vars => {
    if (vars.THEMES) {
      themes = JSON.parse(vars.THEMES)
    }
  })

themes.forEach(theme => {
  entryPoints[theme + 'Theme'] = `./themes/${theme}/index.scss`
})


export default defineConfig({
    plugins: [
        /* react(), // if you're using React */
        vue(),
        symfonyPlugin(),
    ],
    build: {
        rollupOptions: {
            input: entryPoints,
        },
    },
    server: {
        fs: {
            allow: ['..']
        }
    }
});
