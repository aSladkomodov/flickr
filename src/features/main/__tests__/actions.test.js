import {
  actionMainLoadContent,
  actionMainSetContent,
  actionMainSetFiler,
} from "../actions";
import { MAIN_LOAD_CONTENT, MAIN_SET_CONTENT, MAIN_SET_FILTER } from "../types";

describe("main actions", () => {
  test("actionMainLoadContent", () => {
    const expected = {
      type: MAIN_LOAD_CONTENT,
    };
    const actual = actionMainLoadContent();

    expect(actual).toEqual(expected);
  });

  test("actionMainSetContent", () => {
    const payload = {
      status: "success",
      mainItems: {
        limit: 10,
        page: 0,
        sortKeys: "id",
        sortDirection: "desc",
        items: [{ title: "New" }],
      },
    };

    const expected = {
      type: MAIN_SET_CONTENT,
      payload: {
        status: "success",
        mainItems: {
          limit: 10,
          page: 0,
          sortKeys: "id",
          sortDirection: "desc",
          items: [{ title: "New" }],
        },
      },
    };
    const actual = actionMainSetContent(payload);

    expect(actual).toEqual(expected);
  });

  test("actionMainSetFiler", () => {
    const payload = "string";

    const expected = {
      type: MAIN_SET_FILTER,
      payload: "string",
    };
    const actual = actionMainSetFiler(payload);

    expect(actual).toEqual(expected);
  });
});
