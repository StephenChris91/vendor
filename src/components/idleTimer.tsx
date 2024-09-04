import { useEffect, useRef, useCallback, useState } from "react";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@lib/use-session-client";
import Modal from "./Modal";

function useIdleTimer(logoutTime: number, warningTime: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(warningTime / 1000);
  const user = useCurrentUser();

  const handleLogout = useCallback(() => {
    if (user) {
      signOut();
    }
  }, [user]);

  const startCountdown = useCallback(() => {
    setModalOpen(true);
    setCountdown(warningTime / 1000);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleLogout, warningTime]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    resetTimeout();
  }, []);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setModalOpen(false);

    if (user) {
      timeoutRef.current = setTimeout(() => {
        startCountdown();
      }, logoutTime);
    }
  }, [logoutTime, user, startCountdown]);

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    const resetTimeoutAndCloseModal = () => {
      closeModal();
      resetTimeout();
    };

    events.forEach((event) =>
      document.addEventListener(event, resetTimeoutAndCloseModal)
    );

    resetTimeout(); // Initialize the timer

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      events.forEach((event) =>
        document.removeEventListener(event, resetTimeoutAndCloseModal)
      );
    };
  }, [resetTimeout, closeModal]);

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <div>
        <h2>Inactivity Warning</h2>
        <p>You will be logged out in {countdown} seconds due to inactivity.</p>
        <button onClick={closeModal}>Stay Logged In</button>
      </div>
    </Modal>
  );
}

export default useIdleTimer;
