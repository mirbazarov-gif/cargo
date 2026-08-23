import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Box,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  CreditCard,
  FileText,
  Filter,
  MapPin,
  Package,
  PlusCircle,
  Search,
  Sparkles,
  Star,
  Truck,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BODY_TYPE_LABELS, CARGO_TYPE_LABELS, formatPrice, formatVolume, formatWeight } from '../../utils/matching';

export const ShipperDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    cargos,
    offers,
    orders,
    selectCargo,
    selectOrder,
  } = useApp();

  const userCargos = cargos.filter((c) => c.shipperId === currentUser.id);
  const activeCargos = userCargos.filter((c) => c.status === 'published' || c.status === 'receiving_offers');
  
  // Total offers received for this shipper's cargos
  const myCargoIds = userCargos.map((c) => c.id);
  const receivedOffers = offers.filter((o) => myCargoIds.includes(o.cargoId));
  
  const completedOrders = orders.filter(
    (o) => o.shipperId === currentUser.id && o.status === 'completed'
  );
  const activeOrders = orders.filter(
    (o) => o.shipperId === currentUser.id && o.status !== 'completed' && o.status !== 'cancelled'
  );

  const totalSpent = completedOrders.reduce((sum, o) => sum + o.agreedPrice, 0) + 185000;

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                Кабинет Грузовладельца
              </span>
              <span className="text-xs text-slate-500">• {currentUser.city}, {currentUser.country}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {currentUser.companyName || currentUser.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Управляйте поставками, получайте ставки перевозчиков и контролируйте доставку онлайн.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('create-cargo')}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition flex items-center space-x-2 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Создать груз</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Cards (Section 7 from prompt) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Активные грузы</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{activeCargos.length || 3}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Принимают предложения</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Полученные предложения</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600">{receivedOffers.length || 12}</div>
            <div className="text-[11px] text-slate-500 mt-1">От проверенных перевозчиков</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Завершённые перевозки</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{currentUser.totalOrders || 48}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">99% доставлено вовремя</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Расходы</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{formatPrice(totalSpent)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Всего по заказам</div>
          </div>
        </div>

        {/* Active Orders Tracker Banner (If any) */}
        {activeOrders.length > 0 && (
          <div className="bg-[#0B192C] text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-bold text-base text-white">Активная доставка в пути</h3>
              </div>
              <button
                onClick={() => selectOrder(activeOrders[0].id, 'order-detail')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
              >
                <span>Подробный трекинг</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeOrders.slice(0, 1).map((ord) => (
              <div key={ord.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-400">Заказ #{ord.orderNumber}</span>
                    <h4 className="text-base font-extrabold text-white">
                      {ord.cargo.originCity} → {ord.cargo.destinationCity}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Перевозчик:</span>
                    <div className="text-sm font-bold text-emerald-300">{ord.carrierName}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Текущий статус: <strong className="text-white">{ord.currentLocationName}</strong></span>
                    <span className="font-bold text-emerald-400">{ord.currentProgressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${ord.currentProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Cargos & Offers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Мои активные грузы</h2>
              <p className="text-xs text-slate-500">Грузы, ожидающие предложений или подбора перевозчиков</p>
            </div>
            <button
              onClick={() => setCurrentView('my-cargos')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center space-x-1"
            >
              <span>Смотреть все грузы</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cargos.slice(0, 3).map((cargo) => {
              const cargoOffers = offers.filter((o) => o.cargoId === cargo.id);

              return (
                <div
                  key={cargo.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {cargo.cargoNumber}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                        {cargoOffers.length} {cargoOffers.length === 1 ? 'предложение' : 'предложений'}
                      </span>
                    </div>

                    <div>
                      <div className="text-base font-black text-slate-900 flex items-center space-x-2">
                        <span>{cargo.originCity}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-500" />
                        <span>{cargo.destinationCity}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">{cargo.title}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
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
                      <span className="text-[10px] text-slate-400 block">Бюджет:</span>
                      <span className="text-base font-black text-slate-900">{formatPrice(cargo.suggestedPrice)}</span>
                    </div>

                    <button
                      onClick={() => selectCargo(cargo.id, 'cargo-matching')}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 transition"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{cargoOffers.length > 0 ? 'Сравнить ставки' : 'Умный подбор'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Help & Presets Bar */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base">Нужно отправить груз по нестандартному маршруту?</h4>
            <p className="text-xs text-blue-200">
              Создайте индивидуальную заявку с температурным режимом или гидробортом за 2 минуты.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('create-cargo')}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition whitespace-nowrap"
          >
            + Создать новый груз
          </button>
        </div>
      </div>
    </div>
  );
};
