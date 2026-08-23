/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { LandingPage } from './components/landing/LandingPage';
import { ShipperDashboard } from './components/shipper/ShipperDashboard';
import { CreateCargoWizard } from './components/shipper/CreateCargoWizard';
import { CargoMatchingView } from './components/shipper/CargoMatchingView';
import { MyCargosView } from './components/shipper/MyCargosView';
import { CarrierDashboard } from './components/carrier/CarrierDashboard';
import { FindCargoView } from './components/carrier/FindCargoView';
import { ReverseCargoView } from './components/carrier/ReverseCargoView';
import { FleetManager } from './components/carrier/FleetManager';
import { OrderLifecycleView } from './components/orders/OrderLifecycleView';
import { OrdersListView } from './components/orders/OrdersListView';
import { CarrierProfileView } from './components/profile/CarrierProfileView';
import { ShipperProfileView } from './components/profile/ShipperProfileView';
import { PopularRoutesView } from './components/routes/PopularRoutesView';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'shipper-dashboard':
        return <ShipperDashboard />;
      case 'create-cargo':
        return <CreateCargoWizard />;
      case 'cargo-matching':
        return <CargoMatchingView />;
      case 'my-cargos':
        return <MyCargosView />;
      case 'carrier-dashboard':
        return <CarrierDashboard />;
      case 'find-cargo':
        return <FindCargoView />;
      case 'reverse-cargos':
        return <ReverseCargoView />;
      case 'my-fleet':
        return <FleetManager />;
      case 'orders':
        return <OrdersListView />;
      case 'order-detail':
        return <OrderLifecycleView />;
      case 'carrier-profile':
        return <CarrierProfileView />;
      case 'shipper-profile':
        return <ShipperProfileView />;
      case 'popular-routes':
        return <PopularRoutesView />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans antialiased text-slate-900 selection:bg-emerald-500 selection:text-slate-950">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        {renderCurrentView()}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
