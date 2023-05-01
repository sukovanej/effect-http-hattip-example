import { HattipHandler } from "@hattip/core";
import * as Http from "effect-http";
import * as Effect from "@effect/io/Effect";

export const hattip = (api: Http.Server<never, []>): HattipHandler => {
  return async (ctx) => {
    const request = ctx.request;

    const handler = api.handlers.find(
      (handler) =>
        handler.endpoint.method == request.method.toLowerCase() &&
        handler.endpoint.path == new URL(request.url).pathname
    );

    if (handler === undefined) {
      return new Response(JSON.stringify({ message: "Not found" }), {
        status: 404,
      });
    }

    try {
      return await Effect.runPromise(handler.fn(request));
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Internal server error" }),
        { status: 500 }
      );
    }
  };
};
