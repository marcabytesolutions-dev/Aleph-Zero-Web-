import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests',testMatch:'*.spec.js',fullyParallel:false,workers:1,
  reporter:[['list'],['json',{outputFile:'docs/checks/browser-results.json'}]],
  use:{baseURL:'http://127.0.0.1:4174',channel:'msedge',headless:true,viewport:{width:1440,height:1000},trace:'retain-on-failure'},
  webServer:{command:'npm run dev',url:'http://127.0.0.1:4174',reuseExistingServer:true,timeout:30000},
});
