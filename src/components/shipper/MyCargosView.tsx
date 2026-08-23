import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Package,
  PlusCircle,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, formatVolume, formatWeight } from '../../utils/matching';

export const MyCargosView: React.FC = () => {
  const { cargos, offers, selectCargo, setCurrentView, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const myCargos = cargos.filter((c) => c.shipperId === currentUser.id);

  const filteredCargos = myCargos.filter((c) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return c.status === 'published' || c.status === 'receiving_offers';
    if (filterStatus === 'booked') return c.status === 'booked';
    if (filterStatus === 'completed') return c.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Управление отправками
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Мои грузы</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Все размещенные грузы, история предложений и статус выполнения рейсов
            </p>
          </div>

          <button
            onClick={() => setCurrentView('create-cargo')}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition flex items-center space-x-2 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ Создать новый груз</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              filterStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Все ({myCargos.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              filterStatus === 'active' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Активные / Сбор ставок
          </button>
          <button
            onClick={() => setFilterStatus('booked')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              filterStatus === 'booked' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            В работе / Заказан
          </button>
        </div>

        {/* Cargos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCargos.map((cargo) => {
            const cargoOffers = offers.filter((o) => o.cargoId === cargo.id);

            return (
              <div
                key={cargo.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {cargo.cargoNumber}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        cargo.status === 'booked'
                          ? 'bg-amber-100 text-amber-800'
                          : cargo.status === 'completed'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {cargo.status === 'booked'
                        ? 'В пути / Заказ'
                        : cargo.status === 'completed'
                        ? 'Завершён'
                        : `${cargoOffers.length} предложений`}
                    </span>
                  </div>

                  <div>
                    <div className="text-lg font-black text-slate-900 flex items-center space-x-2">
                      <span>{cargo.originCity}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{cargo.destinationCity}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-medium">{cargo.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Вес / Объём:</span>
                      <span className="font-bold text-slate-900">
                        {formatWeight(cargo.weightTons)} · {formatVolume(cargo.volumeM3)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Подача:</span>
                      <span className="font-bold text-slate-900">{cargo.pickupDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Бюджет</span>
                    <span className="text-base font-black text-slate-900">{formatPrice(cargo.suggestedPrice)}</span>
                  </div>

                  <button
                    onClick={() => selectCargo(cargo.id, 'cargo-matching')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Предложения ({cargoOffers.length})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
