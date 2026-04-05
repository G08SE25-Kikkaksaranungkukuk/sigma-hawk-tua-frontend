import { useState } from 'react';
import { GroupResponse, SearchGroupsParams } from '@/lib/types';
import { groupService } from '../../services/home';

export const useGroupSearch = () => {
  const [searchResults, setSearchResults] = useState<GroupResponse[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchGroups = async (params: SearchGroupsParams) => {
    try {
      setSearching(true);
      setSearchError(null);
      const results = await groupService.searchGroups(params);
      setSearchResults(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setSearchError(errorMessage);
      setSearchResults([]);
      throw err;
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchError(null);
  };

  return {
    searchResults,
    searching,
    searchError,
    searchGroups,
    clearSearch,
  };
};
