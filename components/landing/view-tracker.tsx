"use client";

import { useEffect } from "react";

export default function ViewTracker({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    fetch(`/api/propiedades/${propertyId}/view`, { method: "POST" }).catch(() => {});
  }, [propertyId]);
  return null;
}
