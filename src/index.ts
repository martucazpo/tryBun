import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie"



const app = new Elysia()
  //global hooks get headers
  // .onRequest(async (request) => {
  //   //get headers
  //   console.log(request.headers)
  // })
  .use(cookie())
  .get("/mycookie", ({setCookie})=>{
    setCookie("mycookie", "my value cookie", {
      secure: true,
    })
  })
  .get("/", () => "Hello Elysia, HOW YOU DOING?")
  .post("/add", ({ body }) => {
    console.log(body.username)
    return JSON.stringify(body)
  })
  //validate body request with schema
  .post("/validatebody", ({ body }) => {
    return {
      "id": body.id,
      "username": body.username
    }
  }, {
    schema: {
      body: t.Object({
        id: t.Number(),
        username: t.String()
      })
    }
  })
  //get params id from get request
  .get("/id/:id", (context) => {
    console.log("params ", context.params.id)
    return {
      "id": context.params.id
    }
  })
  // get query name and id
  .get("/query", ({ query }) => {
    return {
      "id": query.id,
      "name": query.name
    }
  })
  //transform 
  .post("/transform", ({ body }) => body, {
    transform: ({ body }) => {
      body.id += 1
    }
  })
  //state and decorate
  .decorate("yourDecour", () => Date.now())
  .state("counter", 10)
  .get("/mystate", ({
    yourDecour,
    store: { counter }
  }) => `${counter} ${yourDecour()}`)
  //protecting route
  .guard({
    schema: {
      query: t.Object({
        token: t.String()
      })
    }
  }, (app) => app.get("/protect", ({ query }) => {
    if (query.token === '12345') {
      return "Welcome, you have access"
    }
    return "Unauthorized"
  })
    .post("/checktoken", ({ body, query }) => {
      return {
        "name": query.name
      }
    }, {
      schema: {
        body: t.Object({
          id: t.Number(),
          username: t.String(),
          profile: t.Object({
            name: t.String()
          })
        })
      }
    })
  )

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app
