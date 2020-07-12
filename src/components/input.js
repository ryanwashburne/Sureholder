import React from "react";
import { useColorMode } from "../utils";

export default ({
  label,
  error,
  textArea,
  className,
  wrapperClassName,
  ...props
}) => {
  const { cm } = useColorMode();
  const text = cm("text-gray-700", "text-gray-300");
  const allProps = {
    className: `
      shadow
      appearance-none
      border
      ${error && `border-red-500`}
      rounded
      w-56
      py-2
      px-3
      text-gray-700
      leading-tight
      focus:outline-none
      focus:shadow-outline
      ${className}
    `,
    ...props,
  };
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className={`block ${text} text-sm font-bold mb-2`}>
          {label}
        </label>
      )}
      {textArea ? <textarea {...allProps} /> : <input {...allProps} />}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
