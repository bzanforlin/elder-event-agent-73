// API configuration and utilities
import { getCSRFToken } from "./django";

const API_BASE_URL = "/api";

export interface ElderSummary {
  id: number;
  elder: number;
  short_summary: string;
  long_summary: string;
  updated_at: string;
}

export interface Elder {
  id?: number;
  name: string;
  extra_details: string;
  created_at?: string;
  summary?: ElderSummary | null;
}

export interface ElderAudio {
  id?: number;
  elder: number;
  audio_file: File;
  transcript?: string;
  uploaded_at?: string;
}

// Elder API functions
export const elderApi = {
  // Create a new elder
  create: async (
    elderData: Omit<Elder, "id" | "created_at">
  ): Promise<Elder> => {
    const csrfToken = getCSRFToken();
    const response = await fetch(`${API_BASE_URL}/elders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken && { "X-CSRFToken": csrfToken }),
      },
      body: JSON.stringify(elderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create elder: ${response.statusText}`);
    }

    return response.json();
  },

  // Get all elders
  list: async (): Promise<Elder[]> => {
    const response = await fetch(`${API_BASE_URL}/elders/`);

    if (!response.ok) {
      throw new Error(`Failed to fetch elders: ${response.statusText}`);
    }

    return response.json();
  },

  // Get a specific elder
  get: async (id: number): Promise<Elder> => {
    const response = await fetch(`${API_BASE_URL}/elders/${id}/`);

    if (!response.ok) {
      throw new Error(`Failed to fetch elder: ${response.statusText}`);
    }

    return response.json();
  },

  // Upload audio for an elder
  uploadAudio: async (
    elderId: number,
    audioFile: File
  ): Promise<ElderAudio> => {
    const csrfToken = getCSRFToken();
    const formData = new FormData();
    formData.append("audio_file", audioFile);
    formData.append("elder", elderId.toString());

    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }

    const response = await fetch(`${API_BASE_URL}/elders/${elderId}/audio/`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload audio: ${response.statusText}`);
    }

    return response.json();
  },
};
