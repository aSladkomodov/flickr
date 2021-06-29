import React from "react";
import renderer from "react-test-renderer";
import { Card } from "../Card";

describe("Card component", () => {
  it("should render Card component", () => {
    const snapshot = renderer.create(
      <Card
        cover={"href"}
        title={"Title"}
        date={"08.09.2021"}
        description={"description"}
        tags={"tags"}
        link={"href"}
      />
    );
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
