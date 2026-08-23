import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Globe,
  Layers,
  MapPin,
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  Shield,
  Truck,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    currentView,
    setCurrentView,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    selectCargo,
    selectOrder,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Bento Geometric Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
              <div className="w-4 h-4 border-2 border-emerald-400 rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Cargo<span className="text-emerald-600">Match</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  B2B
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block leading-tight">
                Есть груз? Найдём машину. Есть машина? Найдём груз.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                currentView === 'landing' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Главная
            </button>

            {currentRole === 'shipper' && (
              <>
                <button
                  onClick={() => setCurrentView('shipper-dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                    currentView === 'shipper-dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Кабинет
                </button>
                <button
                  onClick={() => setCurrentView('my-cargos')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                    currentView === 'my-cargos' || currentView === 'cargo-matching'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Мои грузы
                </button>
                <button
                  onClick={() => setCurrentView('orders')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                    currentView === 'orders' || currentView === 'order-detail'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Заказы
                </button>
              </>
            )}

            {currentRole === 'carrier' && (
              <>
                <button
                  onClick={() => setCurrentView('carrier-dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                    currentView === 'carrier-dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Кабинет
                </button>
                <button
                  onClick={() => setCurrentView('find-cargo')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                    currentView === 'find-cargo' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Найти груз
                </button>
                <button
                  onClick={() => setCurrentView('reverse-cargos')}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                    currentView === 'reverse-cargos' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>Обратные грузы</span>
                  <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Hot
                  </span>
                </button>
                <button
                  onClick={() => setCurrentView('my-fleet')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                    currentView === 'my-fleet' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Автопарк
                </button>
                <button
                  onClick={() => setCurrentView('orders')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                    currentView === 'orders' || currentView === 'order-detail'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Рейсы
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                  currentView === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Админ-панель
              </button>
            )}

            <button
              onClick={() => setCurrentView('popular-routes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition ${
                currentView === 'popular-routes' ? 'bg-slate-900 text-white' : 'text-emerald-700 hover:bg-emerald-50 font-extrabold'
              }`}
            >
              Маршруты
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Action Button */}
            {currentRole === 'shipper' ? (
              <button
                onClick={() => setCurrentView('create-cargo')}
                className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Создать груз</span>
              </button>
            ) : currentRole === 'carrier' ? (
              <button
                onClick={() => setCurrentView('find-cargo')}
                className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition transform active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Найти груз</span>
              </button>
            ) : null}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition relative"
                title="Уведомления"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-slate-900">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-sm text-slate-900">Уведомления</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-bold"
                      >
                        Прочитать все
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 mt-3 divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-6">Нет новых уведомлений</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setShowNotifMenu(false);
                            if (n.linkTab === 'offers' || n.linkTab === 'cargo-matching') {
                              selectCargo(n.relatedId || 'cargo-1', 'cargo-matching');
                            } else if (n.linkTab === 'orders') {
                              selectOrder(n.relatedId || 'ord-101', 'order-detail');
                            } else if (n.linkTab === 'reverse') {
                              setCurrentView('reverse-cargos');
                            }
                          }}
                          className={`pt-2.5 pb-2 text-left cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition ${
                            !n.isRead ? 'bg-emerald-50/50 border-l-2 border-emerald-500' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap">{n.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher & User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 transition"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-500">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-slate-900 truncate max-w-[120px]">{currentUser.companyName || currentUser.name}</span>
                    {currentUser.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block leading-none">
                    {currentRole === 'shipper' ? 'Грузовладелец' : currentRole === 'carrier' ? 'Перевозчик' : 'Администратор'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Role Switcher Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-slate-900">
                  <div className="px-3 py-2 border-b border-slate-100 text-xs font-semibold text-slate-500">
                    Переключатель режима:
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => handleRoleSelect('shipper')}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition ${
                        currentRole === 'shipper' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1">
                          <span>📦 Грузовладелец</span>
                        </div>
                        <span className="text-[11px] text-slate-500">«Кант Трейд ОсОО»</span>
                      </div>
                      {currentRole === 'shipper' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('carrier')}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition ${
                        currentRole === 'carrier' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1">
                          <span>🚛 Перевозчик</span>
                        </div>
                        <span className="text-[11px] text-slate-500">«Fast Cargo ОсОО»</span>
                      </div>
                      {currentRole === 'carrier' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition ${
                        currentRole === 'admin' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1">
                          <span>⚙️ Администратор</span>
                        </div>
                        <span className="text-[11px] text-slate-500">Управление платформой</span>
                      </div>
                      {currentRole === 'admin' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-2">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl mb-3 border border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Активный режим:</span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {currentRole === 'shipper' ? 'Грузовладелец' : currentRole === 'carrier' ? 'Перевозчик' : 'Администратор'}
            </span>
          </div>

          <button
            onClick={() => {
              setCurrentView('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
          >
            Главная страница
          </button>

          {currentRole === 'shipper' && (
            <>
              <button
                onClick={() => {
                  setCurrentView('shipper-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                Панель грузовладельца
              </button>
              <button
                onClick={() => {
                  setCurrentView('create-cargo');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs bg-slate-900 text-white font-bold"
              >
                + Создать груз
              </button>
              <button
                onClick={() => {
                  setCurrentView('my-cargos');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                Мои грузы
              </button>
              <button
                onClick={() => {
                  setCurrentView('orders');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                Активные заказы
              </button>
            </>
          )}

          {currentRole === 'carrier' && (
            <>
              <button
                onClick={() => {
                  setCurrentView('carrier-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                Панель перевозчика
              </button>
              <button
                onClick={() => {
                  setCurrentView('find-cargo');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs bg-emerald-500 text-slate-950 font-black"
              >
                🔍 Найти груз
              </button>
              <button
                onClick={() => {
                  setCurrentView('reverse-cargos');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-amber-700 bg-amber-50 font-bold"
              >
                ⚡ Обратные грузы
              </button>
              <button
                onClick={() => {
                  setCurrentView('my-fleet');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                Мои автомобили
              </button>
            </>
          )}

          <button
            onClick={() => {
              setCurrentView('popular-routes');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
          >
            Популярные маршруты
          </button>
        </div>
      )}
    </header>
  );
};
