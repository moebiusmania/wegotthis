import { createDefine } from "fresh";

export interface State {
  user?: string;
}

export const define = createDefine<State>();
