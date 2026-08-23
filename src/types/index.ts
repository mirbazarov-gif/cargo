export type UserRole = 'shipper' | 'carrier' | 'admin' | 'guest';

export type BodyType =
  | 'tent'
  | 'box'
  | 'refrigerated'
  | 'flatbed'
  | 'container'
  | 'isothermal'
  | 'tipper'
  | 'other';

export type CargoType =
  | 'food'
  | 'building_materials'
  | 'furniture'
  | 'machinery'
  | 'appliances'
  | 'clothing'
  | 'agriculture'
  | 'industrial'
  | 'chemical'
  | 'other';

export type PackageType = 'pallets' | 'boxes' | 'bags' | 'bulk' | 'pieces' | 'container' | 'other';

export type VehicleStatus = 'available' | 'soon_available' | 'busy';

export type CargoStatus =
  | 'draft'
  | 'published'
  | 'receiving_offers'
  | 'matched'
  | 'booked'
  | 'completed'
  | 'cancelled';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export type OrderStatus =
  | 'created'
  | 'carrier_selected'
  | 'confirmed'
  | 'going_to_pickup'
  | 'loaded'
  | 'in_transit'
  | 'arrived'
  | 'unloading'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  role: UserRole;
  rating: number;
  totalOrders: number;
  onTimePercent: number;
  isVerified: boolean;
  score: number; // CargoMatch Trust Score out of 100
  city: string;
  country: string;
  avatar: string;
  createdAt: string;
  reviewsCount: number;
  companyDetails?: {
    inn?: string;
    registrationYear?: number;
    fleetSize?: number;
    specialization?: string[];
  };
}

export interface Vehicle {
  id: string;
  carrierId: string;
  carrierName: string;
  carrierRating: number;
  carrierScore: number;
  carrierVerified: boolean;
  make: string;
  model: string;
  year: number;
  plateNumberMasked: string; // e.g. "01 KG *** 777"
  bodyType: BodyType;
  capacityTons: number;
  volumeM3: number;
  lengthM: number;
  widthM: number;
  heightM: number;
  palletCapacity: number;
  hasTailLift: boolean;
  isTemperatureControlled: boolean;
  tempMin?: number;
  tempMax?: number;
  isAdr: boolean;
  status: VehicleStatus;
  currentCity: string;
  currentCountry: string;
  availableDate: string;
  photoUrl: string;
}

export interface Cargo {
  id: string;
  cargoNumber: string;
  shipperId: string;
  shipperName: string;
  shipperPhoneMasked: string;
  shipperRating: number;
  shipperScore: number;
  shipperVerified: boolean;
  
  // Route
  originCountry: string;
  originCity: string;
  originAddress: string;
  originCoords: [number, number]; // [lat, lng]
  
  destinationCountry: string;
  destinationCity: string;
  destinationAddress: string;
  destinationCoords: [number, number];
  
  distanceKm: number;
  estimatedHours: number;

  // Dates
  pickupDate: string;
  pickupTimeWindow?: string;
  desiredDeliveryDate: string;

  // Cargo Specs
  cargoType: CargoType;
  title: string;
  description?: string;
  weightTons: number;
  volumeM3: number;
  packagesCount: number;
  packageType: PackageType;

  // Requirements
  requiredBodyTypes: BodyType[];
  isTemperatureControlled?: boolean;
  tempMin?: number;
  tempMax?: number;
  requiresTailLift?: boolean;
  isFragile?: boolean;
  isAdr?: boolean;
  customRequirements?: string;

  // Financials
  suggestedPrice: number;
  currency: 'KGS' | 'USD' | 'KZT';
  paymentTerms: 'on_delivery' | 'prepaid_50' | 'postpaid_bank';

  photos?: string[];
  status: CargoStatus;
  offersCount: number;
  createdAt: string;
}

export interface CargoOffer {
  id: string;
  cargoId: string;
  carrierId: string;
  carrierName: string;
  carrierAvatar: string;
  carrierRating: number;
  carrierScore: number;
  carrierVerified: boolean;
  carrierCompletedOrders: number;
  vehicleId: string;
  vehicleName: string;
  vehicleType: BodyType;
  vehicleSpecs: string; // e.g. "5 тонн · 20 м³"
  
  offeredPrice: number;
  currency: 'KGS' | 'USD' | 'KZT';
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  comment?: string;
  
  matchScore: number; // 0 - 100
  matchReasons: string[];
  status: OfferStatus;
  createdAt: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  title: string;
  comment?: string;
  updatedBy: string;
  location?: string;
}

export interface DocumentItem {
  id: string;
  orderId: string;
  title: string;
  type: 'waybill' | 'act' | 'contract' | 'cargo_photo' | 'delivery_proof' | 'invoice';
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
  status: 'pending' | 'verified';
}

export interface ReviewCriteria {
  reliability?: number;
  timeliness?: number;
  vehicleState?: number;
  communication?: number;
  timelyPayment?: number;
  accurateCargoInfo?: number;
}

export interface Review {
  id: string;
  orderId: string;
  fromUserId: string;
  fromUserName: string;
  fromRole: UserRole;
  toUserId: string;
  toUserName: string;
  overallRating: number;
  criteria: ReviewCriteria;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  cargoId: string;
  cargo: Cargo;
  offerId: string;
  
  shipperId: string;
  shipperName: string;
  shipperPhone: string;
  
  carrierId: string;
  carrierName: string;
  carrierPhone: string;
  
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  
  agreedPrice: number;
  currency: 'KGS' | 'USD' | 'KZT';
  commissionRate: number; // e.g. 0.05 (5%)
  commissionAmount: number;
  
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  currentStepIndex: number;
  
  currentProgressPercent: number;
  currentLocationName: string;
  
  documents: DocumentItem[];
  shipperReview?: Review;
  carrierReview?: Review;
  
  pickupDate: string;
  deliveryDate: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  attachment?: {
    name: string;
    type: 'image' | 'doc';
    size: string;
  };
  timestamp: string;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'new_match'
    | 'new_offer'
    | 'carrier_chosen'
    | 'order_status_update'
    | 'reverse_cargo_found'
    | 'review_received'
    | 'system';
  createdAt: string;
  isRead: boolean;
  linkTab?: string;
  relatedId?: string;
}

export interface PopularRoute {
  id: string;
  fromCity: string;
  fromCountry: string;
  toCity: string;
  toCountry: string;
  distanceKm: number;
  avgHours: number;
  activeCargosCount: number;
  avgPriceKgs: number;
  popularBodyType: string;
  trend: '+12%' | '+8%' | '-3%' | '+15%';
}
