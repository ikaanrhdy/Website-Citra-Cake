// data/admin.ts
export type AdminRole = "owner" | "admin";

export interface AdminAccount {
  id: string;
  username: string;
  password: string; // dummy plain text, nanti diganti hash+API beneran
  name: string;
  role: AdminRole;
}

export const dummyAdmins: AdminAccount[] = [
  {
    id: "1",
    username: "owner",
    password: "owner123",
    name: "Citra Owner",
    role: "owner",
  },
  {
    id: "2",
    username: "admin",
    password: "admin123",
    name: "Admin Toko",
    role: "admin",
  },
];

// durasi token dummy, dalam detik (1 jam)
export const DUMMY_TOKEN_EXPIRES_IN = 3600;
