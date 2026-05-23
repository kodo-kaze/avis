"use client";

import { useState } from "react";

export default function RaiseIssue() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [myIssues, setMyIssues] = useState<any[]>([]);

  const handleSubmit = () => {
    if (!title || !desc) return;

    const newIssue = {
      id: Date.now(),
      title,
      desc,
    };

    setMyIssues([newIssue, ...myIssues]);

    setTitle("");
    setDesc("");
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      
      {/* FORM */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-bold">Raise an Issue</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue title"
          className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
        />

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe the issue..."
          className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
        />

        <button
          onClick={handleSubmit}
          className="bg-white text-black px-4 py-2 rounded-lg font-bold"
        >
          Upload Issue
        </button>
      </div>

      {/* USER ISSUES */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">My Issues</h2>

        {myIssues.map((issue) => (
          <div
            key={issue.id}
            className="p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <h3>{issue.title}</h3>
            <p className="text-sm text-white/50">{issue.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}