import React from "react";
import Timer from "../timer/timer.component";
import "./page-header.styles.scss";

const PageHeader = ({ title, myday }) => {

  return (
    <header>
      <div className="today">
        {title === "My Day" ? (
          <div className="d-flex flex-column">
            <p className="title">{title}</p>
            <p className="date">{new Date().toDateString()}</p>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <img
              style={{ marginRight: 10 }}
              src={`/assets/${title.toLowerCase()}.svg`}
              alt="icon"
              width={30}
            />
            <p className="title">{title}</p>
          </div>
        )}
      </div>
      {myday && myday.length > 0 && (
        <Timer myday={myday} />
      )}
    </header>
  );
};

export default PageHeader;
