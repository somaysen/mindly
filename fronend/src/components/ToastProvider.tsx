"use client";

import { ToastContainer, Bounce } from "react-toastify";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={1600}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
      limit={4}
      toastClassName="mindly-toast"
      progressClassName="mindly-toast-progress"
      className="mindly-toast-container"
    />
  );
}
