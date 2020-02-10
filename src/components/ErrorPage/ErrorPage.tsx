import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
const ErrorPage: FC<RouteComponentProps> = (): JSX.Element => {
  return (
    <h1 style={{ marginTop: "70px", textAlign: "center", color: "red" }}>
      Error 404
    </h1>
  );
};
export default ErrorPage;
