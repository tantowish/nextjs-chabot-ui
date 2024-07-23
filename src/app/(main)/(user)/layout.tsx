import Sidebar from "../_components/sidebar";
import NextAuthProvider from "@/context/next-auth-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlobalState } from "@/lib/global-state";
import SidebarMobile from "../_components/sidebar-mobile";
import SidebarSwitcher from "../_components/sidebar-switcher";
import { SubscriptionModal } from "./_components/subscription-modal";

export default function UserLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex h-screen relative">
        <NextAuthProvider>
          <SubscriptionModal />
              <GlobalState>
                  <Sidebar />
                  <SidebarMobile />
                  <main className="flex-1 overflow-y-auto bg-[#222222]">
                      <ScrollArea className="h-screen relative">
                          <SidebarSwitcher/>
                          {children}
                      </ScrollArea>
                  </main>
              </GlobalState>
        </NextAuthProvider>
      </div>
    );
  }