export interface Module {
  id: string
  name: string
  isActive: boolean
}

export const MODULES: Module[] = [
  { id: "BUONNGU", name: "Buồn ngủ", isActive: true },
  { id: "BIENBAO", name: "Biển báo", isActive: false },
  { id: "VATCAN", name: "Cảnh báo vật cản", isActive: true },
  { id: "LANDUONG", name: "Làn đường", isActive: false },
]
