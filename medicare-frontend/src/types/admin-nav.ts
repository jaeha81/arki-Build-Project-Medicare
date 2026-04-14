export interface AdminNavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

export interface AdminPodConfig {
  id: string;
  name: string;
  color: string;
  items: AdminNavItem[];
}
