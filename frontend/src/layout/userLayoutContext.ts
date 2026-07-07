import { useOutletContext } from "react-router";

export interface UserLayoutContext {
  onOpenSidebar: () => void;
}

export const useUserLayoutContext = () => useOutletContext<UserLayoutContext>();
