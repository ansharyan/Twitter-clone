import React from "react";

export default function RightPanelSkeleton() {
  return (
    <div className="flex w-62 flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
        <div className="flex flex-col gap-4">
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-12"></div>
        </div>
        <div className="skeleton w-18 h-6 rounded-full"></div>
      </div>
    </div>
  );
}
