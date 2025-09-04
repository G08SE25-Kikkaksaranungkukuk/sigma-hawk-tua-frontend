import { useState, useEffect } from 'react';
import { Group } from '../../types/home';
import { groupService } from '../../services/home';

export const useUserGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const userGroups = await groupService.getUserGroups();
      setGroups(userGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const refreshGroups = () => {
    fetchGroups();
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    error,
    refreshGroups,
  };
};
