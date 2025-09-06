import { makeConstData } from "@/helper/validate-const-type";
import { Home } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho menu
export interface MenuSchema {
  readonly title: string;
  readonly Icon?: React.ComponentType<any>;
  readonly href?: string;
}

// Định nghĩa dữ liệu cho menu
export const MenuData = makeConstData<MenuSchema>({
  Profile: {
    title: "Tài khoản",
    Icon: Home,
    href: "/",
  },
  LaneDetec: {
    title: "Lane Detection",
  },
  SignRegonize: {
    title: "Sign Recognition",
    Icon: Home,
    href: "/sign-recognition",
  },
});

export type MenuKey = keyof typeof MenuData;

export type MenuType = (typeof MenuData)[MenuKey];
