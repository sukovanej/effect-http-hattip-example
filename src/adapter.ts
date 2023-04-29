import { HattipHandler } from "@hattip/core";
import * as Http from "effect-http";
import * as Effect from "@effect/io/Effect";
import { pipe } from "@effect/data/Function";
import {
  ValidationErrorFormatterService,
  defaultValidationErrorFormatterServer,
} from "effect-http/dist/Server/ValidationErrorFormatter";

export const hattip = (api: Http.Server<never, []>): HattipHandler => {
  return async (ctx) => {
    const request = ctx.request;
    const url = new URL(request.url);

    const handler = api.handlers.find(
      (handler) =>
        handler.endpoint.method == request.method.toLowerCase() &&
        handler.endpoint.path == new URL(request.url).pathname
    );

    if (handler === undefined) {
      return new Response(
        JSON.stringify({ message: "Not found" }),
        { status: 404 }
      );
    }

    try {
      const query = Array.from(url.searchParams.entries()).reduce(
        (acc, [name, value]) => ({ ...acc, [name]: value }),
        {}
      );
      const headers = Array.from(request.headers.entries()).reduce(
        (acc, [name, value]) => ({ ...acc, [name]: value }),
        {}
      );
      const params = undefined; // unimplemented
      let body = request.body;
      const contentType = headers["content-type"];

      if (contentType === "application/json") {
        body = await request.json();
      }

      const response = await Effect.runPromise(handler.fn({ query, body, params, headers }));

      return new Response(JSON.stringify(response.body), {
        status: response.statusCode,
        headers: response.headers,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Internal server error" }),
        { status: 500 }
      );
    }
  };
};
