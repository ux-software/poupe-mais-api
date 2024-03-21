declare module 'fastify' {
  interface User {
    id: string;
    username: string;
  }

  interface FastifyRequest {
    user?: User;
  }
}

export {};
