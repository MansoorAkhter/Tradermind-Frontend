import React, { FC } from "react";

const DropDown: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="absolute *:rounded-md right-2 w-[8%] h-auto bg-secondary rounded-lg mt-1 transition-all duration-300 py-3 px-2 flex flex-col gap-y-2">
      {children}
    </div>
  );
};

export default DropDown;
