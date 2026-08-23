import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Coins,
  FileUp,
  Flame,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Package,
  Plus,
  Shield,
  Sparkles,
  Thermometer,
  Truck,
  Upload,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES, COUNTRIES, calculateDistance } from '../../data/geo';
import { BodyType, CargoType, PackageType } from '../../types';
import { BODY_TYPE_LABELS, CARGO_TYPE_LABELS, PACKAGE_TYPE_LABELS } from '../../utils/matching';

export const CreateCargoWizard: React.FC = () => {
  const { createCargo, selectCargo, setCurrentView } = useApp();

  // Form State
  const [originCountry, setOriginCountry] = useState('Кыргызстан');
  const [originCity, setOriginCity] = useState('Бишкек');
  const [originAddress, setOriginAddress] = useState('ул. Льва Толстого, 210');
  
  const [destinationCountry, setDestinationCountry] = useState('Кыргызстан');
  const [destinationCity, setDestinationCity] = useState('Ош');
  const [destinationAddress, setDestinationAddress] = useState('ул. Курманжан Датка, 150');

  const [pickupDate, setPickupDate] = useState('2026-08-28');
  const [pickupTimeWindow, setPickupTimeWindow] = useState('09:00 - 12:00');
  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState('2026-08-29');

  const [cargoType, setCargoType] = useState<CargoType>('food');
  const [title, setTitle] = useState('Продукты питания и напитки в коробках');
  const [description, setDescription] = useState('Груз упакован на поддонах, стрейч-пленка. Погрузка вилочным погрузчиком.');
  const [weightTons, setWeightTons] = useState<number>(2.5);
  const [volumeM3, setVolumeM3] = useState<number>(14);
  const [packagesCount, setPackagesCount] = useState<number>(120);
  const [packageType, setPackageType] = useState<PackageType>('pallets');

  const [requiredBodyTypes, setRequiredBodyTypes] = useState<BodyType[]>(['tent', 'box']);
  const [requiresTailLift, setRequiresTailLift] = useState<boolean>(true);
  const [isTemperatureControlled, setIsTemperatureControlled] = useState<boolean>(false);
  const [tempMin, setTempMin] = useState<number>(2);
  const [tempMax, setTempMax] = useState<number>(8);
  const [isFragile, setIsFragile] = useState<boolean>(false);
  const [isAdr, setIsAdr] = useState<boolean>(false);

  const [suggestedPrice, setSuggestedPrice] = useState<number>(15000);
  const [paymentTerms, setPaymentTerms] = useState<'on_delivery' | 'prepaid_50' | 'postpaid_bank'>('on_delivery');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculated distance & time
  const routeMeta = calculateDistance(originCity, destinationCity);

  const handleBodyTypeToggle = (type: BodyType) => {
    if (requiredBodyTypes.includes(type)) {
      if (requiredBodyTypes.length > 1) {
        setRequiredBodyTypes(requiredBodyTypes.filter((t) => t !== type));
      }
    } else {
      setRequiredBodyTypes([...requiredBodyTypes, type]);
    }
  };

  // Quick Preset Handlers
  const applyPreset = (preset: 'food_osh' | 'building_naryn' | 'apparel_almaty') => {
    if (preset === 'food_osh') {
      setOriginCity('Бишкек');
      setOriginAddress('ул. Льва Толстого, 210');
      setDestinationCity('Ош');
      setDestinationAddress('Оптовый рынок «Амир-Темур»');
      setCargoType('food');
      setTitle('Кондитерские изделия и бакалея');
      setWeightTons(2.5);
      setVolumeM3(14);
      setPackagesCount(120);
      setPackageType('pallets');
      setRequiredBodyTypes(['tent', 'box', 'isothermal']);
      setRequiresTailLift(true);
      setSuggestedPrice(15000);
    } else if (preset === 'building_naryn') {
      setOriginCity('Бишкек');
      setOriginAddress('ул. Чолпон-Атинская, 1 (База стройматериалов)');
      setDestinationCity('Нарын');
      setDestinationAddress('ул. Ленина, 45');
      setCargoType('building_materials');
      setTitle('Сухие смеси, кафель и цемент в мешках');
      setWeightTons(8.0);
      setVolumeM3(16);
      setPackagesCount(320);
      setPackageType('bags');
      setRequiredBodyTypes(['tent', 'flatbed']);
      setRequiresTailLift(false);
      setSuggestedPrice(16500);
    } else if (preset === 'apparel_almaty') {
      setOriginCity('Бишкек');
      setOriginAddress('Рынок «Дордой», проход 12');
      setDestinationCountry('Казахстан');
      setDestinationCity('Алматы');
      setDestinationAddress('ТЛЦ Алматы, пр. Райымбека');
      setCargoType('clothing');
      setTitle('Швейная продукция и трикотаж (экспорт)');
      setWeightTons(4.0);
      setVolumeM3(22);
      setPackagesCount(180);
      setPackageType('boxes');
      setRequiredBodyTypes(['box', 'tent']);
      setRequiresTailLift(false);
      setSuggestedPrice(22000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const created = createCargo({
      originCountry,
      originCity,
      originAddress,
      destinationCountry,
      destinationCity,
      destinationAddress,
      pickupDate,
      pickupTimeWindow,
      desiredDeliveryDate,
      cargoType,
      title,
      description,
      weightTons,
      volumeM3,
      packagesCount,
      packageType,
      requiredBodyTypes,
      requiresTailLift,
      isTemperatureControlled,
      tempMin: isTemperatureControlled ? tempMin : undefined,
      tempMax: isTemperatureControlled ? tempMax : undefined,
      isFragile,
      isAdr,
      suggestedPrice,
      paymentTerms,
      photos: uploadedPhotos,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      selectCargo(created.id, 'cargo-matching');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header & Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('shipper-dashboard')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад в кабинет</span>
          </button>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Время заполнения: ~2-3 мин</span>
          </div>
        </div>

        {/* Title and Fast Presets */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Размещение нового груза
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Создать груз и получить предложения
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Укажите параметры маршрута и груза. Система моментально найдёт подходящих свободных перевозчиков.
            </p>
          </div>

          {/* Fast Preset Chips */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block mb-2">Быстрый шаблон (1 клик):</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('food_osh')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-medium text-slate-700 border border-slate-200 transition"
              >
                🍎 Продукты Бишкек → Ош (2.5 т)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('building_naryn')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-medium text-slate-700 border border-slate-200 transition"
              >
                🏗️ Стройматериалы Бишкек → Нарын (8.0 т)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('apparel_almaty')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-medium text-slate-700 border border-slate-200 transition"
              >
                👕 Текстиль Бишкек → Алматы (4.0 т)
              </button>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: ROUTE (Откуда / Куда) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-lg pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span>Маршрут перевозки</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 uppercase">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Откуда (Пункт загрузки)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Город</label>
                  <select
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Адрес загрузки / Склад</label>
                  <input
                    type="text"
                    value={originAddress}
                    onChange={(e) => setOriginAddress(e.target.value)}
                    placeholder="Например: ул. Льва Толстого, склад 4"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 uppercase">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Куда (Пункт выгрузки)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Город</label>
                  <select
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Адрес выгрузки</label>
                  <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="Например: ул. Курманжан Датка, 150"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Route Summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between text-slate-600">
              <span className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Ориентировочное расстояние: <strong>{routeMeta.km} км</strong> (~{routeMeta.hours} ч)</span>
              </span>
              <span className="text-emerald-700 font-semibold">Прямой магистральный маршрут</span>
            </div>
          </div>

          {/* STEP 2: DATES (Даты подачи и доставки) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-lg pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span>Даты и график доставки</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Дата загрузки</label>
                <div className="relative">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Время загрузки</label>
                <input
                  type="text"
                  value={pickupTimeWindow}
                  onChange={(e) => setPickupTimeWindow(e.target.value)}
                  placeholder="09:00 - 12:00"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Желаемая дата доставки</label>
                <input
                  type="date"
                  value={desiredDeliveryDate}
                  onChange={(e) => setDesiredDeliveryDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* STEP 3: CARGO SPECS (Параметры груза) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-lg pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span>Информация о грузе</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Тип груза</label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value as CargoType)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {Object.entries(CARGO_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Наименование груза</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Продукты питания в коробках"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Вес (тонн)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="40"
                  value={weightTons}
                  onChange={(e) => setWeightTons(parseFloat(e.target.value) || 1)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Объём (м³)</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="120"
                  value={volumeM3}
                  onChange={(e) => setVolumeM3(parseFloat(e.target.value) || 1)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Кол-во мест</label>
                <input
                  type="number"
                  min="1"
                  value={packagesCount}
                  onChange={(e) => setPackagesCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Тип упаковки</label>
                <select
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value as PackageType)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {Object.entries(PACKAGE_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Описание и комментарии к погрузке</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Особенности погрузки, время работы склада, наличие рампы..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* STEP 4: VEHICLE REQUIREMENTS (Требования к машине) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-lg pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <span>Требования к автомобилю</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Допустимые типы кузова (выберите один или несколько):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['tent', 'box', 'refrigerated', 'flatbed', 'isothermal', 'container'] as BodyType[]).map((type) => {
                  const isSelected = requiredBodyTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleBodyTypeToggle(type)}
                      className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{BODY_TYPE_LABELS[type]}</span>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional requirements checkboxes */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={requiresTailLift}
                  onChange={(e) => setRequiresTailLift(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">Гидроборт (лопата)</span>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={isFragile}
                  onChange={(e) => setIsFragile(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">Хрупкий груз</span>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={isAdr}
                  onChange={(e) => setIsAdr(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">Опасный груз (ADR)</span>
              </label>
            </div>

            {/* Temperature control option */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTemperatureControlled}
                  onChange={(e) => setIsTemperatureControlled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                  <Thermometer className="w-4 h-4 text-amber-700" />
                  <span>Требуется соблюдение температурного режима</span>
                </div>
              </label>

              {isTemperatureControlled && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Мин. температура (°C)</label>
                    <input
                      type="number"
                      value={tempMin}
                      onChange={(e) => setTempMin(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Макс. температура (°C)</label>
                    <input
                      type="number"
                      value={tempMax}
                      onChange={(e) => setTempMax(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 5: BUDGET & SUBMIT */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-lg pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <span>Бюджет и условия оплаты</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Желаемая / ориентировочная стоимость (сом)
                </label>
                <input
                  type="number"
                  step="500"
                  value={suggestedPrice}
                  onChange={(e) => setSuggestedPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-lg font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Перевозчики смогут предлагать встречные цены или согласиться с вашей ставкой.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Форма оплаты</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="on_delivery">Оплата при доставке (по факту)</option>
                  <option value="prepaid_50">50% аванс / 50% при выгрузке</option>
                  <option value="postpaid_bank">Безналичный расчет (по договору)</option>
                </select>
              </div>
            </div>

            {/* Photo upload snippet */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Фотографии груза (опционально)
              </label>
              <div className="flex items-center space-x-3">
                {uploadedPhotos.map((url, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                    <img src={url} alt="Cargo photo" className="w-full h-full object-cover" />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setUploadedPhotos([
                      ...uploadedPhotos,
                      'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&auto=format&fit=crop&q=80',
                    ])
                  }
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 transition"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[9px] font-semibold mt-0.5">Добавить</span>
                </button>
              </div>
            </div>

            {/* Big Submit Button (Section 4 requirement: 'Получить предложения') */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-3 transition transform active:scale-98 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Подбираем перевозчиков...</span>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Получить предложения</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-500 mt-2">
                Заявка сразу станет доступна проверенным перевозчикам в системе.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
