import { MAIN_SET_CONTENT, MAIN_SET_FILTER } from "./types";

export const INITIAL_STATE = {
  status: "request",
  search: "",
  statusLazy: false,
  mainItems: [],
  filterMainItems: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case MAIN_SET_CONTENT: {
      const mainItems = [...state.mainItems, ...payload.mainItems];

      return {
        ...state,
        status: payload.status,
        filterMainItems: mainItems,
        mainItems,
      };
    }

    case MAIN_SET_FILTER: {
      const searchLowerCase = payload.toLowerCase();
      return {
        ...state,
        search: payload,
        filterMainItems: state.mainItems.filter(
          (item) =>
            item.description.toLowerCase().includes(searchLowerCase) ||
            item.tags.toLowerCase().includes(searchLowerCase) ||
            item.title.toLowerCase().includes(searchLowerCase)
        ),
      };
    }

    default:
      return state;
  }
};

export default reducer;
