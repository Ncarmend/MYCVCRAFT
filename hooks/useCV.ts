/**
 * useCV — fetch and manage CVs from the API
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import type { CV } from "@/types";

export function useCV(cvId?: string) {
  const [cv, setCV] = useState<CV | null>(null);
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCVs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cv");
      if (!res.ok) throw new Error("Failed to fetch CVs");
      const data = await res.json();
      setCVs(data.cvs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCV = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cv/${id}`);
      if (!res.ok) throw new Error("CV not found");
      const data = await res.json();
      setCV(data.cv);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cvId) {
      fetchCV(cvId);
    } else {
      fetchCVs();
    }
  }, [cvId, fetchCV, fetchCVs]);

  return { cv, cvs, loading, error, refetch: cvId ? () => fetchCV(cvId) : fetchCVs };
}
