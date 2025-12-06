
import React, { useState } from 'react';
import { Truck, MapPin, Package, CheckCircle, Clock, RefreshCw, X, MessageSquare } from 'lucide-react';
import { Card, Button, Badge, Input, Modal } from './Shared';
import { Delivery } from '../types';

const MOCK_DELIVERIES: Delivery[] = [
  { 
      id: '1', orderNumber: 'ORD-889', trackingNumber: 'WX-TRK-888', customerName: 'Startup Hub', address: 'Block 6, PECHS, Karachi', courier: 'Ahmed Ali', type: 'Standard', status: 'In Transit', action: 'Track',
      timeline: [
          { status: 'Order Placed', date: 'Oct 22, 09:00 AM', completed: true },
          { status: 'Production', date: 'Oct 22, 02:00 PM', completed: true },
          { status: 'Dispatched', date: 'Oct 25, 09:00 AM', completed: true },
          { status: 'Delivered', date: '-', completed: false },
      ]
  },
  { 
      id: '2', orderNumber: 'ORD-892', trackingNumber: 'WX-TRK-892', customerName: 'TechVantage Systems', address: 'DHA Phase 5, Lahore', courier: 'Bilal Khan', type: 'Standard', status: 'Scheduled', action: 'Track',
      timeline: [
          { status: 'Order Placed', date: 'Oct 24, 10:00 AM', completed: true },
          { status: 'Production', date: 'Oct 24, 04:00 PM', completed: true },
          { status: 'Dispatched', date: '-', completed: false },
          { status: 'Delivered', date: '-', completed: false },
      ]
  },
  { 
      id: '3', orderNumber: 'ORD-889', trackingNumber: 'WX-TRK-889', customerName: 'Private Client', address: 'F-7/2, Islamabad', courier: 'Rashid Mehmood', type: 'Standard', status: 'Delivered', action: 'Track',
      timeline: [
          { status: 'Order Placed', date: 'Oct 20, 09:00 AM', completed: true },
          { status: 'Production', date: 'Oct 21, 11:00 AM', completed: true },
          { status: 'Dispatched', date: 'Oct 22, 09:00 AM', completed: true },
          { status: 'Delivered', date: 'Oct 23, 05:00 PM', completed: true },
      ]
  },
];

const Deliveries = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const handleSendUpdate = () => {
      alert(`WhatsApp update sent for ${selectedDelivery?.orderNumber}: "Your order is currently ${selectedDelivery?.status}"`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="mb-8">
          <h2 className="text-3xl font-bold text-lime-400 bg-black inline-block px-2">Delivery Management</h2>
          <p className="text-slate-400 mt-1">Track and manage order deliveries, dispatch schedules, and logistics.</p>
       </div>

       {/* Status Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-slate-900 border-slate-800 flex justify-between items-center">
             <div>
                <p className="text-slate-500 text-sm mb-1">Total Deliveries</p>
                <h3 className="text-3xl font-bold text-white">3</h3>
             </div>
             <Package size={32} className="text-slate-700" />
          </Card>
          <Card className="p-6 bg-slate-900 border-slate-800 flex justify-between items-center">
             <div>
                <p className="text-slate-500 text-sm mb-1">Pending</p>
                <h3 className="text-3xl font-bold text-orange-400">1</h3>
             </div>
             <Clock size={32} className="text-orange-900" />
          </Card>
          <Card className="p-6 bg-slate-900 border-slate-800 flex justify-between items-center">
             <div>
                <p className="text-slate-500 text-sm mb-1">In Transit</p>
                <h3 className="text-3xl font-bold text-blue-400">1</h3>
             </div>
             <Truck size={32} className="text-blue-900" />
          </Card>
          <Card className="p-6 bg-slate-900 border-slate-800 flex justify-between items-center">
             <div>
                <p className="text-slate-500 text-sm mb-1">Delivered</p>
                <h3 className="text-3xl font-bold text-green-400">1</h3>
             </div>
             <CheckCircle size={32} className="text-green-900" />
          </Card>
       </div>

       {/* Controls */}
       <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-800">
          <Input placeholder="Search by tracking number, order number, or customer..." className="max-w-md bg-slate-800 border-slate-700 text-white" />
          <div className="flex gap-2">
             <select className="bg-slate-800 border border-slate-700 text-white rounded p-2 text-sm">
                <option>All Deliveries</option>
                <option>Pending</option>
             </select>
             <Button variant="outline" className="border-slate-700 text-slate-300"><RefreshCw size={14}/> Refresh</Button>
          </div>
       </div>

       {/* Table */}
       <div className="bg-black rounded-lg overflow-hidden border border-slate-900">
          <table className="w-full text-left border-collapse">
             <thead className="bg-slate-900 text-slate-500 text-xs uppercase font-bold">
                <tr>
                   <th className="p-4">Order Number</th>
                   <th className="p-4">Customer</th>
                   <th className="p-4">Tracking Number</th>
                   <th className="p-4">Courier / Driver</th>
                   <th className="p-4">Delivery Type</th>
                   <th className="p-4">Status</th>
                   <th className="p-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-900 text-sm text-slate-300 bg-slate-950">
                {MOCK_DELIVERIES.map(d => (
                   <tr key={d.id} className="hover:bg-slate-900 transition-colors">
                      <td className="p-4 font-bold text-white">{d.orderNumber}</td>
                      <td className="p-4">
                         <p className="font-bold text-white">{d.customerName}</p>
                         <p className="text-xs text-slate-500 truncate max-w-[150px]">{d.address}</p>
                      </td>
                      <td className="p-4 font-mono text-lime-500">{d.trackingNumber}</td>
                      <td className="p-4">{d.courier}</td>
                      <td className="p-4">{d.type}</td>
                      <td className="p-4">
                         <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            d.status === 'In Transit' ? 'bg-blue-900 text-blue-300' :
                            d.status === 'Scheduled' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-green-900 text-green-300'
                         }`}>
                            {d.status.toUpperCase()}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                         <Button variant="ghost" className="text-lime-500 hover:text-lime-400" onClick={() => setSelectedDelivery(d)}>Track →</Button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Tracking Modal */}
       <Modal isOpen={!!selectedDelivery} onClose={() => setSelectedDelivery(null)} title="Track Delivery">
          <div className="space-y-6">
              <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Order <strong className="text-white">#{selectedDelivery?.orderNumber}</strong></span>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-700 space-y-8 my-8">
                  {selectedDelivery?.timeline?.map((event, idx) => (
                      <div key={idx} className="relative">
                          <div className={`absolute -left-[31px] w-6 h-6 rounded-full border-4 border-slate-900 ${event.completed ? 'bg-lime-500 text-black' : 'bg-slate-700'}`}>
                             {event.completed && <CheckCircle size={16} className="text-black m-[-2px]"/>}
                          </div>
                          <div>
                              <h4 className={`text-sm font-bold ${event.completed ? 'text-white' : 'text-slate-500'}`}>{event.status}</h4>
                              <p className="text-xs text-lime-500 font-mono mt-1">{event.date}</p>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                 <div>
                     <p className="text-xs text-slate-500">Current Status:</p>
                     <p className="text-lime-400 font-bold uppercase">{selectedDelivery?.status}</p>
                 </div>
                 <Button className="bg-lime-600 hover:bg-lime-700 text-white" onClick={handleSendUpdate}>
                     <MessageSquare size={16}/> Send '{selectedDelivery?.status}' Update
                 </Button>
              </div>
          </div>
       </Modal>
    </div>
  );
};

export default Deliveries;
