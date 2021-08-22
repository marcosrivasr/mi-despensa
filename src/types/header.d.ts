export interface HeaderItem {
  id: string;
  title: string;
  goTo: string;
  protected: boolean;
}
export interface HeaderProps {
  items: HeaderItem[];
}
