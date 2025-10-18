import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieConsent");
    if (!accepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-4 flex flex-col md:flex-row items-center gap-4 max-w-2xl w-full">
            <p className="text-sm text-gray-700 leading-relaxed flex-1 text-center md:text-left">
              We use cookies to improve your experience on our website.{" "}
              <a
                href="/privacy-policy"
                className="text-red-600 font-medium hover:underline"
              >
                Learn more
              </a>
              .
            </p>
            <button
              onClick={handleAccept}
              className="bg-red-600 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow hover:bg-red-700 transition"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
