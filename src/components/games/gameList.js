import { Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { Game } from "./game";
import { useSelector } from "react-redux";
import i18next from "i18next";

export const GameList = ({ data }) => {
  const theme = useSelector((state) => state.theme);

  return (
    <div style={{ background: theme.bg, margin: "15px 10px" }}>
      <div
        style={{
          padding: "10px",
          border: "1px solid  #444",
          borderRadius: "10px",
          color: theme.color,
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        <div>
          <span>
           {i18next.t("game.textComingSoon")}
          </span>
        </div>
      </div>
      {/* <Row gutter={{ xs: 8, sm: 16, md: 18, lg: 20 }}>
        {data.map((game) => (
          <Col span={8} key={game.id}>
            <Link to={`/games/${game.id}`}>
              <Game info={game} />
            </Link>
          </Col>
        ))}
      </Row> */}
    </div>
  );
};
