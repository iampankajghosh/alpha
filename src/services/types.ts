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
