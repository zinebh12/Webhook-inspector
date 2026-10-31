export type ActiveTab = "endpoints" | "requests";

export type MobileNavigationProps = {
  activeTab: "endpoints" | "requests";
  onTabChange: (tab: "endpoints" | "requests") => void;
};
