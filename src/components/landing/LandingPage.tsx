import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowRightLeft,
  Award,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck,
  Globe2,
  Lock,
  MapPin,
  Package,
  PlusCircle,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { POPULAR_ROUTES } from '../../data/geo';
import { formatPrice } from '../../utils/matching';

export const LandingPage: React.FC = () => {
  const { switchRole, setCurrentView, selectCargo, selectOrder, cargos } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-16">
      {/* 1. BENTO HERO SECTION (Grid of Modular Bento Tiles) */}
      <section className="pt-8 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          
          {/* Bento Tile 1: Primary Hero (Span 12 on mobile, 8 on lg) */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-bl-full pointer-events-none" />

            <div>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>B2B Логистическая платформа Центральной Азии</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Перевозка груза <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600">
                  стала проще и быстрее
                </span>
              </h1>

              {/* Slogan */}
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 max-w-2xl">
                <p className="text-base sm:text-lg font-black text-emerald-950">
                  «Есть груз? Найдём машину. Есть машина? Найдём груз.»
                </p>
                <p className="text-xs sm:text-sm text-emerald-800/90 mt-1 font-medium">
                  Прямой B2B-контакт между грузовладельцами и проверенными перевозчиками без скрытых комиссий и лишних звонков.
                </p>
              </div>
            </div>

            {/* CTAs & Micro-metrics */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    switchRole('shipper');
                    setCurrentView('create-cargo');
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>Найти транспорт</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    switchRole('carrier');
                    setCurrentView('find-cargo');
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Найти груз</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-600 font-semibold">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Без комиссии</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Безопасная сделка</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Tile 2: Live Smart Match Ticker (Span 12 on mobile, 4 on lg) */}
          <div className="col-span-12 lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between border border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-200">Live Matching</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  96% точность
                </span>
              </div>

              {/* Sample Live Card */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">«Fast Cargo ОсОО»</div>
                      <div className="text-[10px] text-amber-400">★★★★★ 4.9 (214 рейсов)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                    96% Match
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Маршрут:</span>
                    <span className="font-bold text-white">Бишкек → Ош</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Транспорт:</span>
                    <span>Mercedes Atego (5 т / 20 м³)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ставка:</span>
                    <span className="font-black text-emerald-400 text-sm">15 000 сом</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    switchRole('shipper');
                    selectCargo('cargo-1', 'cargo-matching');
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition"
                >
                  Посмотреть предложение
                </button>
              </div>

              {/* Micro recent log */}
              <div className="mt-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Обратный груз: Ош → Бишкек</span>
                </div>
                <span className="font-bold text-emerald-400">12 000 сом</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Свободных машин рядом: <strong className="text-white">18</strong></span>
              <button
                onClick={() => {
                  switchRole('carrier');
                  setCurrentView('reverse-cargos');
                }}
                className="text-amber-400 hover:text-amber-300 font-bold"
              >
                Все обратные →
              </button>
            </div>
          </div>

          {/* Bento Tile 3: Role - Shipper (Span 12 on mobile, 4 on lg) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-slate-400 transition group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-slate-900 group-hover:text-white transition">
                <Package className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-1 rounded-md bg-blue-100/80 text-blue-800 font-bold text-[10px] uppercase tracking-wider mb-2">
                Грузовладельцам
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Отправить груз</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Размещайте заявки за 2 минуты. Получайте реальные ставки от перевозчиков, сравнивайте рейтинг и отслеживайте груз онлайн.
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Отклики подходящих машин за 15 минут</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Электронные ТТН и фотофиксация пломб</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Прозрачный выбор цены и рейтинга</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  switchRole('shipper');
                  setCurrentView('create-cargo');
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition"
              >
                <span>Разместить груз</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bento Tile 4: Role - Carrier (Span 12 on mobile, 5 on lg) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-slate-400 transition group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                  <RefreshCw className="w-3 h-3 text-amber-600" />
                  <span>Обратные грузы</span>
                </span>
              </div>

              <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-100/80 text-emerald-900 font-bold text-[10px] uppercase tracking-wider mb-2">
                Перевозчикам и Водителям
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Найти груз и заработать</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Постоянный поток прямых грузов под параметры вашего автомобиля. Не возвращайтесь пустыми — находите попутные и обратные рейсы.
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Умный подбор только совместимых грузов</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-amber-900">Поиск обратной загрузки: доход в оба конца</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Свободное предложение собственной цены</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => {
                  switchRole('carrier');
                  setCurrentView('find-cargo');
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 transition"
              >
                <span>Найти грузы</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  switchRole('carrier');
                  setCurrentView('reverse-cargos');
                }}
                className="px-4 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition"
              >
                ⚡ Обратные
              </button>
            </div>
          </div>

          {/* Bento Tile 5: Fast Stats & Trust (Span 12 on mobile, 3 on lg) */}
          <div className="col-span-12 lg:col-span-3 bg-emerald-500 text-slate-950 rounded-3xl p-6 sm:p-7 shadow-lg shadow-emerald-500/20 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-emerald-400 flex items-center justify-center mb-4">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                Статистика платформы
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                14 200+
              </div>
              <div className="text-xs font-semibold text-slate-900 mt-1">
                Успешно доставленных рейсов
              </div>

              <div className="mt-5 space-y-3 pt-4 border-t border-slate-950/15 text-xs font-bold text-slate-900">
                <div className="flex justify-between items-center">
                  <span>Время отклика:</span>
                  <span className="font-black bg-slate-950 text-white px-2 py-0.5 rounded-md">4.2 мин</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Доставок в срок:</span>
                  <span className="font-black">98.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Экономия рейса:</span>
                  <span className="font-black text-emerald-950">до 35%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-950/15 text-[11px] text-slate-900 font-medium">
              «Есть машина? Есть груз!»
            </div>
          </div>

        </div>
      </section>

      {/* 2. BENTO PROCESS & MATCHING FLOW (Section 2 from Prompt) */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 mb-2">
              Прозрачный процесс работы
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Как работает логистическая цепочка CargoMatch
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Прямой контакт между проверенными грузовладельцами и надежными перевозчиками
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1">ГРУЗ</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Грузовладелец размещает заявку за 2 минуты: маршрут, вес, объем, тип кузова и желаемая дата.
              </p>
              <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                ✓ Авторасчёт ориентировочной цены
              </div>
            </div>

            {/* Step 2 (Center Highlight) */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 relative shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm mb-4">
                CM
              </div>
              <h4 className="text-base font-black text-white mb-1">CARGOMATCH</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Алгоритм проводит проверку совместимости и рассылает заявку подходящим свободным перевозчикам.
              </p>
              <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg inline-block">
                ⚡ Мгновенные ставки без посредников
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1">ПЕРЕВОЗЧИК & ДОСТАВКА</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Подача проверенного автомобиля, электронная фиксация документов, фото пломб и трекинг рейса.
              </p>
              <div className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg inline-block">
                🔁 Автоподбор обратного груза
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO SMART MATCHING & PHYSICAL COMPATIBILITY (Section 5) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Zap className="w-3.5 h-3.5" />
              <span>Алгоритм умного подбора</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Умный Matching груза и транспорта
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Система анализирует более 10 ключевых параметров (грузоподъемность, полезный объем, температурный режим, маршрут, дату и рейтинг) и отсекает неподходящие машины.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Физический контроль совместимости:</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Если вес груза 10 тонн, система никогда не покажет 5-тонный грузовик как подходящий. Вы видите только проверенные и реальные совпадения.
              </p>
            </div>

            <button
              onClick={() => {
                switchRole('shipper');
                selectCargo('cargo-1', 'cargo-matching');
              }}
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-2"
            >
              <span>Посмотреть живой пример подбора</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 font-bold border border-slate-700">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-black text-white">Fast Cargo</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ✓ Проверен
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">★★★★★ 4.9 • 214 доставок</div>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs shadow-md">
                96% Match
              </div>
            </div>

            {/* Match Criteria */}
            <div className="py-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl">
                <div className="text-slate-400 text-[10px]">Автомобиль</div>
                <div className="font-bold text-white mt-0.5">Mercedes Atego</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl">
                <div className="text-slate-400 text-[10px]">Грузоподъёмность</div>
                <div className="font-bold text-white mt-0.5">5 тонн · 20 м³</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl col-span-2 sm:col-span-1">
                <div className="text-slate-400 text-[10px]">Подача машины</div>
                <div className="font-bold text-emerald-300 mt-0.5">28 авг, 09:00</div>
              </div>
            </div>

            {/* Bullet reasons */}
            <div className="space-y-1 text-xs text-slate-300 py-2">
              <div className="flex items-center space-x-2 text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Подходит грузоподъёмность (до 5 т) и объём кузова (20 м³)</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Прямой маршрут Бишкек → Ош без отклонения от пути</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Машина свободна в городе загрузки</span>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Предлагаемая цена</span>
                <span className="text-xl font-black text-white">15 000 сом</span>
              </div>
              <button
                onClick={() => {
                  switchRole('shipper');
                  selectCargo('cargo-1', 'cargo-matching');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition"
              >
                Выбрать перевозчика
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. REVERSE CARGO BENTO HERO (Section 11) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-amber-500/15 via-white to-emerald-500/15 border border-amber-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-300">
                <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                <span>Главная фишка платформы</span>
              </div>
              
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Обратные грузы: Не возвращайтесь пустыми!
              </h3>
              
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                Завершаете рейс из <strong>Бишкека в Ош</strong>? Система автоматически подбирает и уведомляет о наличии грузов в обратном направлении (Ош → Бишкек, Ош → Джалал-Абад). Увеличивайте прибыль с каждой поездки до 40%!
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    switchRole('carrier');
                    setCurrentView('reverse-cargos');
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition"
                >
                  Взять обратный груз
                </button>
                <button
                  onClick={() => {
                    switchRole('shipper');
                    setCurrentView('create-cargo');
                  }}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs sm:text-sm transition"
                >
                  Отправить попутным рейсом
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="text-amber-400 font-bold flex items-center space-x-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>⚡ Найден обратный груз</span>
                </span>
                <span className="text-slate-400 text-[10px]">Рейс #CM-8924</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-white">Ош → Бишкек</div>
                  <div className="text-xs text-slate-400">1.8 тонны · 14 м³ · Фрукты</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-emerald-400">12 000 сом</div>
                  <div className="text-[10px] text-slate-400">29 августа</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 text-[11px] text-slate-300">
                «Идеально под кузов до 5 тонн, освободившийся после рейса Бишкек-Ош.»
              </div>

              <button
                onClick={() => {
                  switchRole('carrier');
                  setCurrentView('reverse-cargos');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition"
              >
                Взять обратный груз (12 000 сом)
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. POPULAR ROUTES BENTO GRID (Section 21) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 mb-1">
                Направления перевозок
              </h2>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Популярные маршруты в Кыргызстане и ЦА
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('popular-routes')}
              className="mt-2 sm:mt-0 inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Смотреть все маршруты</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_ROUTES.slice(0, 4).map((route) => (
              <div
                key={route.id}
                onClick={() => {
                  switchRole('carrier');
                  setCurrentView('find-cargo');
                }}
                className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-2xl p-4 transition duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span>{route.distanceKm} км (~{route.avgHours} ч)</span>
                  <span className="font-bold text-emerald-700">{route.trend}</span>
                </div>
                <div className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition">
                  {route.fromCity} → {route.toCity}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Средний тариф</span>
                    <span className="font-bold text-slate-900">{formatPrice(route.avgPriceKgs)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">Активных заявок</span>
                    <span className="font-bold text-emerald-700">{route.activeCargosCount} грузов</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST & VERIFICATION BENTO TILES */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Верификация перевозчиков</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Проверка паспортов, техпаспортов ТС и ИНН юрлиц перед допуском к грузам.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Защита личных данных</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Номера телефонов скрыты до момента подтверждения сделки сторонами.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Двусторонний рейтинг</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Оценка по объективным критериям: пунктуальность, бережность и оплата.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Электронные ТТН</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Акты приёма-передачи и фото пломб сохраняются в заказе навсегда.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION TILE */}
      <section className="pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-4 border border-slate-800">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Готовы отправить или взять груз прямо сейчас?
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto">
            Присоединяйтесь к единой B2B логистической сети Кыргызстана. Размещение занимает всего 2 минуты.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                switchRole('shipper');
                setCurrentView('create-cargo');
              }}
              className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition"
            >
              Разместить груз
            </button>
            <button
              onClick={() => {
                switchRole('carrier');
                setCurrentView('find-cargo');
              }}
              className="px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition border border-slate-700"
            >
              Найти попутный груз
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
