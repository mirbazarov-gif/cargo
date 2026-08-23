import React from 'react';
import { Box, Home, MessageSquare, Package, Search, Truck, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentRole, currentView, setCurrentView, currentUser, chatMessages, orders } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B192C] border-t border-slate-800 px-2 py-1.5 shadow-2xl safe-bottom">
      <div className="grid grid-cols-5 gap-1 items-center text-center">
        {/* 1. Home */}
        <button
          onClick={() => setCurrentView('landing')}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition ${
            currentView === 'landing' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Главная</span>
        </button>

        {/* 2. Cargos / Find Cargo */}
        {currentRole === 'carrier' ? (
          <button
            onClick={() => setCurrentView('find-cargo')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition ${
              currentView === 'find-cargo' || currentView === 'reverse-cargos' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Грузы</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentView('my-cargos')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition ${
              currentView === 'my-cargos' || currentView === 'create-cargo' || currentView === 'cargo-matching'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Грузы</span>
          </button>
        )}

        {/* 3. Orders */}
        <button
          onClick={() => setCurrentView('orders')}
          className={`relative flex flex-col items-center justify-center py-1 rounded-lg transition ${
            currentView === 'orders' || currentView === 'order-detail' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-5 h-5 mb-0.5" />
          {activeOrdersCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center">
              {activeOrdersCount}
            </span>
          )}
          <span className="text-[10px]">Заказы</span>
        </button>

        {/* 4. Messages / Order detail */}
        <button
          onClick={() => {
            if (orders.length > 0) {
              setCurrentView('order-detail');
            } else {
              setCurrentView('orders');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition ${
            currentView === 'chat' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Чат</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => {
            if (currentRole === 'carrier') {
              setCurrentView('carrier-profile');
            } else if (currentRole === 'shipper') {
              setCurrentView('shipper-profile');
            } else {
              setCurrentView('admin');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition ${
            currentView === 'carrier-profile' || currentView === 'shipper-profile' || currentView === 'admin'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Профиль</span>
        </button>
      </div>
    </div>
  );
};
