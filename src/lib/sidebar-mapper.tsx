import DashboardSidebar from "@/app/(main)/_components/sidebars/admin/dashboard-sidebar";
import SubscriptionSidebar from "@/app/(main)/_components/sidebars/admin/subscription-sidebar";
import ChatSidebar from "@/app/(main)/_components/sidebars/user/chat-sidebar";
import EducationSidebar from "@/app/(main)/_components/sidebars/user/education-sidebar";
import PromptSidebar from "@/app/(main)/_components/sidebars/user/prompt-sidebar";

export const renderSidebar = (pathName: string) => {
    if (pathName.startsWith('/chat')) {
        return <ChatSidebar />;
    }
    if (pathName.startsWith('/education')) {
        return <EducationSidebar />;
    }
    if (pathName.startsWith('/prompt')) {
        return <PromptSidebar />;
    }
    if(pathName === '/admin/dashboard'){
        return <DashboardSidebar/>
    }
    if(pathName.startsWith('/admin/subscription')){
        return <SubscriptionSidebar/>
    }
    return null;
};