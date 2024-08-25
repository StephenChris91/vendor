// "use client";

// // components/SessionManager.tsx
// import { useEffect } from "react";
// import { useSession } from "next-auth/react";

// const SessionManager: React.FC = () => {
//   const { data: session, update } = useSession();

//   useEffect(() => {
//     let activityInterval: NodeJS.Timeout;

//     const updateActivity = async () => {
//       if (session) {
//         await update({ lastActivity: Date.now() });
//       }
//     };

//     const handleActivity = () => {
//       updateActivity();
//     };

//     if (session) {
//       window.addEventListener("mousemove", handleActivity);
//       window.addEventListener("keydown", handleActivity);

//       activityInterval = setInterval(updateActivity, 60000); // Update every minute
//     }

//     return () => {
//       window.removeEventListener("mousemove", handleActivity);
//       window.removeEventListener("keydown", handleActivity);
//       clearInterval(activityInterval);
//     };
//   }, [session, update]);

//   return null;
// };

// export default SessionManager;
