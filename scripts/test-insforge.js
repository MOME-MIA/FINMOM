const nextjs = require("@insforge/nextjs");
const nextjsServer = require("@insforge/nextjs/server").catch(() => { });
const nextjsApi = require("@insforge/nextjs/api").catch(() => { });

console.log("nextjs:", Object.keys(nextjs));
console.log("nextjsServer:", nextjsServer ? Object.keys(nextjsServer) : "not found");
console.log("nextjsApi:", nextjsApi ? Object.keys(nextjsApi) : "not found");
