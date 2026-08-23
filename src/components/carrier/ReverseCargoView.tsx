import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Coins,
  Flame,
  HelpCircle,
  Layers,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  Truck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, formatVolume, formatWeight } from '../../utils/matching';
import { Cargo } from '../../types';

export const ReverseCargoView: React.FC = () => {
  const { cargos, createOffer, vehicles, currentUser, setCurrentView, selectOrder } = useApp();

  const [currentCityArrival, setCurrentCityArrival] = useState<string>('Ош');
  const [targetCityReturn, setTargetCityReturn] = useState<string>('Бишкек');
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [bidSubmitted, setBidSubmitted] = useState<boolean>(false);

  // Return cargos (origin = current arrival city e.g. Osh, destination = Bishkek/Chuy)
  const returnCargos = cargos.filter((c) => {
    const isAvailable = c.status === 'published' || c.status === 'receiving_offers';
    if (!isAvailable) return false;
    return (
      c.originCity.toLowerCase() === currentCityArrival.toLowerCase() &&
      c.destinationCity.toLowerCase() === targetCityReturn.toLowerCase()
    );
  });

  // Calculate estimated fuel saving and extra profit
  const totalReturnProfit = returnCargos.reduce((sum, c) => sum + c.suggestedPrice, 0) || 12000;

  const handleQuickTakeReverseCargo = (cargo: Cargo) => {
    createOffer({
      cargoId: cargo.id,
      vehicleId: vehicles[0]?.id || 'veh-1',
      offeredPrice: cargo.suggestedPrice,
      pickupDate: cargo.pickupDate,
      pickupTime: '10:00',
      deliveryDate: cargo.desiredDeliveryDate,
      comment: 'Обратный рейс из Оша в Бишкек. Машина освобождается утром, готовы загрузиться без задержек.',
    });
    setBidSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back and Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('carrier-dashboard')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад в кабинет</span>
          </button>
        </div>

        {/* Hero Banner (Section 11: Не возвращайтесь пустыми) */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-6 sm:p-10 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Умные обратные рейсы</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
                Не возвращайтесь пустыми.
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-900/90 max-w-2xl">
                Если вы доставили груз по маршруту <strong>Бишкек → Ош</strong>, система CargoMatch мгновенно находит обратные грузы <strong>Ош → Бишкек</strong>, окупая топливо и удваивая чистую прибыль.
              </p>
            </div>

            {/* Profit Estimator Box */}
            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-2xl min-w-[260px]">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Дополнительный доход в обратную сторону:
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-1">+{formatPrice(totalReturnProfit)}</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Экономия на порожнем пробеге: ~605 км
              </p>
            </div>
          </div>
        </div>

        {/* Route Selector for Return Trip */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Параметры обратного маршрута</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Где освобождается машина (Город прибытия):
              </label>
              <select
                value={currentCityArrival}
                onChange={(e) => setCurrentCityArrival(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Ош">Ош (Южный регион)</option>
                <option value="Каракол">Каракол (Иссык-Куль)</option>
                <option value="Нарын">Нарын</option>
                <option value="Талас">Талас</option>
                <option value="Баткен">Баткен</option>
                <option value="Алматы">Алматы (Казахстан)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Куда нужно вернуться (Базовый город):
              </label>
              <select
                value={targetCityReturn}
                onChange={(e) => setTargetCityReturn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Бишкек">Бишкек (Чуйская область)</option>
                <option value="Ош">Ош</option>
                <option value="Алматы">Алматы</option>
              </select>
            </div>
          </div>
        </div>

        {/* Found Reverse Cargos List (Section 11 Example: Ош → Бишкек, 1.8 тонны, 12 000 сом, [Взять обратный груз]) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              Найдены обратные грузы ({returnCargos.length})
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Попутная загрузка
            </span>
          </div>

          {returnCargos.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                На данный момент нет прямых обратных грузов по направлению {currentCityArrival} → {targetCityReturn}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Оставьте машину в статусе «Скоро свободен», чтобы получать персональные уведомления при появлении новых заявок.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {returnCargos.map((cargo) => (
                <div
                  key={cargo.id}
                  className="bg-white rounded-3xl p-6 border-2 border-emerald-500/30 shadow-md hover:shadow-lg transition duration-200 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-bold text-xs">
                      ⚡ ОБРАТНЫЙ ГРУЗ
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      94% Match
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-black text-slate-900 flex items-center space-x-3">
                      <span>{cargo.originCity}</span>
                      <ArrowRight className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span>{cargo.destinationCity}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mt-1">{cargo.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{cargo.description}</p>
                  </div>

                  {/* Specs row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Вес и объём:</span>
                      <span className="font-bold text-slate-900">
                        {formatWeight(cargo.weightTons)} · {formatVolume(cargo.volumeM3)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Дата выезда:</span>
                      <span className="font-bold text-slate-900">{cargo.pickupDate}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-slate-400 block text-[10px]">Условия:</span>
                      <span className="font-bold text-emerald-700">Оплата по прибытию</span>
                    </div>
                  </div>

                  {/* Price and Big Button (Section 11 requirement: Взять обратный груз) */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Ставка грузовладельца</span>
                      <div className="text-2xl font-black text-slate-900">{formatPrice(cargo.suggestedPrice)}</div>
                    </div>

                    <button
                      onClick={() => handleQuickTakeReverseCargo(cargo)}
                      className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-md transition transform active:scale-95 cursor-pointer"
                    >
                      Взять обратный груз
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {bidSubmitted && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Заявка на обратный груз принята!</h3>
              <p className="text-xs text-slate-600">
                Вы предложили выполнение обратного рейса по указанной ставке. Грузовладелец получил оповещение.
              </p>
              <button
                onClick={() => setBidSubmitted(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Отлично
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
