import { takeEvery, put, call } from "redux-saga/effects";
import { MAIN_LOAD_CONTENT } from "./types";
import { actionMainSetContent } from "./actions";
import { mappingItems } from "./mapping";
import { fetchItems } from "../../config/urls";
import axios from "axios";

function* sageMainLoadContent() {
  const { data: resData, status } = yield call(
    (config) =>
      axios({ ...config })
        .then((data) => ({
          status: "success",
          data,
        }))
        .catch(() => ({ status: "failure" })),
    {
      method: "get",
      url: fetchItems,
    }
  );

  yield put(
    actionMainSetContent({
      status,
      mainItems: resData?.data?.items?.length
        ? mappingItems(resData.data.items)
        : [],
    })
  );
}

function* mainSaga() {
  yield takeEvery(MAIN_LOAD_CONTENT, sageMainLoadContent);
}

export default mainSaga;
