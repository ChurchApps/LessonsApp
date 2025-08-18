"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ApiHelper, FeedActionInterface } from "@/helpers";
import { ActionPreview } from "./components/ActionPreview";

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const actionId = params.actionId as string;
  const lessonId = searchParams.get("lessonId");
  const [action, setAction] = useState<FeedActionInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAction = async () => {
      try {
        setLoading(true);

        if (lessonId) {
          // Fetch actions by lesson ID and find the specific action
          const actions = await ApiHelper.get(`/actions/public/lesson/${lessonId}`, "LessonsApi");
          const foundAction = actions.find((a: any) => a.id === actionId);
          if (foundAction) {
            setAction(foundAction);
          } else {
            setError("Action not found in lesson");
          }
        } else {
          // Try to fetch action directly (might not exist)
          try {
            const response = await ApiHelper.get(`/actions/public/${actionId}`, "LessonsApi");
            setAction(response);
          } catch {
            setError("Action not found. Please provide a lessonId parameter.");
          }
        }
      } catch (err) {
        setError("Failed to load action");
        console.error("Error fetching action:", err);
      } finally {
        setLoading(false);
      }
    };

    if (actionId) {
      fetchAction();
    }
  }, [actionId, lessonId]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000"
      }}>
        <div style={{ color: "#fff" }}>Loading...</div>
      </div>
    );
  }

  if (error || !action) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000"
      }}>
        <div style={{ color: "#fff" }}>{error || "Action not found"}</div>
      </div>
    );
  }

  return <ActionPreview action={action} actionId={actionId} />;
}
