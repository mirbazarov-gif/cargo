import React from 'react';
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Shield,
  ShieldCheck,
  Star,
  Truck,
  User,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BODY_TYPE_LABELS, formatVolume, formatWeight } from '../../utils/matching';

export const CarrierProfileView: React.FC = () => {
  const { viewedCarrierId, users, vehicles, reviews, setCurrentView, currentRole } = useApp();

  const carrier = users.find((u) => u.id === viewedCarrierId) || users.find((u) => u.role === 'carrier') || users[1];
  const carrierVehicles = vehicles.filter((v) => v.carrierId === carrier.id);
  const carrierReviews = reviews.filter((r) => r.targetUserId === carrier.id);

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back */}
        <button
          onClick={() => {
            if (currentRole === 'shipper') {
              setCurrentView('cargo-matching');
            } else {
              setCurrentView('carrier-dashboard');
            }
          }}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        {/* Profile Card (Section 15 Requirements) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start space-x-5">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 overflow-hidden border-2 border-emerald-500 shadow-md flex-shrink-0">
                <img src={carrier.avatarUrl} alt={carrier.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{carrier.companyName || carrier.name}</h1>
                  {carrier.isVerified && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>✓ Проверенный перевозчик</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  {carrier.name} • {carrier.city}, {carrier.country}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  <span className="text-amber-500 font-black flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded">
                    <span>★ {carrier.rating}</span>
                    <span className="text-slate-500 font-normal">({carrierReviews.length || 48} отзывов)</span>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="font-semibold text-slate-700">
                    {carrier.completedOrdersCount || 214} завершённых перевозок
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500">На CargoMatch с {carrier.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Trust & Safety Score Box */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-right min-w-[170px]">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                Рейтинг доверия
              </span>
              <div className="text-3xl font-black text-white mt-0.5">
                {carrier.trustScore || 98}<span className="text-slate-400 text-sm">/100</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                Документы проверены
              </span>
            </div>
          </div>

          {/* Verification documents check badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800">Паспорт и права</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800">Техпаспорт ТС</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800">Справка ГНС (ИНН)</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800">Страхование ОСАГО</span>
            </div>
          </div>
        </div>

        {/* Vehicles of this carrier */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">
              Автопарк перевозчика ({carrierVehicles.length})
            </h3>
            <span className="text-xs text-slate-500">
              Госномера скрыты в целях безопасности
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {carrierVehicles.map((veh) => (
              <div
                key={veh.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center space-x-4"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                  <img src={veh.photoUrl} alt={veh.model} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-slate-900">
                      {veh.make} {veh.model}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {veh.status === 'available' ? 'Свободен' : 'В рейсе'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {veh.capacityTons} тонн · {veh.volumeM3} м³ · {BODY_TYPE_LABELS[veh.bodyType]}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {veh.plateNumberMasked} • Локация: {veh.currentCity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section (Section 15 & 17) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Отзывы грузовладельцев</h3>
              <p className="text-xs text-slate-500">Только реальные отзывы после подтвержденных доставок</p>
            </div>
            <div className="flex items-center space-x-1 text-amber-500 font-black text-base">
              <span>★ {carrier.rating}</span>
            </div>
          </div>

          <div className="space-y-4">
            {carrierReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-slate-900">{rev.authorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                      {rev.authorRole === 'shipper' ? 'Грузовладелец' : 'Перевозчик'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs">
                    <span>{'★'.repeat(rev.overallRating)}</span>
                    <span className="text-slate-400 text-[10px]">({rev.createdAt})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">«{rev.comment}»</p>

                {rev.criteria && (
                  <div className="pt-2 flex flex-wrap gap-3 text-[11px] text-slate-500 border-t border-slate-200/60">
                    <span>Своевременность: <strong>{rev.criteria.timeliness}/5</strong></span>
                    <span>Состояние авто: <strong>{rev.criteria.vehicleState}/5</strong></span>
                    <span>Надёжность: <strong>{rev.criteria.reliability}/5</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
