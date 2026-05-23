"use client";

import { useEffect, useState } from "react";

export default function AllIssues() {
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    // TEMP FAKE DATA (replace with API later)
    setIssues([
      { id: 1, title: "Broken Road", desc: "Road full of potholes" },
      { id: 2, title: "Water Issue", desc: "No water supply" },
    ]);
  }, []);

  return (
    <div className="w-full max-w-4xl space-y-4">
      <h2 className="text-xl font-bold">All Issues</h2>

      {issues.map((issue) => (
        <div
          key={issue.id}
          className="p-4 bg-white/5 border border-white/10 rounded-xl"
        >
          <h3 className="font-semibold">{issue.title}</h3>
          <p className="text-sm text-white/50">{issue.desc}</p>
        </div>
      ))}
    </div>
  );
}