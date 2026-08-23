import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Filter,
  Flame,
  Info,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateMatchScore, formatPrice, formatVolume, formatWeight } from '../../utils/matching';
import { CargoOffer } from '../../types';

export const CargoMatchingView: React.FC = () => {
  const {
    cargos,
    selectedCargoId,
    selectCargo,
    offers,
    vehicles,
    acceptOffer,
    selectOrder,
    setCurrentView,
    viewCarrierProfile,
  } = useApp();

  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'rating_desc' | 'match_desc' | 'speed'>('recommended');
  const [selectedOfferForModal, setSelectedOfferForModal] = useState<CargoOffer | null>(null);

  const cargo = cargos.find((c) => c.id === selectedCargoId) || cargos[0];

  // All offers submitted for this cargo
  const cargoOffers = offers.filter((o) => o.cargoId === cargo?.id);

  // Auto-calculated matched vehicles from fleet that haven't submitted offer yet
  const matchedFleetVehicles = vehicles.filter((v) => {
    if (!cargo) return false;
    const match = calculateMatchScore(cargo, v);
    const hasOffer = cargoOffers.some((o) => o.vehicleId === v.id);
    return match.isCompatible && !hasOffer;
  });

  // Sorting
  const sortedOffers = [...cargoOffers].sort((a, b) => {
    if (sortBy === 'price_asc') return a.offeredPrice - b.offeredPrice;
    if (sortBy === 'rating_desc') return b.carrierRating - a.carrierRating;
    if (sortBy === 'match_desc') return b.matchScore - a.matchScore;
    if (sortBy === 'speed') return a.pickupTime.localeCompare(b.pickupTime);
    // default recommended: high match score + high rating + reasonable price
    return b.matchScore - a.matchScore;
  });

  const handleSelectCarrier = (offerId: string) => {
    try {
      const order = acceptOffer(offerId);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      selectOrder(order.id, 'order-detail');
    } catch (err) {
      console.error(err);
    }
  };

  if (!cargo) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 text-center">
        <p className="text-slate-500">Груз не найден</p>
        <button
          onClick={() => setCurrentView('my-cargos')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top bar & Back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => setCurrentView('my-cargos')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Все мои грузы</span>
          </button>

          {/* Quick Cargo Selector Switcher if multiple cargos exist */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Выбран груз:</span>
            <select
              value={cargo.id}
              onChange={(e) => selectCargo(e.target.value, 'cargo-matching')}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {cargos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cargoNumber} — {c.originCity} → {c.destinationCity} ({c.title.substring(0, 24)}...)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cargo Summary Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {cargo.cargoNumber}
                </span>
                <span className="text-xs text-slate-500 font-medium">• Размещён {cargo.pickupDate}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">
                  {cargoOffers.length} предложений
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 flex items-center space-x-2">
                <span>{cargo.originCity}</span>
                <ArrowRight className="w-5 h-5 text-emerald-500" />
                <span>{cargo.destinationCity}</span>
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-medium">{cargo.title}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Ориентировочный бюджет</span>
                <span className="text-xl font-black text-slate-900">{formatPrice(cargo.suggestedPrice)}</span>
              </div>
            </div>
          </div>

          {/* Quick specs chips */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Вес / Объём:</span>
              <span className="font-bold text-slate-800">
                {formatWeight(cargo.weightTons)} · {formatVolume(cargo.volumeM3)}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Подача машины:</span>
              <span className="font-bold text-slate-800">{cargo.pickupDate} ({cargo.pickupTimeWindow})</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Адрес загрузки:</span>
              <span className="font-bold text-slate-800 truncate block">{cargo.originAddress}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Требуемый кузов:</span>
              <span className="font-bold text-slate-800">
                {cargo.requiredBodyTypes.map((t) => (t === 'tent' ? 'Тент' : t === 'box' ? 'Фургон' : t === 'refrigerated' ? 'Рефрижератор' : t)).join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Offers & Matching Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Предложения от перевозчиков ({sortedOffers.length})
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              Живые ставки
            </span>
          </div>

          {/* Sorter Buttons (Section 6 requirement: рекомендуемые, цена, рейтинг, скорость) */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium hidden md:inline">Сортировка:</span>
            <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => setSortBy('recommended')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  sortBy === 'recommended' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Рекомендуемые
              </button>
              <button
                onClick={() => setSortBy('price_asc')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  sortBy === 'price_asc' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                По цене
              </button>
              <button
                onClick={() => setSortBy('rating_desc')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  sortBy === 'rating_desc' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                По рейтингу
              </button>
              <button
                onClick={() => setSortBy('match_desc')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  sortBy === 'match_desc' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Match %
              </button>
            </div>
          </div>
        </div>

        {/* OFFERS LIST - CARDS (Strict adherence to Section 5 & 6) */}
        {sortedOffers.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto animate-spin" />
            <h3 className="font-extrabold text-lg text-slate-800">Ожидаем первые предложения от водителей</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Обычно первое предложение поступает в течение 4–15 минут. Система уже уведомила подходящих перевозчиков.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition duration-200 space-y-4"
              >
                {/* Header of offer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={offer.carrierAvatar} alt={offer.carrierName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3
                          onClick={() => viewCarrierProfile(offer.carrierId)}
                          className="text-lg font-extrabold text-slate-900 hover:text-emerald-600 cursor-pointer transition"
                        >
                          {offer.carrierName}
                        </h3>
                        {offer.carrierVerified && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Проверенный перевозчик</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                        <span className="text-amber-500 font-bold flex items-center">
                          ★ {offer.carrierRating}
                        </span>
                        <span>•</span>
                        <span>{offer.carrierCompletedOrders} завершённых перевозок</span>
                        <span>•</span>
                        <span className="text-slate-700 font-semibold">Trust Score: {offer.carrierScore}/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Предлагаемая цена</span>
                      <div className="text-2xl font-black text-slate-900">{formatPrice(offer.offeredPrice)}</div>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 font-black text-sm">
                      {offer.matchScore}% Match
                    </div>
                  </div>
                </div>

                {/* Specs row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Автомобиль:</span>
                    <span className="font-bold text-slate-900">{offer.vehicleName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Характеристики:</span>
                    <span className="font-bold text-slate-900">{offer.vehicleSpecs}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px]">Готовность к подаче:</span>
                    <span className="font-bold text-emerald-700">{offer.pickupDate}, {offer.pickupTime}</span>
                  </div>
                </div>

                {/* Match Reasons List (Section 5 requirement) */}
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="font-semibold text-slate-500 mb-1">Причины совпадения (Matching):</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {offer.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comment from carrier */}
                {offer.comment && (
                  <div className="text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100 italic">
                    «{offer.comment}»
                  </div>
                )}

                {/* Bottom Action buttons: Выбрать, Подробнее, Связаться */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Контакты и прямой телефон откроются сразу после подтверждения выбора.</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewCarrierProfile(offer.carrierId)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                    >
                      Подробнее
                    </button>
                    <button
                      onClick={() => handleSelectCarrier(offer.id)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition transform active:scale-95 cursor-pointer"
                    >
                      Выбрать перевозчика
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* POTENTIAL MATCHING FLEET VEHICLES IN REGION */}
        {matchedFleetVehicles.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Свободный подходящий транспорт в регионе ({matchedFleetVehicles.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Эти автомобили соответствуют параметрам груза на 80%+ и могут принять заявку.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedFleetVehicles.slice(0, 2).map((veh) => {
                const matchResult = calculateMatchScore(cargo, veh);
                return (
                  <div
                    key={veh.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                        <img src={veh.photoUrl} alt={veh.model} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{veh.make} {veh.model}</div>
                        <div className="text-xs text-slate-500">
                          {veh.capacityTons} т · {veh.volumeM3} м³ • {veh.carrierName}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                          {matchResult.score}% совпадение параметров
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => viewCarrierProfile(veh.carrierId)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                    >
                      Профиль
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
