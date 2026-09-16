import React from "react";

export default function App() {
  return (
    <div style={styles.page}>
      <div style={styles.logo}>
        {/* Punjabi Title */}
        <div style={styles.punjabi}>ਪੰਜਾਬ</div>

        {/* English Title */}
        <div style={styles.english}>Punjab</div>

        {/* Field + Farmer + Boy */}
        <div style={styles.scene}>
          <div style={styles.sun} />

          <div style={styles.field}>
            <span>🌾</span>
            <span>🌾</span>
            <span>🌾</span>
            <span>🌾</span>
            <span>🌾</span>
            <span>🌾</span>
          </div>

          <div style={styles.people}>
            {/* Farmer */}
            <div style={styles.farmer}>
              <div style={styles.farmerHead} />
              <div style={styles.farmerBody} />
              <div style={styles.farmerLeg1} />
              <div style={styles.farmerLeg2} />
              <div style={styles.farmerArm} />
            </div>

            {/* Boy */}
            <div style={styles.boy}>
              <div style={styles.boyHead} />
              <div style={styles.boyBody} />
              <div style={styles.boyLeg1} />
              <div style={styles.boyLeg2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(to bottom, #fffdf5 0%, #f8e7bd 48%, #c99548 100%)",
    padding: "20px",
    boxSizing: "border-box",
  },

  logo: {
    width: "min(92vw, 650px)",
    textAlign: "center",
    overflow: "hidden",
    borderRadius: "24px",
    background:
      "linear-gradient(to bottom, #fffef9 0%, #fff8e7 45%, #d7a452 100%)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.18)",
    paddingTop: "35px",
  },

  punjabi: {
    fontSize: "clamp(65px, 14vw, 125px)",
    fontWeight: "900",
    color: "#111",
    lineHeight: "1",
    textShadow: "3px 4px 4px rgba(0,0,0,.25)",
    fontFamily: "Noto Sans Gurmukhi, Arial, sans-serif",
  },

  english: {
    marginTop: "10px",
    fontSize: "clamp(32px, 7vw, 60px)",
    fontFamily: "cursive",
    color: "#111",
    fontWeight: "600",
  },

  scene: {
    position: "relative",
    height: "300px",
    marginTop: "15px",
    overflow: "hidden",
    background:
      "linear-gradient(to bottom, #f6d9a1 0%, #e8bb6c 45%, #9d682d 46%, #c28b3e 100%)",
  },

  sun: {
    position: "absolute",
    width: "65px",
    height: "