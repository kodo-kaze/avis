import axios from "axios";
import { Issue, Opinion } from "@/types/workspace.types";
import { AnalysisResult } from "@/lib/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

// --- Interfaces ---

interface BackendOpinion {
  id: number | string;
  issue_id: number | string;
  text: string;
  author: string;
  created_at: string;
}

interface BackendIssue {
  id: number | string;
  title: string;
  description: string;
  status: 'Open' | 'Resolved' | 'Pending';
  is_private: boolean;
  author: string;
  created_at: string;
  analysis_result?: AnalysisResult;
  opinions?: BackendOpinion[];
}

// --- Mappers ---

const mapOpinion = (o: BackendOpinion): Opinion => ({
  id: o.id.toString(),
  issueId: o.issue_id.toString(),
  text: o.text,
  author: o.author,
  createdAt: o.created_at
});

const mapIssue = (i: BackendIssue): Issue => ({
  id: i.id.toString(),
  title: i.title,
  description: i.description,
  status: i.status,
  isPrivate: i.is_private,
  author: i.author,
  createdAt: i.created_at,
  analysisResult: i.analysis_result,
  opinions: i.opinions?.map(mapOpinion)
});

// --- Services ---

export const uploadFileForAnalysis = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const response = await axios.post(`${API_BASE}/analyze-text`, { text });
  return response.data;
};

export const createIssue = async (issue: { title: string; description: string; author: string; isPrivate?: boolean }): Promise<Issue> => {
  const response = await axios.post(`${API_BASE}/issues/`, {
    title: issue.title,
    description: issue.description,
    author: issue.author,
    is_private: issue.isPrivate
  });
  return mapIssue(response.data);
};

export const fetchIssues = async (): Promise<Issue[]> => {
  const response = await axios.get(`${API_BASE}/issues/`);
  return response.data.map(mapIssue);
};

export const fetchMyIssues = async (author: string): Promise<Issue[]> => {
  const response = await axios.get(`${API_BASE}/issues/me/${author}`);
  return response.data.map(mapIssue);
};

export const fetchIssueDetails = async (issueId: string): Promise<Issue> => {
  const response = await axios.get(`${API_BASE}/issues/${issueId}`);
  return mapIssue(response.data);
};

export const createOpinion = async (issueId: string, opinion: { text: string; author: string }): Promise<Opinion> => {
  const response = await axios.post(`${API_BASE}/issues/${issueId}/opinions`, opinion);
  return mapOpinion(response.data);
};

export const resolveIssue = async (issueId: string): Promise<Issue> => {
  const response = await axios.patch(`${API_BASE}/issues/${issueId}/resolve`);
  return mapIssue(response.data);
};

export const reopenIssue = async (issueId: string): Promise<Issue> => {
  const response = await axios.patch(`${API_BASE}/issues/${issueId}/reopen`);
  return mapIssue(response.data);
};

export const deleteIssue = async (issueId: string): Promise<void> => {
  await axios.delete(`${API_BASE}/issues/${issueId}`);
};
