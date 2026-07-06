import { useState, useCallback } from "react";
import type { OrigemFilter, StatusFilter } from "../types/device";

export type SortOption =
  | "nome-asc"
  | "nome-desc"
  | "status-online"
  | "status-offline"
  | "ultima-online-desc"
  | "ultima-online-asc"
  | "modelo-asc";

interface Preferences {
  origem: OrigemFilter;
  statusFilter: StatusFilter;
  sortOption: SortOption;
}

const STORAGE_KEY = "intelbras_preferences";

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        origem: parsed.origem ?? "todos",
        statusFilter: parsed.statusFilter ?? "todos",
        sortOption: parsed.sortOption ?? "nome-asc",
      };
    }
  } catch {
    // ignore parse errors
  }
  return { origem: "todos", statusFilter: "todos", sortOption: "nome-asc" };
}

function savePreferences(prefs: Preferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore quota errors
  }
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);

  const updatePreference = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setPreferences((prev) => {
        const next = { ...prev, [key]: value };
        savePreferences(next);
        return next;
      });
    },
    []
  );

  return { preferences, updatePreference };
}
