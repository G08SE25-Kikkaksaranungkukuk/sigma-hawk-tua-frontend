import { useState } from 'react';
import { groupService } from '@/lib/services/group/group-service';

interface UseGroupActionsReturn {
  isRequested: boolean;
  isJoiningLoading: boolean;
  isContactLoading: boolean;
  requestToJoin: () => Promise<void>;
  contactHost: (message: string) => Promise<void>;
  resetRequest: () => void;
}

export const useGroupActions = (groupId: string): UseGroupActionsReturn => {
  const [isRequested, setIsRequested] = useState(false);
  const [isJoiningLoading, setIsJoiningLoading] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);

  const requestToJoin = async () => {
    try {
      setIsJoiningLoading(true);
      await groupService.joinGroup(groupId);
      setIsRequested(true);
    } catch (error) {
      console.error('Error joining group:', error);
      // In a real app, you'd want to show a toast/notification here
      throw error;
    } finally {
      setIsJoiningLoading(false);
    }
  };

  const contactHost = async (message: string) => {
    try {
      setIsContactLoading(true);
      await groupService.contactHost(groupId, message);
      // In a real app, you'd want to show a success message here
    } catch (error) {
      console.error('Error contacting host:', error);
      throw error;
    } finally {
      setIsContactLoading(false);
    }
  };

  const resetRequest = () => {
    setIsRequested(false);
  };

  return {
    isRequested,
    isJoiningLoading,
    isContactLoading,
    requestToJoin,
    contactHost,
    resetRequest
  };
};
