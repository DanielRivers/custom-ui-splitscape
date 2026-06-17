"use server";

import React from "react";
import { getKindeWidget } from "@kinde/infrastructure";

const styles: {
  loginForm: React.CSSProperties;
  heading: React.CSSProperties;
  description: React.CSSProperties;
} = {
  loginForm: {
    minWidth: "400px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heading: {
    fontWeight: "600",
    fontSize: "2rem",
  },
  description: {
    marginBottom: "1.5rem",
  },
  button: {
    marginTop: "1.5rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "dodgerblue",
    color: "#fff",
    border: "none",
    borderRadius: "99px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
};

export const Widget = (props: {
  heading: string;
  description: string;
  onButtonClick?: () => void;
}) => {
  return (
    <main style={styles.loginForm}>
      <div style={{ padding: "2rem" }}>
        <h2 style={styles.heading}>{props.heading}</h2>
        <p style={styles.description}>{props.description}</p>
        {getKindeWidget()}
        <button
          type="button"
          style={styles.button}
          onClick={props.onButtonClick}
        >
          Continue
        </button>
      </div>
    </main>
  );
};
