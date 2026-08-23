import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Package,
  Search,
  Truck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, formatVolume, formatWeight } from '../../utils/matching';

export const OrdersListView: React.FC = () => {
  const { orders, currentUser, currentRole, selectOrder, setCurrentView } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');

  const myOrders = orders.filter((o) => {
    if (currentRole === 'shipper') return o.shipperId === currentUser.id;
    if (currentRole === 'carrier') return o.carrierId === currentUser.id;
    return true;
  });

  const filteredOrders = myOrders.filter((o) => {
    if (filterTab === 'active') return o.status !== 'completed' && o.status !== 'cancelled';
    if (filterTab === 'completed') return o.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Логистические операции
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Заказы и рейсы
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Контролируйте активные рейсы, этапы доставки и закрывающие документы
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filterTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Все ({myOrders.length})
            </button>
            <button
              onClick={() => setFilterTab('active')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filterTab === 'active' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Активные ({myOrders.filter((o) => o.status !== 'completed').length})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filterTab === 'completed' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Завершённые
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Truck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Нет заказов в данной категории</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Разместите груз или предложите цену в поиске, чтобы начать новую перевозку.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((ord) => {
              const isCompleted = ord.status === 'completed';

              return (
                <div
                  key={ord.id}
                  onClick={() => selectOrder(ord.id, 'order-detail')}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          isCompleted
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isCompleted ? '✓ Завершён' : `В пути (${ord.currentProgressPercent}%)`}
                      </span>
                    </div>

                    <div>
                      <div className="text-xl font-black text-slate-900 flex items-center space-x-2">
                        <span>{ord.cargo.originCity}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{ord.cargo.destinationCity}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">{ord.cargo.title}</p>
                    </div>

                    {/* Progress line */}
                    {!isCompleted && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Статус: <strong>{ord.currentLocationName}</strong></span>
                          <span>{ord.currentProgressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${ord.currentProgressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Parties info */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Грузовладелец:</span>
                        <span className="font-bold text-slate-900 truncate block">{ord.shipperName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Перевозчик:</span>
                        <span className="font-bold text-slate-900 truncate block">{ord.carrierName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Сумма заказа</span>
                      <span className="text-lg font-black text-slate-900">{formatPrice(ord.agreedPrice)}</span>
                    </div>

                    <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
                      <span>Открыть карточку</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
