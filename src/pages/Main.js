import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wrapper } from "../components/Wrapper/Wrapper";
import { Card } from "../components/Card/Card";
import {
  actionMainLoadContent,
  actionMainSetFiler,
} from "../features/main/actions";
import InfiniteScroll from "../components/LazyScroll/LazyScroll";
import { Spinner } from "../components/Spinner/Spinner";
import { TextField } from "@material-ui/core";

import "./style.css";

export const Main = () => {
  const dispatch = useDispatch();
  const { status, mainItems, search, filterMainItems } = useSelector(
    (state) => state.main
  );

  const handleActionMainLoadContent = useCallback(
    () => dispatch(actionMainLoadContent()),
    [dispatch]
  );
  const handleFilterSearch = useCallback(
    ({ target }) => dispatch(actionMainSetFiler(target.value)),
    [dispatch]
  );

  useEffect(() => {
    dispatch(actionMainLoadContent());
  }, [dispatch]);

  return (
    <Wrapper>
      {(() => {
        switch (status) {
          case "request":
            return <Spinner />;
          case "success":
            return (
              <>
                <TextField
                  id="outlined-basic"
                  label="Search"
                  variant="outlined"
                  onChange={handleFilterSearch}
                />
                <InfiniteScroll
                  scrollThreshold={1}
                  dataLength={mainItems.length}
                  next={handleActionMainLoadContent}
                  hasMore={!search.length}
                  loader={search.length ? "" : "...loading"}
                >
                  <div className="main-cards">
                    {filterMainItems.length > 0 &&
                      filterMainItems.map((item, i) => (
                        <Card
                          key={item.author + i}
                          cover={item.media}
                          title={item.title}
                          date={item.date}
                          description={item.description}
                          tags={item.tags}
                          link={item.link}
                        />
                      ))}
                  </div>
                </InfiniteScroll>
              </>
            );
          case "failure":
            return <h1>Something went wrong</h1>;
          default:
            return <h1>Please reload the page or try again later</h1>;
        }
      })()}
    </Wrapper>
  );
};
