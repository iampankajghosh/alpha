import { useState, useCallback } from "react";

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  initialRefreshing?: boolean;
}

interface UsePullToRefreshReturn {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}

/**
 * Custom hook for pull-to-refresh functionality
 * @param options - Configuration options for the hook
 * @returns Object containing refreshing state and onRefresh handler
 */
export const usePullToRefresh = ({
  onRefresh: refreshFunction,
  initialRefreshing = false,
}: UsePullToRefreshOptions): UsePullToRefreshReturn => {
  const [refreshing, setRefreshing] = useState(initialRefreshing);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshFunction();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshFunction]);

  return {
    refreshing,
    onRefresh,
  };
};
