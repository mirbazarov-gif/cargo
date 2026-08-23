import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../data/geo';
import { BodyType, Cargo, CargoType } from '../../types';
import { BODY_TYPE_LABELS, CARGO_TYPE_LABELS, calculateMatchScore, formatPrice, formatVolume, formatWeight } from '../../utils/matching';

export const FindCargoView: React.FC = () => {
  const { cargos, vehicles, currentUser, createOffer, setCurrentView, selectCargo } = useApp();

  const [originFilter, setOriginFilter] = useState<string>('all');
  const [destFilter, setDestFilter] = useState<string>('all');
  const [maxWeight, setMaxWeight] = useState<number>(20);
  const [bodyTypeFilter, setBodyTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for Making Offer
  const [biddingCargo, setBiddingCargo] = useState<Cargo | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [offeredPrice, setOfferedPrice] = useState<number>(15000);
  const [offerPickupDate, setOfferPickupDate] = useState<string>('2026-08-28');
  const [offerPickupTime, setOfferPickupTime] = useState<string>('09:00');
  const [offerComment, setOfferComment] = useState<string>('Подадим чистую проверенную машину точно к назначенному времени.');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  const myVehicles = vehicles.filter((v) => v.carrierId === currentUser.id);
  const activeCarrierVehicle = myVehicles[0] || vehicles[0];

  const filteredCargos = cargos.filter((c) => {
    if (c.status !== 'published' && c.status !== 'receiving_offers') return false;

    if (originFilter !== 'all' && c.originCity.toLowerCase() !== originFilter.toLowerCase()) return false;
    if (destFilter !== 'all' && c.destinationCity.toLowerCase() !== destFilter.toLowerCase()) return false;
    if (c.weightTons > maxWeight) return false;
    if (bodyTypeFilter !== 'all' && !c.requiredBodyTypes.includes(bodyTypeFilter as BodyType)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${c.title} ${c.originCity} ${c.destinationCity} ${c.cargoNumber}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });

  const handleOpenBidModal = (cargo: Cargo) => {
    setBiddingCargo(cargo);
    setOfferedPrice(cargo.suggestedPrice);
    setOfferPickupDate(cargo.pickupDate);
    if (myVehicles.length > 0) {
      setSelectedVehicleId(myVehicles[0].id);
    }
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingCargo) return;

    createOffer({
      cargoId: biddingCargo.id,
      vehicleId: selectedVehicleId || vehicles[0].id,
      offeredPrice: Number(offeredPrice),
      pickupDate: offerPickupDate,
      pickupTime: offerPickupTime,
      deliveryDate: biddingCargo.desiredDeliveryDate,
      comment: offerComment,
    });

    setBiddingCargo(null);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Поиск заказов
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Найти попутный и обратный груз
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Смотрите только подходящие грузы, предлагайте свою цену и работайте напрямую без посредников
            </p>
          </div>

          <button
            onClick={() => setCurrentView('reverse-cargos')}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-2 whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Поиск обратных грузов</span>
          </button>
        </div>

        {/* Filters Bar (Section 10 requirement) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Фильтры поиска</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Origin */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Откуда</label>
              <select
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Все города</option>
                {CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Куда</label>
              <select
                value={destFilter}
                onChange={(e) => setDestFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Все направления</option>
                {CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Weight */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Грузоподъёмность (до {maxWeight} т)
              </label>
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={maxWeight}
                onChange={(e) => setMaxWeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Body type */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Тип кузова</label>
              <select
                value={bodyTypeFilter}
                onChange={(e) => setBodyTypeFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Любой кузов</option>
                <option value="tent">Тент</option>
                <option value="box">Фургон</option>
                <option value="refrigerated">Рефрижератор</option>
                <option value="flatbed">Бортовой</option>
                <option value="isothermal">Изотерм</option>
              </select>
            </div>

            {/* Keyword search */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Поиск по грузу</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Фрукты, стройматериалы..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>Найдено подходящих грузов: <strong className="text-slate-900">{filteredCargos.length}</strong></span>
          <span className="text-emerald-700 font-bold flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Расчет Match % выполнен под ваш автопарк</span>
          </span>
        </div>

        {/* CARGOS GRID (Section 10 Card Format) */}
        {filteredCargos.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">По вашему запросу ничего не найдено</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Попробуйте изменить фильтры города или увеличить порог грузоподъемности.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCargos.map((cargo) => {
              const matchResult = calculateMatchScore(cargo, activeCarrierVehicle);

              return (
                <div
                  key={cargo.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {cargo.cargoNumber}
                      </span>

                      {/* Match Score Badge (Section 10: Match 94%) */}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                          matchResult.isCompatible
                            ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {matchResult.isCompatible ? `Match ${matchResult.score}%` : 'Не подходит'}
                      </span>
                    </div>

                    {/* Route */}
                    <div>
                      <div className="text-lg font-black text-slate-900 flex items-center space-x-2">
                        <span>{cargo.originCity}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{cargo.destinationCity}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">{cargo.title}</p>
                    </div>

                    {/* Specs Box: Section 10 (28 августа, 2.5 тонны, 12 м³, Продукты питания, Тент/фургон) */}
                    <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Дата загрузки:</span>
                        <span className="font-bold text-slate-900">{cargo.pickupDate} ({cargo.pickupTimeWindow || 'утро'})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Вес и объём:</span>
                        <span className="font-bold text-slate-900">{formatWeight(cargo.weightTons)} · {formatVolume(cargo.volumeM3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Тип груза:</span>
                        <span className="font-bold text-slate-900">{CARGO_TYPE_LABELS[cargo.cargoType]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Кузов:</span>
                        <span className="font-bold text-emerald-700">
                          {cargo.requiredBodyTypes.map((t) => BODY_TYPE_LABELS[t]).join(' / ')}
                        </span>
                      </div>
                    </div>

                    {/* Match Reasons snippet */}
                    {matchResult.isCompatible && (
                      <div className="space-y-1 text-[11px] text-emerald-800">
                        {matchResult.reasons.slice(0, 2).map((r, i) => (
                          <div key={i} className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="truncate">{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Action Button (Section 10 requirement: 15 000 сом [Предложить цену]) */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Бюджет заявки</span>
                      <div className="text-lg font-black text-slate-900">{formatPrice(cargo.suggestedPrice)}</div>
                    </div>

                    <button
                      onClick={() => handleOpenBidModal(cargo)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition transform active:scale-95 cursor-pointer"
                    >
                      Предложить цену
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MAKE OFFER MODAL */}
        {biddingCargo && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setBiddingCargo(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Предложение перевозчика
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {biddingCargo.originCity} → {biddingCargo.destinationCity}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Груз: {biddingCargo.title} ({formatWeight(biddingCargo.weightTons)}, {formatVolume(biddingCargo.volumeM3)})
                </p>
              </div>

              <form onSubmit={handleSubmitOffer} className="space-y-4">
                {/* Vehicle Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Выберите автомобиль из вашего парка
                  </label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.make} {v.model} ({v.capacityTons} т · {v.volumeM3} м³ · {BODY_TYPE_LABELS[v.bodyType]})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Offer Price (Section 6: Предлагаемая цена 15 000 сом) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ваша цена перевозки (сом)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xl font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>Бюджет клиента: {formatPrice(biddingCargo.suggestedPrice)}</span>
                    <span className="text-emerald-600 font-semibold">Без скрытых комиссий</span>
                  </div>
                </div>

                {/* Pickup Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Дата подачи</label>
                    <input
                      type="date"
                      value={offerPickupDate}
                      onChange={(e) => setOfferPickupDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Время подачи</label>
                    <input
                      type="time"
                      value={offerPickupTime}
                      onChange={(e) => setOfferPickupTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                      required
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Комментарий для грузовладельца
                  </label>
                  <textarea
                    rows={2}
                    value={offerComment}
                    onChange={(e) => setOfferComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg transition active:scale-98"
                  >
                    Отправить предложение ({formatPrice(offeredPrice)})
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SUCCESS CONFIRMATION MODAL */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Предложение отправлено!</h3>
              <p className="text-xs text-slate-600">
                Грузовладелец получил вашу ставку. Как только он подтвердит выбор, мы пришлем уведомление и откроем прямой контакт.
              </p>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
