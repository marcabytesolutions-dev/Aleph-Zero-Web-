import {defineConfig} from 'vite';
export default defineConfig({
  base:'./',
  build:{
    outDir:'../web',
    emptyOutDir:false,
    lib:{entry:'src/main.js',name:'AlephZero',formats:['iife'],fileName:'app',cssFileName:'styles'},
  },
});
