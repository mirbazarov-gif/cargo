import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_CARGOS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_OFFERS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_VEHICLES,
} from '../data/mockData';
import {
  Cargo,
  CargoOffer,
  ChatMessage,
  DocumentItem,
  NotificationItem,
  Order,
  OrderStatus,
  Review,
  User,
  UserRole,
  Vehicle,
  VehicleStatus,
} from '../types';
import { calculateDistance } from '../data/geo';
import { calculateMatchScore } from '../utils/matching';

export type AppView =
  | 'landing'
  | 'shipper-dashboard'
  | 'create-cargo'
  | 'my-cargos'
  | 'cargo-matching'
  | 'carrier-dashboard'
  | 'find-cargo'
  | 'reverse-cargos'
  | 'my-fleet'
  | 'orders'
  | 'order-detail'
  | 'chat'
  | 'documents'
  | 'carrier-profile'
  | 'shipper-profile'
  | 'admin'
  | 'popular-routes';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  users: User[];
  currentView: AppView;
  selectedCargoId: string | null;
  selectedOrderId: string | null;
  selectedCarrierId: string | null;
  selectedShipperId: string | null;
  cargos: Cargo[];
  vehicles: Vehicle[];
  offers: CargoOffer[];
  orders: Order[];
  chatMessages: ChatMessage[];
  notifications: NotificationItem[];
  commissionRate: number; // e.g. 0.05
  setCommissionRate: (rate: number) => void;
  
  // Navigation & Role actions
  setCurrentView: (view: AppView) => void;
  switchRole: (role: UserRole) => void;
  selectCargo: (cargoId: string, view?: AppView) => void;
  selectOrder: (orderId: string, view?: AppView) => void;
  viewCarrierProfile: (carrierId: string) => void;
  viewShipperProfile: (shipperId: string) => void;

  // Domain Actions
  createCargo: (cargoData: Partial<Cargo>) => Cargo;
  updateCargoStatus: (cargoId: string, status: Cargo['status']) => void;
  addVehicle: (vehicleData: Partial<Vehicle>) => Vehicle;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  createOffer: (offerData: Partial<CargoOffer>) => CargoOffer;
  acceptOffer: (offerId: string) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, comment?: string, locationName?: string) => void;
  sendChatMessage: (orderId: string, text: string, attachment?: { name: string; type: 'image' | 'doc'; size: string }) => void;
  uploadDocument: (orderId: string, doc: Partial<DocumentItem>) => void;
  submitReview: (orderId: string, reviewData: Partial<Review>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getReverseCargos: (cityOrigin?: string) => Cargo[];
  resetDataToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ORDER_STEPS_ORDER: OrderStatus[] = [
  'created',
  'carrier_selected',
  'confirmed',
  'going_to_pickup',
  'loaded',
  'in_transit',
  'arrived',
  'unloading',
  'delivered',
  'completed',
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cm_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('cm_current_role');
    return (saved as UserRole) || 'shipper';
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem('cm_current_view');
    return (saved as AppView) || 'landing';
  });

  const [cargos, setCargos] = useState<Cargo[]>(() => {
    const saved = localStorage.getItem('cm_cargos');
    return saved ? JSON.parse(saved) : INITIAL_CARGOS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('cm_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [offers, setOffers] = useState<CargoOffer[]>(() => {
    const saved = localStorage.getItem('cm_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cm_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('cm_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cm_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [commissionRate, setCommissionRateState] = useState<number>(() => {
    const saved = localStorage.getItem('cm_commission_rate');
    return saved ? Number(saved) : 0.05;
  });

  const [selectedCargoId, setSelectedCargoId] = useState<string | null>('cargo-1');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('ord-101');
  const [selectedCarrierId, setSelectedCarrierId] = useState<string | null>('user-carrier-1');
  const [selectedShipperId, setSelectedShipperId] = useState<string | null>('user-shipper-1');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cm_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('cm_current_role', currentRole);
  }, [currentRole]);
  useEffect(() => {
    localStorage.setItem('cm_current_view', currentView);
  }, [currentView]);
  useEffect(() => {
    localStorage.setItem('cm_cargos', JSON.stringify(cargos));
  }, [cargos]);
  useEffect(() => {
    localStorage.setItem('cm_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);
  useEffect(() => {
    localStorage.setItem('cm_offers', JSON.stringify(offers));
  }, [offers]);
  useEffect(() => {
    localStorage.setItem('cm_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('cm_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);
  useEffect(() => {
    localStorage.setItem('cm_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('cm_commission_rate', commissionRate.toString());
  }, [commissionRate]);

  // Derived current user according to active role
  const currentUser: User =
    users.find((u) => u.role === currentRole) ||
    (currentRole === 'carrier'
      ? users.find((u) => u.id === 'user-carrier-1')!
      : currentRole === 'admin'
      ? users.find((u) => u.id === 'user-admin-1')!
      : users.find((u) => u.id === 'user-shipper-1')!);

  const setCommissionRate = (rate: number) => {
    setCommissionRateState(rate);
  };

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'shipper') {
      setCurrentView('shipper-dashboard');
    } else if (newRole === 'carrier') {
      setCurrentView('carrier-dashboard');
    } else if (newRole === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('landing');
    }
  };

  const selectCargo = (cargoId: string, view: AppView = 'cargo-matching') => {
    setSelectedCargoId(cargoId);
    setCurrentView(view);
  };

  const selectOrder = (orderId: string, view: AppView = 'order-detail') => {
    setSelectedOrderId(orderId);
    setCurrentView(view);
  };

  const viewCarrierProfile = (carrierId: string) => {
    setSelectedCarrierId(carrierId);
    setCurrentView('carrier-profile');
  };

  const viewShipperProfile = (shipperId: string) => {
    setSelectedShipperId(shipperId);
    setCurrentView('shipper-profile');
  };

  const createCargo = (data: Partial<Cargo>): Cargo => {
    const geo = calculateDistance(data.originCity || 'Бишкек', data.destinationCity || 'Ош');
    const newId = `cargo-${Date.now()}`;
    const cargoNumber = `CM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCargo: Cargo = {
      id: newId,
      cargoNumber,
      shipperId: currentUser.id,
      shipperName: currentUser.companyName || currentUser.name,
      shipperPhoneMasked: currentUser.phone ? `${currentUser.phone.substring(0, 8)} ••-••-${currentUser.phone.slice(-2)}` : '+996 555 ••-••-00',
      shipperRating: currentUser.rating,
      shipperScore: currentUser.score,
      shipperVerified: currentUser.isVerified,
      originCountry: data.originCountry || 'Кыргызстан',
      originCity: data.originCity || 'Бишкек',
      originAddress: data.originAddress || 'Центральный терминал',
      originCoords: data.originCoords || [42.8746, 74.5698],
      destinationCountry: data.destinationCountry || 'Кыргызстан',
      destinationCity: data.destinationCity || 'Ош',
      destinationAddress: data.destinationAddress || 'Склад получателя',
      destinationCoords: data.destinationCoords || [40.514, 72.8161],
      distanceKm: geo.km,
      estimatedHours: geo.hours,
      pickupDate: data.pickupDate || new Date().toISOString().split('T')[0],
      pickupTimeWindow: data.pickupTimeWindow || '09:00 - 12:00',
      desiredDeliveryDate: data.desiredDeliveryDate || new Date().toISOString().split('T')[0],
      cargoType: data.cargoType || 'food',
      title: data.title || 'Сборный коммерческий груз',
      description: data.description || '',
      weightTons: Number(data.weightTons) || 2.5,
      volumeM3: Number(data.volumeM3) || 12,
      packagesCount: Number(data.packagesCount) || 50,
      packageType: data.packageType || 'boxes',
      requiredBodyTypes: data.requiredBodyTypes?.length ? data.requiredBodyTypes : ['tent', 'box'],
      isTemperatureControlled: data.isTemperatureControlled || false,
      tempMin: data.tempMin,
      tempMax: data.tempMax,
      requiresTailLift: data.requiresTailLift || false,
      isFragile: data.isFragile || false,
      isAdr: data.isAdr || false,
      suggestedPrice: Number(data.suggestedPrice) || 15000,
      currency: data.currency || 'KGS',
      paymentTerms: data.paymentTerms || 'on_delivery',
      photos: data.photos || [],
      status: 'receiving_offers',
      offersCount: 0,
      createdAt: new Date().toISOString(),
    };

    setCargos((prev) => [newCargo, ...prev]);

    // Automatically simulate matched carriers and generate proactive offers if applicable
    const compatibleVehicles = vehicles.filter((v) => {
      const match = calculateMatchScore(newCargo, v);
      return match.isCompatible && match.score >= 70;
    });

    if (compatibleVehicles.length > 0) {
      const topVehicle = compatibleVehicles[0];
      const matchCalc = calculateMatchScore(newCargo, topVehicle);
      const autoOffer: CargoOffer = {
        id: `offer-auto-${Date.now()}`,
        cargoId: newId,
        carrierId: topVehicle.carrierId,
        carrierName: topVehicle.carrierName,
        carrierAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        carrierRating: topVehicle.carrierRating,
        carrierScore: topVehicle.carrierScore,
        carrierVerified: topVehicle.carrierVerified,
        carrierCompletedOrders: 214,
        vehicleId: topVehicle.id,
        vehicleName: `${topVehicle.make} ${topVehicle.model}`,
        vehicleType: topVehicle.bodyType,
        vehicleSpecs: `${topVehicle.capacityTons} т · ${topVehicle.volumeM3} м³`,
        offeredPrice: newCargo.suggestedPrice,
        currency: newCargo.currency,
        pickupDate: newCargo.pickupDate,
        pickupTime: '09:00',
        deliveryDate: newCargo.desiredDeliveryDate,
        comment: 'Здравствуйте! Готовы выполнить рейс на данном автомобиле. Чистый кузов, документы в порядке.',
        matchScore: matchCalc.score,
        matchReasons: matchCalc.reasons,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setOffers((prev) => [autoOffer, ...prev]);
      newCargo.offersCount = 1;

      // Add Notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: `Новое предложение по грузу ${newCargo.cargoNumber}!`,
        message: `${topVehicle.carrierName} предложил ${newCargo.suggestedPrice} сом (${matchCalc.score}% Match)`,
        type: 'new_offer',
        createdAt: 'Только что',
        isRead: false,
        linkTab: 'cargo-matching',
        relatedId: newCargo.id,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    return newCargo;
  };

  const updateCargoStatus = (cargoId: string, status: Cargo['status']) => {
    setCargos((prev) => prev.map((c) => (c.id === cargoId ? { ...c, status } : c)));
  };

  const addVehicle = (data: Partial<Vehicle>): Vehicle => {
    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      carrierId: currentUser.id,
      carrierName: currentUser.companyName || currentUser.name,
      carrierRating: currentUser.rating,
      carrierScore: currentUser.score,
      carrierVerified: currentUser.isVerified,
      make: data.make || 'Mercedes-Benz',
      model: data.model || 'Sprinter',
      year: data.year || 2022,
      plateNumberMasked: data.plateNumberMasked || '01 KG ••• 567',
      bodyType: data.bodyType || 'tent',
      capacityTons: Number(data.capacityTons) || 3.5,
      volumeM3: Number(data.volumeM3) || 18,
      lengthM: Number(data.lengthM) || 4.5,
      widthM: Number(data.widthM) || 2.1,
      heightM: Number(data.heightM) || 2.2,
      palletCapacity: Number(data.palletCapacity) || 8,
      hasTailLift: Boolean(data.hasTailLift),
      isTemperatureControlled: Boolean(data.isTemperatureControlled),
      tempMin: data.tempMin,
      tempMax: data.tempMax,
      isAdr: Boolean(data.isAdr),
      status: data.status || 'available',
      currentCity: data.currentCity || 'Бишкек',
      currentCountry: data.currentCountry || 'Кыргызстан',
      availableDate: data.availableDate || new Date().toISOString().split('T')[0],
      photoUrl:
        data.photoUrl ||
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
    };

    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status } : v)));
  };

  const createOffer = (data: Partial<CargoOffer>): CargoOffer => {
    const targetCargo = cargos.find((c) => c.id === data.cargoId);
    const vehicle = vehicles.find((v) => v.id === data.vehicleId) || vehicles[0];

    const matchCalc = targetCargo && vehicle ? calculateMatchScore(targetCargo, vehicle) : { score: 94, reasons: ['Подходит тип кузова', 'Машина свободна'] };

    const newOffer: CargoOffer = {
      id: `offer-${Date.now()}`,
      cargoId: data.cargoId || '',
      carrierId: currentUser.id,
      carrierName: currentUser.companyName || currentUser.name,
      carrierAvatar: currentUser.avatar,
      carrierRating: currentUser.rating,
      carrierScore: currentUser.score,
      carrierVerified: currentUser.isVerified,
      carrierCompletedOrders: currentUser.totalOrders,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.make} ${vehicle.model}`,
      vehicleType: vehicle.bodyType,
      vehicleSpecs: `${vehicle.capacityTons} т · ${vehicle.volumeM3} м³`,
      offeredPrice: Number(data.offeredPrice) || 15000,
      currency: data.currency || 'KGS',
      pickupDate: data.pickupDate || targetCargo?.pickupDate || '2026-08-28',
      pickupTime: data.pickupTime || '09:00',
      deliveryDate: data.deliveryDate || targetCargo?.desiredDeliveryDate || '2026-08-29',
      comment: data.comment || 'Предлагаем надежную доставку в срок.',
      matchScore: matchCalc.score,
      matchReasons: matchCalc.reasons,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOffers((prev) => [newOffer, ...prev]);

    // Update cargo offers count
    setCargos((prev) =>
      prev.map((c) => (c.id === data.cargoId ? { ...c, offersCount: (c.offersCount || 0) + 1 } : c))
    );

    // Notify shipper
    if (targetCargo) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: targetCargo.shipperId,
        title: `Новое предложение цены по ${targetCargo.title}`,
        message: `${newOffer.carrierName} предлагает ${newOffer.offeredPrice} сом (${newOffer.matchScore}% Match)`,
        type: 'new_offer',
        createdAt: 'Только что',
        isRead: false,
        linkTab: 'cargo-matching',
        relatedId: targetCargo.id,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return newOffer;
  };

  const acceptOffer = (offerId: string): Order => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) throw new Error('Предложение не найдено');

    const cargo = cargos.find((c) => c.id === offer.cargoId);
    if (!cargo) throw new Error('Груз не найден');

    const vehicle = vehicles.find((v) => v.id === offer.vehicleId) || vehicles[0];

    // Mark offer accepted, reject other offers for this cargo
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) return { ...o, status: 'accepted' };
        if (o.cargoId === offer.cargoId) return { ...o, status: 'rejected' };
        return o;
      })
    );

    // Mark cargo booked
    setCargos((prev) =>
      prev.map((c) => (c.id === cargo.id ? { ...c, status: 'booked' } : c))
    );

    // Calculate commission
    const commissionAmount = Math.round(offer.offeredPrice * commissionRate);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      cargoId: cargo.id,
      cargo: cargo,
      offerId: offer.id,
      shipperId: cargo.shipperId,
      shipperName: cargo.shipperName,
      shipperPhone: '+996 555 12-34-56',
      carrierId: offer.carrierId,
      carrierName: offer.carrierName,
      carrierPhone: '+996 777 23-45-67',
      vehicleId: offer.vehicleId,
      vehicleName: offer.vehicleName,
      vehiclePlate: vehicle.plateNumberMasked.replace('•••', '777'),
      agreedPrice: offer.offeredPrice,
      currency: offer.currency,
      commissionRate: commissionRate,
      commissionAmount: commissionAmount,
      status: 'confirmed',
      currentStepIndex: 2,
      currentProgressPercent: 15,
      currentLocationName: `${cargo.originCity} (Ожидание подачи машины)`,
      documents: [
        {
          id: `doc-gen-${Date.now()}`,
          orderId: `ord-${Date.now()}`,
          title: 'Электронный договор-заявка CargoMatch',
          type: 'contract',
          fileName: `Contract_${cargo.cargoNumber}.pdf`,
          fileSize: '1.1 MB',
          uploadedBy: 'CargoMatch ЭДО',
          uploadedAt: new Date().toLocaleDateString('ru-RU'),
          status: 'verified',
        },
      ],
      pickupDate: `${offer.pickupDate} ${offer.pickupTime}`,
      deliveryDate: offer.deliveryDate,
      statusHistory: [
        {
          status: 'created',
          timestamp: new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          title: 'Заказ создан',
          comment: `Грузовладелец выбрал перевозчика ${offer.carrierName}`,
          updatedBy: 'Система',
        },
        {
          status: 'confirmed',
          timestamp: new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          title: 'Заказ подтверждён',
          comment: `Согласована стоимость ${offer.offeredPrice} сом. Контакты открыты.`,
          updatedBy: 'Система',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Initial system chat message
    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderId: newOrder.id,
      senderId: 'system',
      senderName: 'CargoMatch Bot',
      senderRole: 'admin',
      text: `Сделка по заказу ${newOrder.orderNumber} подтверждена! Согласованная цена: ${offer.offeredPrice} ${offer.currency}. Телефон грузовладельца: +996 555 12-34-56, телефон перевозчика: +996 777 23-45-67.`,
      timestamp: 'Только что',
      isRead: false,
    };
    setChatMessages((prev) => [...prev, initialMessage]);

    // Notify carrier
    const carrierNotif: NotificationItem = {
      id: `notif-c-${Date.now()}`,
      userId: offer.carrierId,
      title: `🎉 Вы выбраны перевозчиком! Заказ ${newOrder.orderNumber}`,
      message: `Грузовладелец принял ваше предложение на ${offer.offeredPrice} сом (${cargo.originCity} → ${cargo.destinationCity})`,
      type: 'carrier_chosen',
      createdAt: 'Только что',
      isRead: false,
      linkTab: 'orders',
      relatedId: newOrder.id,
    };
    setNotifications((prev) => [carrierNotif, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    comment?: string,
    locationName?: string
  ) => {
    const stepIdx = ORDER_STEPS_ORDER.indexOf(newStatus);
    const progress = Math.min(100, Math.max(10, Math.round(((stepIdx + 1) / ORDER_STEPS_ORDER.length) * 100)));

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const newHistoryItem = {
          status: newStatus,
          timestamp:
            new Date().toLocaleDateString('ru-RU') +
            ' ' +
            new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          title: getStatusRussianTitle(newStatus),
          comment: comment || `Статус обновлен пользователем ${currentUser.name}`,
          updatedBy: currentUser.name,
          location: locationName || ord.currentLocationName,
        };

        const updatedOrder: Order = {
          ...ord,
          status: newStatus,
          currentStepIndex: stepIdx >= 0 ? stepIdx : ord.currentStepIndex,
          currentProgressPercent: progress,
          currentLocationName: locationName || ord.currentLocationName,
          statusHistory: [...ord.statusHistory, newHistoryItem],
        };

        return updatedOrder;
      })
    );

    // If order delivered or completed, update reverse cargo alert
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && (newStatus === 'delivered' || newStatus === 'completed')) {
      // Create Reverse Cargo notification for carrier
      const reverseNotif: NotificationItem = {
        id: `notif-rev-${Date.now()}`,
        userId: targetOrder.carrierId,
        title: `⚡ Найдены обратные грузы из ${targetOrder.cargo.destinationCity}!`,
        message: `Не возвращайтесь пустыми! Доступно грузов по направлению ${targetOrder.cargo.destinationCity} → ${targetOrder.cargo.originCity}`,
        type: 'reverse_cargo_found',
        createdAt: 'Только что',
        isRead: false,
        linkTab: 'reverse',
      };
      setNotifications((prev) => [reverseNotif, ...prev]);
    }
  };

  const sendChatMessage = (
    orderId: string,
    text: string,
    attachment?: { name: string; type: 'image' | 'doc'; size: string }
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      attachment,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Simulate auto-reply from counter-party after 2 seconds if user is shipper/carrier
    setTimeout(() => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const isShipperSending = currentUser.role === 'shipper';
      const autoReplyText = isShipperSending
        ? 'Принял информацию! Держу связь, машина готова.'
        : 'Спасибо за оперативный ответ! Ждём подтверждения на складе.';

      const replyMsg: ChatMessage = {
        id: `msg-rep-${Date.now()}`,
        orderId,
        senderId: isShipperSending ? order.carrierId : order.shipperId,
        senderName: isShipperSending ? order.carrierName : order.shipperName,
        senderRole: isShipperSending ? 'carrier' : 'shipper',
        text: autoReplyText,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      };
      setChatMessages((prev) => [...prev, replyMsg]);
    }, 2000);
  };

  const uploadDocument = (orderId: string, doc: Partial<DocumentItem>) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      orderId,
      title: doc.title || 'Документ к заказу',
      type: doc.type || 'waybill',
      fileName: doc.fileName || 'document.pdf',
      fileSize: doc.fileSize || '1.2 MB',
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toLocaleDateString('ru-RU'),
      status: 'verified',
      url: doc.url,
    };

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, documents: [newDoc, ...ord.documents] } : ord))
    );
  };

  const submitReview = (orderId: string, reviewData: Partial<Review>) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const isShipper = currentUser.role === 'shipper';
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      orderId,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromRole: currentUser.role,
      toUserId: isShipper ? order.carrierId : order.shipperId,
      toUserName: isShipper ? order.carrierName : order.shipperName,
      overallRating: reviewData.overallRating || 5,
      criteria: reviewData.criteria || { reliability: 5, timeliness: 5, communication: 5 },
      comment: reviewData.comment || 'Сотрудничеством полностью доволен, всё четко и профессионально!',
      createdAt: new Date().toLocaleDateString('ru-RU'),
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return isShipper
          ? { ...ord, shipperReview: newReview, status: 'completed' }
          : { ...ord, carrierReview: newReview, status: 'completed' };
      })
    );

    // Update target user score/rating
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === newReview.toUserId) {
          const newCount = (u.reviewsCount || 0) + 1;
          const newRating = Number(((u.rating * u.reviewsCount + newReview.overallRating) / newCount).toFixed(1));
          return { ...u, rating: newRating, reviewsCount: newCount };
        }
        return u;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
  };

  const getReverseCargos = (cityOrigin: string = 'Ош'): Cargo[] => {
    return cargos.filter(
      (c) =>
        c.originCity.toLowerCase() === cityOrigin.toLowerCase() &&
        (c.destinationCity.toLowerCase() === 'бишкек' || c.destinationCity.toLowerCase() === 'чуй')
    );
  };

  const resetDataToDefaults = () => {
    setUsers(INITIAL_USERS);
    setCargos(INITIAL_CARGOS);
    setVehicles(INITIAL_VEHICLES);
    setOffers(INITIAL_OFFERS);
    setOrders(INITIAL_ORDERS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCommissionRateState(0.05);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        currentView,
        selectedCargoId,
        selectedOrderId,
        selectedCarrierId,
        selectedShipperId,
        cargos,
        vehicles,
        offers,
        orders,
        chatMessages,
        notifications,
        commissionRate,
        setCommissionRate,
        setCurrentView,
        switchRole,
        selectCargo,
        selectOrder,
        viewCarrierProfile,
        viewShipperProfile,
        createCargo,
        updateCargoStatus,
        addVehicle,
        updateVehicleStatus,
        createOffer,
        acceptOffer,
        updateOrderStatus,
        sendChatMessage,
        uploadDocument,
        submitReview,
        markNotificationRead,
        markAllNotificationsRead,
        getReverseCargos,
        resetDataToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

function getStatusRussianTitle(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    created: 'Заказ создан',
    carrier_selected: 'Перевозчик выбран',
    confirmed: 'Заказ подтверждён',
    going_to_pickup: 'Машина едет на загрузку',
    loaded: 'Груз загружен',
    in_transit: 'В пути',
    arrived: 'Прибыл в пункт назначения',
    unloading: 'Идёт разгрузка',
    delivered: 'Доставка подтверждена',
    completed: 'Заказ успешно завершён',
    cancelled: 'Заказ отменён',
    disputed: 'Открыт спор',
  };
  return map[status] || status;
}
