import React, { useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import restConnector from "./axiosRestConnector";
import { ERR_CODE } from "./constants";
import { authService } from "./services/AuthService";
import { LOGOUT_USER } from "./redux/actions";

const PrivateRoute = (props) => {
  const { homeAuthenticated } = props;
  const token = authService.loadAccessToken();
  const history = useHistory();
  const dispatch = useDispatch();

  restConnector.interceptors.response.use(
    (response) => {
      if (
        !response.data.success &&
        response.data.code === ERR_CODE.USER_LOCKED &&
        response.data.httpCode === 403
      ) {
        dispatch({ type: LOGOUT_USER });
        authService.logout();
        history.push("/");
      }
      return response;
    },
    (error) => {
      if (error.response.status === 500) {
        history.push("/error");
      }
      if (error.response.status === 401) {
        dispatch({ type: LOGOUT_USER });
        authService.logout();
        history.push("/");
      }
      return error;
    }
  );

  if (homeAuthenticated)
    return token ? (
      <Redirect to={{ pathname: "/home" }} />
    ) : (
      <Route {...props} />
    );

  return <Route {...props} />;
};

export default PrivateRoute;
