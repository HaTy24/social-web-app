import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";

import { Tab } from "./styles/profile";

const Tabs = (props) => {
  // TabList -> [{path,name,title}]
  const { tabList, pathDefault } = props;
  const theme = useSelector((state) => state.theme);
  const { id, activity } = useParams();
  const activeStyle = {
    borderBottom: "2px solid rgb(29,161,242)",
    color: "rgb(29,161,242)",
  };
  const tabs = new URLSearchParams(useLocation().search).get("tabs");
  const category = new URLSearchParams(useLocation().search).get("category");

  return (
    <Tab border={theme.border}>
      {tabList.map((tab) => {
        const to = tab.path;
        return (
          <Link
            key={tab.name}
            to={to}
            replace={true}
            style={
              activity === tab.name ||
              tabs === tab.name ||
              category === tab.name ||
              (tabs == undefined && tab.name === "topVotes") ||
              (tabs == undefined && tab.name === pathDefault) ||
              (category == undefined && tab.name === "all") ||
              (activity == undefined && tab.name === "tweets")
                ? activeStyle
                : {}
            }
          >
            <div style={{ whiteSpace: "nowrap" }}>{tab.title}</div>
          </Link>
        );
      })}
    </Tab>
  );
};

export default Tabs;
