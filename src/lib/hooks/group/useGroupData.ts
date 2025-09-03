import { useState, useEffect } from 'react';
import { groupService } from '@/lib/services/group/group-service';
import type { GroupInfo } from '@/components/schemas';

interface UseGroupDataReturn {
  group: GroupInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGroupData = (groupId?: string): UseGroupDataReturn => {
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroup = async () => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const groupData = await groupService.getGroup(groupId);
      setGroup(groupData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch group data');
      console.error('Error fetching group:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  return {
    group,
    loading,
    error,
    refetch: fetchGroup
  };
};
