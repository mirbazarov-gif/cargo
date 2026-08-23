import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  FileCheck,
  MapPin,
  Package,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  Truck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateMatchScore, formatPrice, formatVolume, formatWeight } from '../../utils/matching';

export const CarrierDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    cargos,
    vehicles,
    orders,
    selectCargo,
    selectOrder,
  } = useApp();

  const myVehicles = vehicles.filter((v) => v.carrierId === currentUser.id);
  const activeTrips = orders.filter(
    (o) => o.carrierId === currentUser.id && o.status !== 'completed' && o.status !== 'cancelled'
  );

  // Filter available cargos
  const availableCargos = cargos.filter((c) => c.status === 'receiving_offers' || c.status === 'published');

  // Reverse cargos
  const reverseCargos = cargos.filter(
    (c) => c.originCity.toLowerCase() === 'ош' && c.destinationCity.toLowerCase() === 'бишкек'
  );

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Welcome Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Кабинет Перевозчика
              </span>
              <span className="text-xs text-slate-500">• {currentUser.city}, {currentUser.country}</span>
              {currentUser.isVerified && (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Верифицирован</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {currentUser.companyName || currentUser.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Подбирайте прямые и обратные загрузки, отправляйте коммерческие ставки и ведите рейсы онлайн.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('find-cargo')}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition flex items-center space-x-2 active:scale-95"
            >
              <Search className="w-5 h-5" />
              <span>Найти груз</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards (Section 8: Новые грузы: 14, Активные заказы: 2, Доход за месяц: 280 000 сом, Рейтинг: 4.9) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Новые грузы</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">14</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Подходят вашему парку</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Активные заказы</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600">{activeTrips.length || 2}</div>
            <div className="text-[11px] text-slate-500 mt-1">В процессе выполнения</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Доход за месяц</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">280 000 сом</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">+18% к прошлому месяцу</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Рейтинг водителя</span>
              <div className="w-8 h-8 rounded-lg bg-yellow-50 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 flex items-center space-x-1">
              <span>★ 4.9</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">214 завершённых перевозок</div>
          </div>
        </div>

        {/* SECTION 11: REVERSE CARGO HERO BANNER ("Не возвращайтесь пустыми") */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-slate-950 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Умный алгоритм загрузки</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                Не возвращайтесь пустыми! Найдены обратные грузы
              </h2>
              <p className="text-xs sm:text-sm text-slate-900/90 font-medium max-w-2xl">
                Если ваш автомобиль завершает рейс в Оше или Караколе, возьмите обратный груз и заработайте до +15 000 сом без холостого пробега.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('reverse-cargos')}
              className="px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm shadow-xl transition whitespace-nowrap active:scale-95 flex items-center space-x-2"
            >
              <span>Посмотреть обратные грузы ({reverseCargos.length || 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Trips / Ongoing Orders */}
        {activeTrips.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg font-bold text-slate-900">Текущий рейс в процессе</h3>
              </div>
              <button
                onClick={() => selectOrder(activeTrips[0].id, 'order-detail')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center space-x-1"
              >
                <span>Управление заказом и статусом</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {activeTrips.slice(0, 1).map((trip) => (
              <div
                key={trip.id}
                onClick={() => selectOrder(trip.id, 'order-detail')}
                className="bg-slate-50 hover:bg-slate-100/80 p-5 rounded-2xl border border-slate-200 transition cursor-pointer space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-500">#{trip.orderNumber}</span>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {trip.cargo.originCity} → {trip.cargo.destinationCity} ({trip.agreedPrice} сом)
                    </h4>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {trip.currentLocationName}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Грузовладелец: <strong>{trip.shipperName}</strong></span>
                  <span>Автомобиль: <strong>{trip.vehicleName}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section 10: New Matched Cargos Ready for Bidding */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Новые подходящие грузы</h2>
              <p className="text-xs text-slate-500">Система подобрала грузы под параметры ваших машин</p>
            </div>
            <button
              onClick={() => setCurrentView('find-cargo')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center space-x-1"
            >
              <span>Все доступные грузы</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCargos.slice(0, 3).map((cargo) => {
              const myTopVehicle = myVehicles[0] || vehicles[0];
              const match = calculateMatchScore(cargo, myTopVehicle);

              return (
                <div
                  key={cargo.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {cargo.cargoNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-black text-xs border border-emerald-500/20">
                        Match {match.score}%
                      </span>
                    </div>

                    <div>
                      <div className="text-lg font-black text-slate-900 flex items-center space-x-2">
                        <span>{cargo.originCity}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{cargo.destinationCity}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">{cargo.title}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Вес / Объём:</span>
                        <span className="font-bold text-slate-800">
                          {formatWeight(cargo.weightTons)} · {formatVolume(cargo.volumeM3)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Дата подачи:</span>
                        <span className="font-bold text-slate-800">{cargo.pickupDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Ставка грузовладельца</span>
                      <span className="text-base font-black text-slate-900">{formatPrice(cargo.suggestedPrice)}</span>
                    </div>

                    <button
                      onClick={() => {
                        selectCargo(cargo.id, 'find-cargo');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      Предложить цену
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet management snippet */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900">Ваш автопарк: {myVehicles.length} авто</h4>
              <p className="text-xs text-slate-500">
                Добавляйте новые грузовики, обновляйте статус занятости и получайте целевые заявки.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('my-fleet')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Управление автопарком
          </button>
        </div>
      </div>
    </div>
  );
};
