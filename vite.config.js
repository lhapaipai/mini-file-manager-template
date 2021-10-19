import { defineConfig } from 'vite'
import { resolve } from "path";
import { unlinkSync, existsSync } from "fs";
import vue from "@vitejs/plugin-vue";
import postcssConfig from "./postcss.config.js";

const symfonyPlugin = {
  name: "symfony",
  configResolved(config) {
    if (config.env.DEV && config.build.manifest) {
      let buildDir = resolve(config.root, config.build.outDir, "manifest.json");
      existsSync(buildDir) && unlinkSync(buildDir);
    }
  },
  configureServer(devServer) {
    let { watcher, ws } = devServer;
    watcher.add(resolve("templates/**/*.twig"));
    watcher.on("change", function (path) {
      if (path.endsWith(".twig")) {
        ws.send({
          type: "full-reload",
        });
      }
    });
  },
};

export default defineConfig({
  plugins: [symfonyPlugin, vue()],
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
      input: [
        "./assets/app.js",
        "./assets/file-manager.js",
        "./assets/file-picker.js",
        "./assets/form.js",
        "./assets/tinymce.js",
        "./assets/ckeditor.js",
      ],
    },
  },
});
