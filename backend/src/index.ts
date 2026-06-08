import { fastify, type FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import ToadServerRoutes from "./routes";

// 1. Vår nydöpta server-variabel
const toadsFastityServer: FastifyInstance = fastify({ logger: true });

function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(`Saknar enviroment variabeln: ${name}`);
  }
  return value;
}

function getServerConfig() {
  const clientOrigin = requireEnv("FRONTEND_URL", Bun.env.FRONTEND_URL);
  const port = Number(Bun.env.BACKEND_PORT) || 3015;

  return { clientOrigin, port };
}

const { clientOrigin, port } = getServerConfig();

async function registerPlugins() {
  await toadsFastityServer.register(fastifyCors, {
    origin: clientOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });

  await toadsFastityServer.register(fastifyHelmet);

  await toadsFastityServer.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
}

async function checkDatabase() {
  try {
    toadsFastityServer.log.info("Databas ansluten");
  } catch (error) {
    toadsFastityServer.log.error("Kunde inte ansluta till databasen");
    toadsFastityServer.log.error(error);
    process.exit(1);
  }
}

toadsFastityServer.register(ToadServerRoutes, { prefix: '/api' });

async function start(): Promise<void> {
  await checkDatabase();
  await registerPlugins();

  try {
    // Lyssna på alla nätverkskort (0.0.0.0) så att Docker-nätverket kan nå den
    await toadsFastityServer.listen({ host: "0.0.0.0", port });
  } catch (error) {
    toadsFastityServer.log.error(error);
    process.exit(1);
  }

  toadsFastityServer.log.info(`Server körs på http://localhost:${port}`);
}

start();
