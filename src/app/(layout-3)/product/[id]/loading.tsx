"use client";

import Spinner from "@component/Spinner";

export default function Loading() {
  return (
    <Spinner
      style={{
        width: "100px",
        height: "100px",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
