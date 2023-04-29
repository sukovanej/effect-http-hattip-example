# Example hattip adapter for `effect-http`

Start the example serve with

```bash
$ pnpm tsx src/exampleApp.ts
```

Try calling the server.

```bash
$ curl curl localhost:3000/my-operation
{"error":"InvalidQueryError","details":"name is missing"}

$ curl localhost:3000/my-operation\?name=test
{"name":"test"}
```
