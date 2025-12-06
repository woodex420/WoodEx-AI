import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { Card } from './Shared';

const data = [
  { name: 'Jan', revenue: 4000, leads: 24 },
  { name: 'Feb', revenue: 3000, leads: 13 },
  { name: 'Mar', revenue: 2000, leads: 98 },
  { name: 'Apr', revenue: 2780, leads: 39 },
  { name: 'May', revenue: 1890, leads: 48 },
  { name: 'Jun', revenue: 2390, leads: 38 },
  { name: 'Jul', revenue: 3490, leads: 43 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <Card className="p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-green-500 flex items-center font-medium">
        <TrendingUp size={14} className="mr-1" /> {change}
      </span>
      <span className="text-slate-400 ml-2">vs last month</span>
    </div>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Business Overview</h2>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$45,231.89" change="+20.1%" icon={DollarSign} color="bg-blue-500" />
        <StatCard title="Active Leads" value="2,345" change="+15.2%" icon={Users} color="bg-purple-500" />
        <StatCard title="Total Orders" value="12,234" change="+4.5%" icon={ShoppingBag} color="bg-orange-500" />
        <StatCard title="Conversion Rate" value="3.2%" change="+1.2%" icon={TrendingUp} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Revenue Analytics</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Lead Sources</h3>
          <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" hide />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }}/>
                <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;