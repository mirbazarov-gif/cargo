import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Coins,
  FileCheck,
  Filter,
  Layers,
  Lock,
  Package,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/matching';

export const AdminDashboard: React.FC = () => {
  const { users, verifyUser, cargos, orders, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'verifications' | 'cargos' | 'disputes' | 'revenue'>('verifications');

  const pendingVerificationUsers = users.filter((u) => !u.isVerified);
  const totalGMV = orders.reduce((sum, o) => sum + o.agreedPrice, 0) + 1280000;
  const platformRevenue = Math.round(totalGMV * 0.05);

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                Административная панель
              </span>
              <span className="text-xs text-slate-400">• Главный модератор</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">CargoMatch Admin HQ</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Контроль верификации перевозчиков, арбитраж споров, мониторинг транзакций и комиссий
            </p>
          </div>

          <div className="bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Выручка платформы (5%)</span>
            <span className="text-xl font-black text-emerald-400">{formatPrice(platformRevenue)}</span>
          </div>
        </div>

        {/* Top 4 Admin KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
              <span>Всего пользователей</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{users.length + 182}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">+14 за сегодня</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
              <span>На верификации</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{pendingVerificationUsers.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Ожидают проверки документов</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
              <span>Активных заказов</span>
              <Truck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{orders.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">В пути по трассам КР</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
              <span>Оборот сделок (GMV)</span>
              <Coins className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{formatPrice(totalGMV)}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% безопасная сделка</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 text-xs sm:text-sm font-bold space-x-2">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'verifications'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Очередь верификации ({pendingVerificationUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('cargos')}
            className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'cargos'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Модерация грузов ({cargos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'disputes'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Арбитраж и споры (0)</span>
          </button>
        </div>

        {/* Verification Queue (Section 16 & 26) */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">
              Пользователи, ожидающие проверки документов
            </h3>

            {pendingVerificationUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Все заявки на верификацию обработаны!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingVerificationUsers.map((u) => (
                  <div key={u.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                        <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-900">{u.companyName || u.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                            {u.role === 'carrier' ? 'Перевозчик' : 'Грузовладелец'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {u.city}, {u.country} • Телефон: {u.phone} • {u.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => verifyUser(u.id, true)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition active:scale-95 flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Одобрить и выдать значок</span>
                      </button>
                      <button
                        onClick={() => verifyUser(u.id, false)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition"
                      >
                        Отклонить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cargo Moderation */}
        {activeTab === 'cargos' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Модерация опубликованных грузов</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {cargos.map((c) => (
                <div key={c.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-500">{c.cargoNumber}</span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">
                      {c.originCity} → {c.destinationCity} ({c.title})
                    </h4>
                    <p className="text-slate-500">{c.weightTons} т · {c.volumeM3} м³ • Бюджет: {formatPrice(c.suggestedPrice)}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    Одобрен
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disputes */}
        {activeTab === 'disputes' && (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-extrabold text-base text-slate-900">Нет открытых споров</h3>
            <p className="text-xs text-slate-500">Все рейсы и расчеты проходят в штатном режиме.</p>
          </div>
        )}
      </div>
    </div>
  );
};
