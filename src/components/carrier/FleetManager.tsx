import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Layers,
  MapPin,
  PlusCircle,
  Shield,
  Thermometer,
  Truck,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BodyType, Vehicle, VehicleStatus } from '../../types';
import { BODY_TYPE_LABELS, formatVolume, formatWeight } from '../../utils/matching';

export const FleetManager: React.FC = () => {
  const { vehicles, addVehicle, updateVehicleStatus, currentUser, setCurrentView } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Add Vehicle Form State
  const [make, setMake] = useState('Mercedes-Benz');
  const [model, setModel] = useState('Atego 1224');
  const [year, setYear] = useState<number>(2021);
  const [plateNumberMasked, setPlateNumberMasked] = useState('01 KG ••• 777');
  const [bodyType, setBodyType] = useState<BodyType>('tent');
  const [capacityTons, setCapacityTons] = useState<number>(5.0);
  const [volumeM3, setVolumeM3] = useState<number>(36);
  const [lengthM, setLengthM] = useState<number>(6.5);
  const [widthM, setWidthM] = useState<number>(2.45);
  const [heightM, setHeightM] = useState<number>(2.5);
  const [palletCapacity, setPalletCapacity] = useState<number>(16);
  const [hasTailLift, setHasTailLift] = useState<boolean>(true);
  const [isTemperatureControlled, setIsTemperatureControlled] = useState<boolean>(false);
  const [tempMin, setTempMin] = useState<number>(-18);
  const [tempMax, setTempMax] = useState<number>(15);
  const [isAdr, setIsAdr] = useState<boolean>(false);
  const [status, setStatus] = useState<VehicleStatus>('available');
  const [currentCity, setCurrentCity] = useState('Бишкек');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle({
      make,
      model,
      year,
      plateNumberMasked,
      bodyType,
      capacityTons,
      volumeM3,
      lengthM,
      widthM,
      heightM,
      palletCapacity,
      hasTailLift,
      isTemperatureControlled,
      tempMin: isTemperatureControlled ? tempMin : undefined,
      tempMax: isTemperatureControlled ? tempMax : undefined,
      isAdr,
      status,
      currentCity,
      photoUrl,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Управление автопарком
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Мои автомобили
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Добавляйте грузовики, контролируйте статус готовности и настраивайте габариты кузова
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition flex items-center space-x-2 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ Добавить автомобиль</span>
          </button>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((veh) => (
            <div
              key={veh.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              {/* Photo & Status Badge */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img src={veh.photoUrl} alt={veh.model} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-lg">
                  {veh.plateNumberMasked}
                </div>

                {/* Section 9 Status: 🟢 Доступен, 🟡 Скоро свободен, 🔴 Занят */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      veh.status === 'available'
                        ? 'bg-emerald-500 text-slate-950'
                        : veh.status === 'soon_available'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    <span>
                      {veh.status === 'available'
                        ? '🟢 Доступен'
                        : veh.status === 'soon_available'
                        ? '🟡 Скоро свободен'
                        : '🔴 Занят'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Body details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {veh.make} {veh.model} ({veh.year})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Кузов: <strong className="text-slate-800">{BODY_TYPE_LABELS[veh.bodyType]}</strong> • Локация: {veh.currentCity}
                  </p>
                </div>

                {/* Dimension specs */}
                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Грузоподъёмность</span>
                    <span className="font-bold text-slate-900">{veh.capacityTons} т</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Объём</span>
                    <span className="font-bold text-slate-900">{veh.volumeM3} м³</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Паллеты</span>
                    <span className="font-bold text-slate-900">{veh.palletCapacity} шт</span>
                  </div>
                </div>

                {/* Extra equipment tags */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {veh.hasTailLift && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold">
                      ✓ Гидроборт
                    </span>
                  )}
                  {veh.isTemperatureControlled && (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md font-semibold">
                      ✓ Реф ({veh.tempMin}°C..{veh.tempMax}°C)
                    </span>
                  )}
                  {veh.isAdr && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md font-semibold">
                      ✓ ADR
                    </span>
                  )}
                </div>

                {/* Status Toggle buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">Статус:</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => updateVehicleStatus(veh.id, 'available')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                        veh.status === 'available'
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Свободен
                    </button>
                    <button
                      onClick={() => updateVehicleStatus(veh.id, 'soon_available')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                        veh.status === 'soon_available'
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Скоро
                    </button>
                    <button
                      onClick={() => updateVehicleStatus(veh.id, 'busy')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                        veh.status === 'busy'
                          ? 'bg-rose-500 text-white font-black'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      В рейсе
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADD VEHICLE MODAL (Section 9 Fields) */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Добавление транспорта
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Новый автомобиль в автопарк</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Укажите точные габариты и грузоподъёмность для точного подбора подходящих грузов
                </p>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Марка</label>
                    <input
                      type="text"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      placeholder="Mercedes-Benz, MAN, DAF..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Модель</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Atego, XF, Sprinter..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Год выпуска</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value) || 2020)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Тип кузова</label>
                    <select
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value as BodyType)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      {Object.entries(BODY_TYPE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Грузоподъёмность (т)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={capacityTons}
                      onChange={(e) => setCapacityTons(parseFloat(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Объём кузова (м³)</label>
                    <input
                      type="number"
                      value={volumeM3}
                      onChange={(e) => setVolumeM3(parseFloat(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                      required
                    />
                  </div>
                </div>

                {/* Dimensions (length, width, height, pallets) */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Длина (м)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lengthM}
                      onChange={(e) => setLengthM(parseFloat(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Ширина (м)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={widthM}
                      onChange={(e) => setWidthM(parseFloat(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Высота (м)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={heightM}
                      onChange={(e) => setHeightM(parseFloat(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Паллет (евро)</label>
                    <input
                      type="number"
                      value={palletCapacity}
                      onChange={(e) => setPalletCapacity(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Checkboxes for features */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <input
                      type="checkbox"
                      checked={hasTailLift}
                      onChange={(e) => setHasTailLift(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Гидроборт</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <input
                      type="checkbox"
                      checked={isTemperatureControlled}
                      onChange={(e) => setIsTemperatureControlled(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Рефрижератор</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <input
                      type="checkbox"
                      checked={isAdr}
                      onChange={(e) => setIsAdr(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>ADR допуск</span>
                  </label>
                </div>

                {/* Section 9: Госномер маскирован */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Государственный номер (будет скрыт публично)
                    </label>
                    <input
                      type="text"
                      value={plateNumberMasked}
                      onChange={(e) => setPlateNumberMasked(e.target.value)}
                      placeholder="01 KG 777 ABC"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Город базирования</label>
                    <input
                      type="text"
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition active:scale-98"
                  >
                    Сохранить автомобиль
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
