// components/TawkToChat.tsx
import dynamic from "next/dynamic";

const TawkToChat = dynamic(() => import("./chatInner"), {
  ssr: false,
});

export default TawkToChat;
