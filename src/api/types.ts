// ─── Enums ─────────────────────────────────────────────

export type UserRole = 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN'
export type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE'
export type BookingRequestType = 'FULL_HOME_PROJECT' | 'INDIVIDUAL_SERVICE'
export type BookingStatus = 'PENDING_ASSIGNMENT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED'
export type CategoryServiceGroup = 'HOME_PROJECT' | 'INDIVIDUAL_SERVICE'

// ─── Auth ──────────────────────────────────────────────

export type RegisterRequest = {
  email: string
  password: string
  fullName: string
  phone?: string
  role: UserRole
}

export type LoginRequest = {
  email: string
  password: string
}

export type VerifyOtpRequest = {
  email: string
  otp: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type VerifyResetOtpRequest = {
  email: string
  otp: string
}

export type ResetPasswordRequest = {
  resetToken?: string
  token?: string
  newPassword: string
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}

export type RefreshTokenRequest = {
  refreshToken: string
}

export type UserSummary = {
  id: number
  email: string
  fullName: string
  role: UserRole
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: UserSummary
}

export type OtpResponse = {
  message: string
  requiresOtp: boolean
}

export type ForgotPasswordResponse = {
  message: string
}

export type ResetTokenResponse = {
  resetToken: string
}

export type MessageResponse = {
  message: string
}

// ─── User ──────────────────────────────────────────────

export type ProfessionalProfileResponse = {
  bio: string
  yearsExperience: number
  specialization: string
  city: string
  availabilityStatus: AvailabilityStatus
  averageRating: number
  ratingCount: number
}

export type UserProfileResponse = {
  id: number
  email: string
  fullName: string
  phone: string
  avatarUrl?: string
  role: UserRole
  createdAt: string
  professionalProfile?: ProfessionalProfileResponse
}

export type UpdateProfileRequest = {
  fullName?: string
  phone?: string
  avatarUrl?: string
  bio?: string
  yearsExperience?: number
  specialization?: string
  city?: string
  availabilityStatus?: AvailabilityStatus
}

// ─── Categories ────────────────────────────────────────

export type CategoryResponse = {
  id: number
  name: string
  description: string
  serviceGroup: CategoryServiceGroup
}

// ─── Portfolio ─────────────────────────────────────────

export type SavePortfolioItemRequest = {
  title: string
  description?: string
  categoryId: number
  coverImageUrl?: string
  styleTag?: string
  priceEstimate?: number
}

export type PortfolioItemResponse = {
  id: number
  title: string
  description: string
  category: CategoryResponse
  professionalId: number
  professionalName: string
  coverImageUrl: string
  priceEstimate: number
  styleTag: string
  createdAt: string
}

export type PortfolioItemSummaryResponse = {
  id: number
  title: string
  categoryName: string
  coverImageUrl: string
  priceEstimate: number
  styleTag: string
}

// ─── Bookings ──────────────────────────────────────────

export type BookingRequest = {
  requestType: BookingRequestType
  professionalId?: number
  portfolioItemId?: number
  scheduledAt: string
  notes?: string
  categoryId?: number
  preferredStyle?: string
  budget?: number
  location?: string
}

export type BookingResponse = {
  id: number
  requestType: BookingRequestType
  customerId: number
  customerName: string
  professionalId?: number
  professionalName?: string
  portfolioItemId?: number
  portfolioItemTitle?: string
  categoryId?: number
  categoryName?: string
  preferredStyle?: string
  budget?: number
  location?: string
  scheduledAt: string
  status: BookingStatus
  notes?: string
  createdAt: string
}

export type BookingStatusUpdateRequest = {
  status: BookingStatus
}

export type AssignProfessionalRequest = {
  professionalId: number
}

// ─── Quotations ────────────────────────────────────────

export type QuotationLineItemRequest = {
  description: string
  quantity?: number
  unit?: string
  unitPrice?: number
  amount: number
}

export type SaveQuotationRequest = {
  notes?: string
  lineItems: QuotationLineItemRequest[]
}

export type QuotationLineItemResponse = {
  id: number
  description: string
  quantity?: number
  unit?: string
  unitPrice?: number
  amount: number
}

export type QuotationResponse = {
  id: number
  bookingId: number
  status: QuotationStatus
  notes?: string
  totalAmount: number
  lineItems: QuotationLineItemResponse[]
  createdAt: string
  updatedAt: string
}

// ─── Reviews ───────────────────────────────────────────

export type CreateReviewRequest = {
  rating: number
  comment?: string
}

export type ReviewResponse = {
  id: number
  bookingId: number
  rating: number
  comment?: string
  createdAt: string
}

export type PublicReviewResponse = {
  id: number
  rating: number
  comment?: string
  customerName: string
  createdAt: string
}

// ─── Professionals ─────────────────────────────────────

export type ProfessionalSummaryResponse = {
  id: number
  fullName: string
  specialization: string
  city: string
  yearsExperience: number
  availabilityStatus: AvailabilityStatus
  averageRating: number
  ratingCount: number
}

export type ProfessionalPublicProfileResponse = {
  id: number
  fullName: string
  bio: string
  yearsExperience: number
  specialization: string
  city: string
  availabilityStatus: AvailabilityStatus
  averageRating: number
  ratingCount: number
}

export type ProfessionalMatchResponse = {
  professionalId: number
  fullName: string
  specialization: string
  city: string
  yearsExperience: number
  averageRating: number
  ratingCount: number
  availabilityStatus: AvailabilityStatus
  score: number
}

// ─── Media ─────────────────────────────────────────────

export type UploadPurpose = 'PORTFOLIO_COVER' | 'AVATAR' | 'BOOKING_INSPIRATION'

export type UploadResponse = {
  url: string
}

export type MediaUploadResponse = {
  secureUrl: string
  publicId: string
  format: string
  bytes: number
  width: number
  height: number
}

// ─── Pagination ────────────────────────────────────────

export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}
