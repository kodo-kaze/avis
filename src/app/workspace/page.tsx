import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import WorkspaceClient from "@/components/workspace/WorkspaceClient";

export const metadata: Metadata = {
  title: "Workspace – AVIS",
  description: "Intelligence Workspace – AI‑driven stakeholder insight platform",
};

export default function WorkspacePage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceClient />
    </Suspense>
  );
}
