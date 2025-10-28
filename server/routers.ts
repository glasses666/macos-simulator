import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as docker from "./docker";
import * as ssh from "./ssh";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  docker: router({
    listContainers: protectedProcedure
      .input(z.object({ all: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        return await docker.listContainers(input?.all);
      }),
    listImages: protectedProcedure.query(async () => {
      return await docker.listImages();
    }),
    startContainer: protectedProcedure
      .input(z.object({ containerId: z.string() }))
      .mutation(async ({ input }) => {
        await docker.startContainer(input.containerId);
        return { success: true };
      }),
    stopContainer: protectedProcedure
      .input(z.object({ containerId: z.string() }))
      .mutation(async ({ input }) => {
        await docker.stopContainer(input.containerId);
        return { success: true };
      }),
    removeContainer: protectedProcedure
      .input(z.object({ containerId: z.string() }))
      .mutation(async ({ input }) => {
        await docker.removeContainer(input.containerId);
        return { success: true };
      }),
    runContainer: protectedProcedure
      .input(z.object({
        image: z.string(),
        name: z.string().optional(),
        ports: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const containerId = await docker.runContainer(input.image, input.name, input.ports);
        return { containerId };
      }),
    pullImage: protectedProcedure
      .input(z.object({ image: z.string() }))
      .mutation(async ({ input }) => {
        await docker.pullImage(input.image);
        return { success: true };
      }),
    getContainerLogs: protectedProcedure
      .input(z.object({ containerId: z.string(), tail: z.number().optional() }))
      .query(async ({ input }) => {
        return await docker.getContainerLogs(input.containerId, input.tail);
      }),
    execInContainer: protectedProcedure
      .input(z.object({ containerId: z.string(), command: z.string() }))
      .mutation(async ({ input }) => {
        const output = await docker.execInContainer(input.containerId, input.command);
        return { output };
      }),
  }),

  ssh: router({
    connect: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
        host: z.string(),
        port: z.number(),
        username: z.string(),
        password: z.string().optional(),
        privateKey: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { sessionId, ...config } = input;
        return await ssh.createSSHConnection(sessionId, config);
      }),
    sendCommand: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
        command: z.string(),
      }))
      .mutation(async ({ input }) => {
        const success = ssh.sendSSHCommand(input.sessionId, input.command);
        return { success };
      }),
    disconnect: protectedProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input }) => {
        const success = ssh.closeSSHConnection(input.sessionId);
        return { success };
      }),
    resize: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
        rows: z.number(),
        cols: z.number(),
      }))
      .mutation(async ({ input }) => {
        const success = ssh.resizeSSHTerminal(input.sessionId, input.rows, input.cols);
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
