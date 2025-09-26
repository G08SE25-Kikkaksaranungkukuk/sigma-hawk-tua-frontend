import { useState, useEffect, useRef } from "react";
import { GroupResponse } from "@/lib/types";
import { groupService } from "@/lib/services/group/group-service";

export const useUserGroups = () => {
    const [groups, setGroups] = useState<GroupResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            setError(null);
            const userGroups = await groupService.getUserGroups();
            console.log("Fetched user groups:", userGroups);
            setGroups(userGroups);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch groups"
            );
        } finally {
            setLoading(false);
        }
    };

    const refreshGroups = () => {
        hasFetched.current = false;
        fetchGroups();
    };

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchGroups();
        }
    }, []);

    return {
        groups,
        loading,
        error,
        refreshGroups,
    };
};
