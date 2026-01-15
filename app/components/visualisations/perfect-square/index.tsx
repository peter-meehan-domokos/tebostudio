'use client'
import React from "react";
import AppContextProvider from "./context";
import MainRouter from "./_components/main-router/page";
import "./perfect-square.css";

export default function PerfectSquare() {
  return (
    <div className="perfect-square-root" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <React.StrictMode>
        <AppContextProvider>
          <MainRouter />
        </AppContextProvider>
      </React.StrictMode>
    </div>
  );
}