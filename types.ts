
export enum LeadStatus {
  NEW = 'New Lead',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  WON = 'Won',
  LOST = 'Lost',
  CLIENT = 'Client',
  MEETING = 'Meeting',
  VISIT = 'Visit',
  CLOSE = 'Close'
}

export type QuotationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  image: string;
  status: 'Active' | 'Low Stock' | 'Out of Stock';
}

export interface LineItem {
  productId: string;
  productName: string;
  description?: string; // Added for PDF
  quantity: number;
  price: number;
  total: number;
}

export interface QuotationStyle {
  font: string;
  primaryColor: string;
  headerText: string;
  footerText: string;
  showLogo: boolean;
}

export interface QuotationTerms {
  validity: string;
  deliveryTime: string;
  transportation: string;
  taxes: string;
}

export interface Quotation {
  id: string;
  number: string;
  leadId: string;
  leadName: string;
  leadPhone?: string; // Added for PDF
  date: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  discount: number; // Added
  shipping: number; // Added
  total: number;
  status: QuotationStatus;
  style: QuotationStyle;
  terms: QuotationTerms; // Added
}

export interface Invoice {
  id: string;
  number: string;
  quotationId?: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  isTemplate?: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerId?: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  source: 'Web' | 'Showroom';
  items: LineItem[];
  trackingNumber?: string;
}

export interface Contact {
  id: string;
  sr?: number; // Serial Number
  date?: string;
  company: string;
  name: string;
  contact?: string;
  designation?: string;
  location?: string;
  leadSource?: string;
  category?: string;
  assignee?: string;
  quotationStatus?: string;
  lastContact?: string;
  phone: string;
  email: string;
  avatar: string;
  status: LeadStatus;
  messages: Message[];
  tags: string[];
  
  // CRM specific fields
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  
  // Extended fields
  customFields?: Record<string, string>;
  tasks?: Task[];
  orders?: Order[]; // Order History
  score?: number; // Added for Lead Scoring
}

export interface Delivery {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  customerName: string;
  address: string;
  courier: string;
  type: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Scheduled';
  action: string;
  timeline?: { status: string; date: string; completed: boolean }[]; // For Tracking Modal
}

export type ViewState = 'dashboard' | 'whatsapp' | 'leads' | 'products' | 'orders' | 'quotations' | 'invoices' | 'deliveries' | 'analytics' | 'settings' | 'showroom' | 'automation';
