
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Settings, 
  Zap, 
  Package, 
  Bell, 
  Menu,
  Moon,
  Sun,
  Search,
  Users,
  ShoppingCart,
  Truck,
  Store,
  PieChart
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import CRM from './components/CRM';
import LeadGeneration from './components/LeadGeneration';
import Invoices from './components/Invoices';
import Quotations from './components/Quotations';
import ProductCatalog from './components/ProductCatalog';
import Deliveries from './components/Deliveries';
import Automation from './components/Automation';
import Orders from './components/Orders';
import { ViewState } from './types';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // Default to Dark based on screenshots

  // Toggle Dark Mode
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button 
      onClick={() => { setCurrentView(view); if (window.innerWidth < 768) setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
        currentView === view 
          ? 'bg-lime-900/40 text-lime-400 border-l-4 border-lime-500' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={18} className={currentView === view ? 'text-lime-400' : 'text-slate-500'} />
      {sidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black font-sans">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-20'} flex-shrink-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 z-50 flex flex-col fixed md:relative h-full`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
           {sidebarOpen ? (
             <div className="flex items-center gap-2 font-bold text-xl text-white">
               <div className="w-8 h-8 bg-lime-500 rounded flex items-center justify-center text-black font-bold">W</div>
               WoodEx AI
             </div>
           ) : (
             <div className="w-8 h-8 bg-lime-500 rounded flex items-center justify-center text-black font-bold mx-auto">W</div>
           )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-600 uppercase px-4 py-2 mt-2 mb-1">Main Menu</div>
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="whatsapp" icon={MessageSquare} label="WhatsApp CRM" />
          <NavItem view="leads" icon={Users} label="Lead Generation" />
          <NavItem view="products" icon={Package} label="Products" />
          <NavItem view="orders" icon={ShoppingCart} label="Orders" />
          <NavItem view="quotations" icon={FileText} label="E-Quotations" />
          <NavItem view="invoices" icon={FileText} label="Invoices" />
          <NavItem view="deliveries" icon={Truck} label="Deliveries" />
          <NavItem view="showroom" icon={Store} label="Showroom" />
          <NavItem view="analytics" icon={PieChart} label="Analytics" />
          
          <div className="text-xs font-bold text-slate-600 uppercase px-4 py-2 mt-6 mb-1">System</div>
          <NavItem view="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center text-black font-bold text-xs">AD</div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-white truncate">Admin User</p>
                   <p className="text-xs text-slate-500 truncate">Woodex Retail</p>
                </div>
              )}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-black">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-40">
           <h1 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
             {!sidebarOpen && <button onClick={() => setSidebarOpen(true)}><Menu size={20}/></button>}
             WoodEx Dashboard
           </h1>

           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900 rounded-full px-4 py-1.5 w-64 border border-transparent focus-within:border-lime-500 transition-colors">
                 <Search size={16} className="text-slate-400 mr-2" />
                 <input className="bg-transparent border-none focus:outline-none text-sm w-full dark:text-white" placeholder="Search..." />
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 relative">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white">7</span>
              </button>
              {/* Profile Dropdown Placeholder */}
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center text-black font-bold text-xs">AD</div>
                  <div className="hidden md:block text-right">
                      <p className="text-xs font-bold text-white">Admin User</p>
                      <p className="text-[10px] text-slate-500">Woodex Retail</p>
                  </div>
              </div>
           </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-6 scrollbar-hide">
           {currentView === 'dashboard' && <Dashboard />}
           {currentView === 'whatsapp' && <CRM />}
           {currentView === 'leads' && <LeadGeneration />}
           {currentView === 'quotations' && <Quotations />}
           {currentView === 'invoices' && <Invoices />}
           {currentView === 'products' && <ProductCatalog />}
           {currentView === 'deliveries' && <Deliveries />}
           {currentView === 'orders' && <Orders />}
           {currentView === 'automation' && <Automation />}
           
           {/* Placeholders for views not yet fully implemented but in menu */}
           {(currentView === 'showroom' || currentView === 'analytics' || currentView === 'settings') && (
             <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <Store size={64} className="mb-4 opacity-20" />
                <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
                <p>The {currentView} module is currently under development.</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default App;
