import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../src/index.ts"
const client = edenTreaty<App>("http://localhost:3000")

client.index.GET().then(console.log())

client.protect.GET({
    $query:{
        token: 12345
    }
}).then(console.log)