import { useCallback, useEffect, useMemo, useState } from "react";

export type WatchItem = {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  vote_average?: number;
};

const STORAGE_KEY = "watchlist";

function readList(): WatchItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WatchItem[]) : [];
  } catch {
    return [];
  }
}

function writeList(list: WatchItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useWatchlist() {
  const [list, setList] = useState<WatchItem[]>(() => readList());

  useEffect(() => {
    writeList(list);
  }, [list]);

  const isInWatchlist = useCallback((id: number, type: "movie" | "tv") => {
    return list.some((i) => i.id === id && i.type === type);
  }, [list]);

  const toggleWatchlist = useCallback((item: WatchItem) => {
    setList((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type);
      if (exists) return prev.filter((i) => !(i.id === item.id && i.type === item.type));
      return [item, ...prev];
    });
  }, []);

  return {
    list,
    isInWatchlist,
    toggleWatchlist,
  };
}
