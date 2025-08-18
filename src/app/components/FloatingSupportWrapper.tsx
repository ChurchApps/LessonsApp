"use client";

import { useState, useEffect } from "react";
import { FloatingSupport } from "@churchapps/apphelper";

export function FloatingSupportWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <FloatingSupport appName="Lessons.church" />;
}
