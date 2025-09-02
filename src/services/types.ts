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
  visiting_charge?: number; // Visiting charge amount from partner list
};

export type BookingListResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  count: number;
  data: BookingData[];
};

export type WalletTopUpData = {
  amount: number;
};

export type WalletTopUpResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    wallet_balance: number;
  };
};

export type TransactionData = {
  transaction_id: string;
  booking_id: string | null;
  type_of_transaction: string;
  payment_status: string;
  amount: number;
  timestamp: string;
};

export type TransactionListResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  count: number;
  data: TransactionData[];
};

export interface BookingDecisionData {
  booking_id: string;
  decision: "accept" | "reject";
  payment_type?: string;
  amount?: number;
}

export interface BookingDecisionResponse {
  success: boolean;
  message?: string;
  data?: any;
}
