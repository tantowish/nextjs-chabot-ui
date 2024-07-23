import { iconMap } from "@/app/(main)/_components/sidebar";

export type Nav = {
    title: string;
    href: string;
    icon: keyof typeof iconMap
};

export const adminRoutes: Nav[] = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: "LuLayoutDashboard"
    },
    {
        title: "Subscription",
        href: "/admin/subscription",
        icon: "FaRegUser"
    },
];

export const userRoutes: Nav[] = [
    {
        title: "Chat",
        href: "/chat",
        icon: "MdOutlineMessage"
    },
    {
        title: "Education",
        href: "/education",
        icon: "MdOutlineSchool"
    },
    {
        title: "Prompt",
        href: "/prompt",
        icon: "TbPrompt"
    },
];

