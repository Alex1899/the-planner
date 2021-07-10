import React from "react";
import Timer from "../timer/timer.component";
import "./page-header.styles.scss";

const PageHeader = ({ title, myday }) => {

  let obj = new Date();
  let secs =
    24 * 60 * 60 -
    obj.getHours() * 60 * 60 -
    obj.getMinutes() * 60 -
    obj.getSeconds();

  

  return (
    <header>
      <div className="today">
        {title === "My Day" ? (
          <>
            <p className="title">{title}</p>
            <p className="date">{new Date().toDateString()}</p>
          </>
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
        <Timer expiryTimestamp={secs} myday={myday} />
      )}
    </header>
  );
};

export default PageHeader;
