export interface Persona {
  id: string;
  name: string;
  role: string;
  department: "Tech" | "Marketing" | "Sales";
  avatar: string;
  hasStartChat?: boolean;
  about?: string;
  communication?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  active: boolean;
}
