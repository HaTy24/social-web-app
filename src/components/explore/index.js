import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { userService } from "../../services/UserService";
import { debounce } from "../../utils/debounce";
import Icon from "../icon";
import Loading from "../loading";
import { ProfileCorner } from "../styles/common";
import { AutoComplete, Search } from "../styles/explore";
import { PeopleDetails, PeopleFlex, UserImage } from "../styles/profile";
import TopProfilesExplore from "./TopProfiles";
import SuggestionExplore from "./Suggestion";
import Tabs from "../tabs";
import { useLocation } from "react-router-dom";
import { ClickOutside } from "../../utils/triggerClickOutside";
import { ACCOUNT_TYPE } from "../../constants";
import { YellowTick } from "../icons/YellowTick";
import i18next from "i18next";

const tabList = [
  {
    name: "topProfiles",
    title: `${i18next.t("explorePage.topProfiles")}`,
    path: "/explore",
  },
  {
    name: "suggestion",
    title: `${i18next.t("explorePage.suggestion")}`,
    path: "/explore?tabs=suggestion",
  },
];

const Explore = () => {
  const [users, setUsers] = useState(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [searchUser, setSearchUser] = useState();
  const [isFocusSearch, setIsFocusSearch] = useState(false);
  const query = new URLSearchParams(useLocation().search).get("tabs");
  const theme = useSelector((state) => state.theme);
  const heightHeaderAreaRef = useRef(null);
  const ref = useRef(null);
  const [heightHeaderAreaBox, setHeightHeaderAreaBox] = useState(0);
  useEffect(() => {
    document.title = "Explore / Weknot.io";
  }, []);

  useEffect(() => {
    const onDocumentClick = () => {
      setUsers(null);
    };
    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  const searchIcon = [
    "M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z",
  ];

  const handleSearch = async (value) => {
    if (!value) {
      setIsLoadingSearch(false);
      setSearchUser();
      return;
    }
    if (value.length >= 3) {
      try {
        setIsLoadingSearch(true);
        const response = await userService.searchUser(value);
        if (response.success) {
          setIsLoadingSearch(false);
          setSearchUser(response.data);
        } else {
          setIsLoadingSearch(false);
          setSearchUser();
        }
      } catch (error) {
        setIsLoadingSearch(false);
        console.log(error);
      }
    }
  };

  const debounceDropDown = debounce((value) => handleSearch(value), 500);
  const handleRenderTabs = () => {
    switch (query) {
      case "suggestion":
        return <SuggestionExplore />;
      default:
        return <TopProfilesExplore heightHeader={heightHeaderAreaBox} />;
    }
  };
  useEffect(() => {
    if (heightHeaderAreaRef.current) {
      setHeightHeaderAreaBox(heightHeaderAreaRef.current.clientHeight);
    }
  }, []);

  ClickOutside(ref, () => {
    setIsFocusSearch(false);
  });

  return (
    <ProfileCorner border={theme.border}>
      <div ref={heightHeaderAreaRef}>
        <div style={{ padding: "10px 15px" }}>
          <Search
            bg={theme.bg}
            color={theme.color}
            tweetHov={theme.tweetHov}
            ref={ref}
          >
            <Icon d={searchIcon} width="40px" height="18.75px" />
            <input
              placeholder={i18next.t("explorePage.search")}
              style={{ caretColor: theme.color, color: theme.color }}
              onChange={(e) => debounceDropDown(e.target.value)}
              onFocus={() => setIsFocusSearch(true)}
            />
            {isFocusSearch == true && (
              <>
                {searchUser ? (
                  searchUser?.length > 0 ? (
                    <AutoComplete boxShadow={theme.boxShadow} bg={theme.bg}>
                      {isLoadingSearch ? (
                        <Loading />
                      ) : (
                        searchUser.map((item) => (
                          <Link key={item.id} to={`/profile/${item.id}`}>
                            <PeopleFlex
                              key={item.id}
                              tweetHov={theme.tweetHov}
                              bg={theme.bg}
                            >
                              <div>
                                <UserImage src={item.profile_image_url} />
                              </div>
                              <div style={{ width: "100%" }}>
                                <PeopleDetails>
                                  <div>
                                    <h3
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "3px",
                                        color: theme.color,
                                      }}
                                    >
                                      {item.fullname}
                                      {item.accountType ===
                                        ACCOUNT_TYPE.INVESTMENT && (
                                        <YellowTick />
                                      )}
                                    </h3>
                                    <p>@{item.twitterScreenName}</p>
                                  </div>
                                </PeopleDetails>
                              </div>
                            </PeopleFlex>
                          </Link>
                        ))
                      )}
                    </AutoComplete>
                  ) : (
                    <AutoComplete boxShadow={theme.boxShadow} bg={theme.bg}>
                      {isLoadingSearch ? (
                        <Loading />
                      ) : (
                        <h3
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            fontWeight: 500,
                            color: theme.color,
                          }}
                        >
                          {i18next.t("explorePage.noResults")}
                        </h3>
                      )}
                    </AutoComplete>
                  )
                ) : (
                  <AutoComplete boxShadow={theme.boxShadow} bg={theme.bg}>
                    <h3
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontWeight: 500,
                        color: theme.color,
                      }}
                    >
                      {i18next.t("explorePage.trySearchingForPeople")}
                    </h3>
                  </AutoComplete>
                )}
              </>
            )}
          </Search>
        </div>
        <Tabs tabList={tabList} pathDefault={"topProfiles"} />
      </div>
      {handleRenderTabs()}
    </ProfileCorner>
  );
};

export default Explore;
