import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function ToadServerRoutes(
  toadFastifyServer: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  
  toadFastifyServer.route({
    method: "GET",
    url: "/health",
    handler: async () => {
      return { status: "We are ribbiting!" };
    },
  });

}