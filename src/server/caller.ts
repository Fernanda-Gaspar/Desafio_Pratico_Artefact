import "server-only";
import { createContext } from "./context";
import { appRouter } from "./router";


export function createServerCaller() {
  return appRouter.createCaller(createContext());
}
