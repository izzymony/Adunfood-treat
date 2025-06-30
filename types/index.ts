// User types
export interface User {
  id: number
  email: string
  name: string
  role: "admin" | "customer"
  phone: string
  address: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserRegistration {
  email: string
  password: string
  name: string
  phone: string
  address: string
  marketingConsent?: boolean
}

export interface UserLogin {
  email: string
  password: string
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  createdAt?: string
  updatedAt?: string
  // Add any other product properties you need
}


export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
}

// Cart types
export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

// Order types
export interface OrderItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  price: number
  image_url: string
}

export interface Order {
  id: number
  items: OrderItem[]
  total_amount: number
  delivery_fee: number
  discount_amount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method: string
  delivery_address: string
  phone: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderCreate {
  items: Array<{
    productId: number
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  deliveryFee: number
  discountAmount: number
  deliveryAddress: string
  phone: string
  notes?: string
  paymentMethod: string
}

// Payment types
export interface PaymentInitRequest {
  amount: number
  email: string
  orderId: number
  paymentMethod: "card" | "bank_transfer" | "ussd" | "bank_account"
  provider?: "paystack" | "flutterwave"
}

export interface PaymentInitResponse {
  success: boolean
  data?: {
    authorization_url: string
    access_code?: string
    reference: string
  }
  error?: string
}

export interface PaymentVerifyRequest {
  reference: string
  provider?: "paystack" | "flutterwave"
}

export interface PaymentVerifyResponse {
  success: boolean
  data?: {
    status: "success" | "failed"
    reference: string
    amount: number
    currency: string
    paid_at?: string
    channel: string
    gateway_response: string
    customer: {
      email: string
    }
  }
  error?: string
}

export interface Payment {
  id: number
  order_id: number
  amount: number
  currency: string
  status: "pending" | "success" | "failed"
  payment_provider: string
  provider_reference: string
  payment_method_type: string
  description: string
  provider_response?: any
  paid_at?: string
  created_at: string
  updated_at: string
}

// Authentication types
export interface AuthResponse {
  message: string
  user?: User
  token?: string
  emailVerificationSent?: boolean
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  userId: number
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  email: string
  otp: string
  newPassword: string
}

export interface EmailVerificationRequest {
  token: string
}

// API Response types
export interface ApiResponse<T = any> {
  message: string
  data?: T
  error?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

// Database query types
export interface ProductFilters {
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export interface UserQueries {
  create: (userData: Omit<User, "id" | "createdAt" | "updatedAt"> & { passwordHash: string }) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
  findById: (id: number) => Promise<User | null>
  updateLastLogin: (id: number) => Promise<void>
  verifyEmail: (id: number) => Promise<void>
  updatePassword: (id: number, passwordHash: string) => Promise<void>
  savePasswordResetOTP: (id: number, otp: string, expiresAt: Date) => Promise<void>
  findByEmailAndOTP: (email: string, otp: string) => Promise<User | null>
  resetPassword: (id: number, passwordHash: string) => Promise<void>
  findByEmailVerificationToken: (token: string) => Promise<User | null>
}

export interface ProductQueries {
  getAll: (filters?: ProductFilters) => Promise<Product[]>
  getFeatured: (limit?: number) => Promise<Product[]>
  getById: (id: number) => Promise<Product | null>
  getByCategory: (category: string) => Promise<Product[]>
}

export interface CategoryQueries {
  getAll: () => Promise<Category[]>
  getById: (id: number) => Promise<Category | null>
  getBySlug: (slug: string) => Promise<Category | null>
}

export interface OrderQueries {
  create: (orderData: OrderCreate & { userId: number }) => Promise<{ id: number }>
  getById: (id: number) => Promise<Order | null>
  getByUserId: (userId: number) => Promise<Order[]>
  updateStatus: (id: number, status: Order["status"]) => Promise<Order | null>
  updatePaymentStatus: (id: number, paymentStatus: Order["payment_status"]) => Promise<void>
}

export interface ProductInput {
  name: string
  description: string
  price: number
  category: string
  image: File | string
}
export interface PaymentQueries {
  create: (paymentData: Omit<Payment, "id" | "created_at" | "updated_at">) => Promise<Payment>
  updateByReference: (reference: string, updates: Partial<Payment>) => Promise<Payment | null>
  getByOrderId: (orderId: number) => Promise<Payment[]>
}

// Email types
export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Validation types
export interface PasswordValidation {
  isValid: boolean
  errors: string[]
}

// Context types
export interface CartContextType {
  cart: Cart
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: UserRegistration) => Promise<boolean>
  isLoading: boolean
  isAuthenticated: boolean
}

// Component Props types
export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export interface CategoryCardProps {
  category: Category
}

export interface OrderCardProps {
  order: Order
}

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export interface FoodImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

// Error types
export interface ApiError extends Error {
  status?: number
  code?: string
}
export interface FirestoreProduct extends Product {
  firestoreId: string
    // The document ID from Firestore
}

export interface FormErrors {
  [key: string]: string[]
}

// Utility types
export type PaymentMethod = "card" | "bank_transfer" | "ussd" | "bank_account"
export type PaymentProviderType = "paystack" | "flutterwave"
export type OrderStatus = Order["status"]
export type PaymentStatus = Order["payment_status"]
export type UserRole = User["role"]
