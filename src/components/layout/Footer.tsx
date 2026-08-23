import React from 'react';
import { Shield, Truck, Phone, Mail, MapPin, Award, CheckCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView, switchRole } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-20 lg:pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <div className="w-3.5 h-3.5 border-2 border-slate-950 rotate-45" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Cargo<span className="text-emerald-400">Match</span>
              </span>
            </div>
            <p className="text-slate-300 font-bold text-xs">
              «Есть груз? Найдём машину. Есть машина? Найдём груз.»
            </p>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Современная цифровая B2B логистическая платформа для Кыргызстана и Центральной Азии. Умный matching, защита сделок, обратные грузы и онлайн-документооборот.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Верификация перевозчиков</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                <RefreshCw className="w-3 h-3 text-amber-400" />
                <span>Обратные грузы</span>
              </span>
            </div>
          </div>

          {/* Col 2: Грузовладельцам */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Грузовладельцам</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    switchRole('shipper');
                    setCurrentView('create-cargo');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Разместить груз за 2 мин
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('shipper');
                    setCurrentView('my-cargos');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Сравнение предложений
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('shipper');
                    setCurrentView('orders');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Отслеживание рейсов
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('popular-routes')}
                  className="hover:text-emerald-400 transition"
                >
                  Тарифы и направления
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Перевозчикам */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Перевозчикам</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    switchRole('carrier');
                    setCurrentView('find-cargo');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Найти попутный груз
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('carrier');
                    setCurrentView('reverse-cargos');
                  }}
                  className="hover:text-amber-400 text-amber-300 font-bold transition"
                >
                  ⚡ Поиск обратных грузов
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('carrier');
                    setCurrentView('my-fleet');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Добавить автомобиль в парк
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('carrier');
                    setCurrentView('carrier-profile');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Рейтинг и верификация
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: География и контакты */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Регион работы</h4>
            <div className="space-y-1.5 text-slate-300">
              <p className="text-emerald-400 font-bold">🇰🇬 Кыргызстан (Все области)</p>
              <p>🇰🇿 Казахстан (Алматы, Астана)</p>
              <p>🇺🇿 Узбекистан (Ташкент, Фергана)</p>
              <p>🇹🇯 Таджикистан (Душанбе, Худжанд)</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-1">
              <p className="text-slate-400">Поддержка 24/7:</p>
              <p className="text-emerald-400 font-mono font-bold text-sm">+996 312 90-00-00</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <p>© 2026 CargoMatch Inc. B2B Freight Logistics Central Asia.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0 text-[11px]">
            <span className="hover:text-slate-400 cursor-pointer">Правила платформы</span>
            <span className="hover:text-slate-400 cursor-pointer">Конфиденциальность</span>
            <span className="hover:text-slate-400 cursor-pointer">Безопасность сделок</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
