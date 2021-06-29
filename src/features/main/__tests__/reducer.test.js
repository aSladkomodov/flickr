import reducer, { INITIAL_STATE } from "../reducer";
import { actionMainSetContent, actionMainSetFiler } from "../actions";

const fixture = {
  status: "success",
  mainItems: [{ title: "second" }],
};

const fixture2 = {
  status: "failure",
  mainItems: [],
};

const fixture3 = {
  mainItems: [
    { title: "first", description: "one", tags: "" },
    { title: "second", description: "two", tags: "tag2" },
    { title: "third", description: "three", tags: "tag3" },
  ],
};
describe("create main reducer", () => {
  test("state by not create main action", () => {
    const action = {
      type: "any",
    };
    const newState = reducer(undefined, action);

    expect(newState).toEqual(INITIAL_STATE);
  });

  test('state by action create data "request" when mainItems is empty', () => {
    const expected = {
      ...INITIAL_STATE,
      status: "success",
      mainItems: [{ title: "second" }],
      filterMainItems: [{ title: "second" }],
    };
    const action = actionMainSetContent(fixture);
    const newState = reducer(INITIAL_STATE, action);

    expect(newState).toEqual(expected);
  });

  test('state by action create data "request" when mainItems is full', () => {
    const initialMainItems = [{ title: "first" }];
    const expected = {
      ...INITIAL_STATE,
      status: "success",
      mainItems: [...initialMainItems, { title: "second" }],
      filterMainItems: [...initialMainItems, { title: "second" }],
    };
    const action = actionMainSetContent(fixture);
    const newState = reducer(
      { ...INITIAL_STATE, mainItems: initialMainItems },
      action
    );

    expect(newState).toEqual(expected);
  });

  test('state by action create "failure"', () => {
    const expected = {
      ...INITIAL_STATE,
      status: "failure",
    };
    const action = actionMainSetContent(fixture2);
    const newState = reducer(undefined, action);

    expect(newState).toEqual(expected);
  });

  test("state by action create filter items", () => {
    const initialState = { ...INITIAL_STATE, ...fixture3 };

    const resultFilterFirst = { filterMainItems: [fixture3.mainItems[0]] };
    const resultFilterSecond = { filterMainItems: [fixture3.mainItems[1]] };
    const resultFilterThird = {
      filterMainItems: [fixture3.mainItems[1], fixture3.mainItems[2]],
    };

    const actionFirst = actionMainSetFiler("first");
    const actionSecond = actionMainSetFiler("two");
    const actionFilterThird = actionMainSetFiler("tag");

    expect(reducer(initialState, actionFirst)).toEqual({
      ...INITIAL_STATE,
      search: "first",
      ...fixture3,
      ...resultFilterFirst,
    });

    expect(reducer(initialState, actionSecond)).toEqual({
      ...INITIAL_STATE,
      search: "two",
      ...fixture3,
      ...resultFilterSecond,
    });

    expect(reducer(initialState, actionFilterThird)).toEqual({
      ...INITIAL_STATE,
      search: "tag",
      ...fixture3,
      ...resultFilterThird,
    });
  });
});
