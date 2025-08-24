export type PatientLoginFormData = {
  email_or_phone: string;
  password: string;
};

export type PatientRegisterFormData = {
  identifier: string;
  password: string;
};

export type PatientNameUpdateData = {
  name: string;
};

export type BookingData = {
  booking_id: string;
  physiotherapist_user_id: string;
  doctor_user_id: string | null;
  partnername: string;
  status: string;
  date_time: string;
  amount: number;
  payment_status: string;
};

export type BookingListResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  count: number;
  data: BookingData[];
};
