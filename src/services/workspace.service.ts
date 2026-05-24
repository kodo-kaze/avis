

import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000";

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