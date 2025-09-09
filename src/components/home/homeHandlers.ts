import { useRouter } from "next/navigation";
import { Group } from "../../lib/types/home";

type RouterType = ReturnType<typeof useRouter>;

const BASE_API_URL = process.env.BASE_API_URL || "http://localhost:8080/";

export const handleProfileClick = (router: RouterType) => {
    router.push('/profile/edit');
};

export const handleCreateGroup = () => {
    console.log('Create group clicked');
};

export const handleViewGroup = (router: RouterType, group: Group) => {
    console.log('View group:', group);
};

export const handleLogout = async (router: RouterType) => {
    try {
        await fetch(`${BASE_API_URL}auth/logout`, {
            method: "POST",
            credentials: "include", // ส่ง cookie ไปด้วย
        });

        router.push("/login");
    } catch (error) {
        console.error("Logout failed", error);
        router.push("/login"); // fallback
    }
};



export const handleSearchGroups = (router: RouterType) => {
    router.push('/groupSearch');
    console.log('Navigate to search groups page');
};