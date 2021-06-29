import { MAIN_LOAD_CONTENT, MAIN_SET_CONTENT, MAIN_SET_FILTER } from "./types";

export const actionMainLoadContent = () => ({
  type: MAIN_LOAD_CONTENT,
});

export const actionMainSetContent = (payload) => ({
  type: MAIN_SET_CONTENT,
  payload,
});

export const actionMainSetFiler = (payload) => ({
  type: MAIN_SET_FILTER,
  payload,
});
