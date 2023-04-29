import * as Http from "effect-http";
import * as Schema from "@effect/schema/Schema";
import * as Effect from "@effect/io/Effect";
import { pipe } from "@effect/data/Function";
import { hattip } from "./adapter";

import { createServer } from "@hattip/adapter-node";

const api = pipe(
  Http.api(),
  Http.get("myOperation", "/my-operation", {
    query: { name: Schema.string },
    response: Schema.struct({ name: Schema.string }),
  })
);

const server = pipe(
  Http.server(api),
  Http.handle("myOperation", ({ query: { name } }) => Effect.succeed({ name }))
);

createServer(hattip(server)).listen(3000, "localhost", () => {
  console.log("Server listening on http://localhost:3000");
});
