import React from 'react';
import {
  ArrowLeft,
  Award,
  Building,
  CheckCircle2,
  FileCheck,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShipperProfileView: React.FC = () => {
  const { viewedShipperId, users, cargos, orders, reviews, setCurrentView, currentRole } = useApp();

  const shipper = users.find((u) => u.id === viewedShipperId) || users.find((u) => u.role === 'shipper') || users[0];
  const shipperCargos = cargos.filter((c) => c.shipperId === shipper.id);
  const shipperReviews = reviews.filter((r) => r.targetUserId === shipper.id);

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back */}
        <button
          onClick={() => {
            if (currentRole === 'carrier') {
              setCurrentView('find-cargo');
            } else {
              setCurrentView('shipper-dashboard');
            }
          }}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start space-x-5">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 overflow-hidden border-2 border-blue-500 shadow-md flex-shrink-0 flex items-center justify-center text-blue-600">
                <Building className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{shipper.companyName || shipper.name}</h1>
                  {shipper.isVerified && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>✓ Проверенная компания</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  {shipper.city}, {shipper.country} • Контактное лицо: {shipper.name}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  <span className="text-amber-500 font-black flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded">
                    <span>★ {shipper.rating}</span>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="font-semibold text-slate-700">
                    {shipper.totalOrders || 48} оформленных заказов
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500">На CargoMatch с {shipper.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-right min-w-[170px]">
              <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider">
                Платёжная надёжность
              </span>
              <div className="text-3xl font-black text-white mt-0.5">100%</div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                Без задержек оплаты
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Форма оплаты:</span>
              <span className="font-bold text-slate-900">Безналичный расчет / Наличные</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Средняя скорость погрузки:</span>
              <span className="font-bold text-slate-900">45 минут</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">ИНН компании:</span>
              <span className="font-bold text-slate-900">02409202310189</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
