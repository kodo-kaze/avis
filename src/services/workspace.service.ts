

import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

export const uploadFileForAnalysis = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const analyzeText = async (
  text: string
) => {
  const response = await axios.post(
    `${API_BASE}/analyze-text`,
    {
      text,
    }
  );

  return response.data;
};

export const createIssue = async (issue: { title: string; description: string; author: string }) => {
  const response = await axios.post(`${API_BASE}/issues/`, issue);
  return response.data;
};

export const fetchIssues = async () => {
  const response = await axios.get(`${API_BASE}/issues/`);
  return response.data;
};

export const fetchMyIssues = async (author: string) => {
  const response = await axios.get(`${API_BASE}/issues/me/${author}`);
  return response.data;
};

export const fetchIssueDetails = async (issueId: string) => {
  const response = await axios.get(`${API_BASE}/issues/${issueId}`);
  return response.data;
};

export const createOpinion = async (issueId: string, opinion: { text: string; author: string }) => {
  const response = await axios.post(`${API_BASE}/issues/${issueId}/opinions`, opinion);
  return response.data;
};

export const resolveIssue = async (issueId: string) => {
  const response = await axios.patch(`${API_BASE}/issues/${issueId}/resolve`);
  return response.data;
};

export const reopenIssue = async (issueId: string) => {
  const response = await axios.patch(`${API_BASE}/issues/${issueId}/reopen`);
  return response.data;
};

export const deleteIssue = async (issueId: string) => {
  const response = await axios.delete(`${API_BASE}/issues/${issueId}`);
  return response.data;
};