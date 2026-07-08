import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firebaseUid: user.uid,
              name: user.displayName,
              email: user.email,
            }),
          });
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return { userId };
}
