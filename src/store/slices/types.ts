export type PatientData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  date_of_birth: string;
  gender: string;
  role: "patient";
  profile_picture: string;
  wallet: number;
  is_banned: boolean;
  banned_until: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};
