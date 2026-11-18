export type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: 'Home Visit' | 'Shop Drop-off';
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isAvailable: boolean;
  createdAt: string;
  technician?: { name: string; image: string | null; area: string; bio: string };
};

export type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: 'requested' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
  finalAmount: number;
  paymentStatus: 'unpaid' | 'paid';
  statusHistory?: { status: string; changedAt: string }[];
  createdAt: string;
};

export type Payment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: 'paid';
  paidAt: string;
};

export type AppUser = {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: 'customer' | 'technician' | 'admin';
  phone: string;
  area: string;
  bio: string;
  createdAt: string;
};

export type NameValue = { name: string; value: number };
