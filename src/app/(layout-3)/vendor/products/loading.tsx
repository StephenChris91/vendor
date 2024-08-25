"use client";

import Spinner from "@component/Spinner";

export default function Loading() {
  return (
    <Spinner
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 99999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}
