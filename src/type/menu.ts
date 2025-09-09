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
  },
  Settings: {
    title: "Cài đặt chung",
  },
  SignRegonize: {
    title: "Nhận diện biển báo giao thông",
  },
  Introduction: {
    title: "Giới thiệu",
  }
});

export type MenuKey = keyof typeof MenuData;

export type MenuType = (typeof MenuData)[MenuKey];
