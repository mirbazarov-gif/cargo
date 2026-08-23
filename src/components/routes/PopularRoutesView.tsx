import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Coins,
  Globe2,
  MapPin,
  Package,
  Search,
  Sparkles,
  TrendingUp,
  Truck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { POPULAR_ROUTES, calculateDistance } from '../../data/geo';
import { formatPrice } from '../../utils/matching';

export const PopularRoutesView: React.FC = () => {
  const { setCurrentView, switchRole } = useApp();
  const [filterRegion, setFilterRegion] = useState<'all' | 'kg' | 'international'>('all');

  const filteredRoutes = POPULAR_ROUTES.filter((r) => {
    if (filterRegion === 'kg') return r.toCountry === 'Кыргызстан' && r.fromCountry === 'Кыргызстан';
    if (filterRegion === 'international') return r.toCountry !== 'Кыргызстан' || r.fromCountry !== 'Кыргызстан';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Аналитика и тарифы
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Популярные грузовые маршруты
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Актуальные расстояния, средние рыночные цены и статистика спроса в Кыргызстане и Центральной Азии
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterRegion('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                filterRegion === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Все ({POPULAR_ROUTES.length})
            </button>
            <button
              onClick={() => setFilterRegion('kg')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                filterRegion === 'kg' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Внутри Кыргызстана
            </button>
            <button
              onClick={() => setFilterRegion('international')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                filterRegion === 'international' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Международные (Алматы, Ташкент)
            </button>
          </div>
        </div>

        {/* Table & Cards (Section 21 Requirements) */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <th className="py-4 px-6">Маршрут</th>
                  <th className="py-4 px-4">Расстояние</th>
                  <th className="py-4 px-4">Время в пути</th>
                  <th className="py-4 px-4">Средний тариф (5-10 т)</th>
                  <th className="py-4 px-4">Активные грузы</th>
                  <th className="py-4 px-4">Спрос</th>
                  <th className="py-4 px-6 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRoutes.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                        <span>{r.fromCity}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-500" />
                        <span>{r.toCity}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {r.fromCountry} → {r.toCountry}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-800">
                      {r.distanceKm} км
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      ~{r.avgHours} ч
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900 text-sm">
                      {formatPrice(r.avgPriceKgs)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                        {r.activeCargosCount} заявок
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600">
                      {r.trend}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            switchRole('shipper');
                            setCurrentView('create-cargo');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                        >
                          Отправить груз
                        </button>
                        <button
                          onClick={() => {
                            switchRole('carrier');
                            setCurrentView('find-cargo');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                        >
                          Взять рейс
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
