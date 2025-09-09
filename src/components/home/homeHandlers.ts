import { useRouter } from "next/navigation";
import { Group } from "../../lib/types/home";

type RouterType = ReturnType<typeof useRouter>;

export const handleProfileClick = (router: RouterType) => {
    router.push('/profile/edit');
};

export const handleCreateGroup = () => {
    console.log('Create group clicked');
};

export const handleViewGroup = (router: RouterType, group: Group) => {
    console.log('View group:', group);
};

export const handleLogout = (router: RouterType) => {
    localStorage.removeItem("token");
    router.push("/login");
};

export const handleSearchGroups = (router: RouterType) => {
    router.push('/groupSearch');
    console.log('Navigate to search groups page');
};