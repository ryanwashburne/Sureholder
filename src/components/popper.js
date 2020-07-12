import React from "react";

import { Manager, Reference, Popper } from "react-popper";
import Link from "./link";

export default ({ text, children, className, to, onClick }) => {
  const [popper, changePopper] = React.useState(false);
  return (
    <Manager>
      <Reference>
        {({ ref }) => {
          return to ? (
            <Link to={to}>
              <button
                ref={ref}
                onMouseEnter={() => changePopper(true)}
                onMouseLeave={() => changePopper(false)}
                className={className}
                onClick={onClick}
              >
                {children}
              </button>
            </Link>
          ) : (
            <button
              ref={ref}
              onMouseEnter={() => changePopper(true)}
              onMouseLeave={() => changePopper(false)}
              className={className}
              onClick={onClick}
            >
              {children}
            </button>
          );
        }}
      </Reference>
      {popper && (
        <Popper placement="top">
          {({ ref, style, placement }) => (
            <div
              ref={ref}
              style={style}
              className="bg-black text-white p-1 mb-1 rounded text-xs"
              data-placement={placement}
            >
              {text}
            </div>
          )}
        </Popper>
      )}
    </Manager>
  );
};
