
import React, { useState } from 'react';
import { ShoppingCart, Plus, Search, Filter, Eye, Download, Globe, Store, Check, Trash2, Send, MessageSquare, ChevronDown, ChevronUp, Truck, Package } from 'lucide-react';
import { Card, Button, Input, Modal, Badge } from './Shared';
import { Order, Product, LineItem } from '../types';

const MOCK_ORDERS: Order[] = [
  { id: '1', orderNumber: 'ORD-892', customerName: 'TechVantage Systems', date: 'Oct 24, 2025', total: 540000, status: 'Completed', paymentStatus: 'Paid', source: 'Showroom', items: [], trackingNumber: 'Pending' },
  { id: '2', orderNumber: 'ORD-893', customerName: 'Web Client', date: 'Oct 25, 2025', total: 45000, status: 'Processing', paymentStatus: 'Partial', source: 'Web', items: [], trackingNumber: '' },
];

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Royal Prestige CEO Desk', category: 'Executive', price: 450000, stock: 10, sku: 'WDX-CEO-001', image: '', status: 'Active' },
    { id: '2', name: 'Imperial Luxury CEO Desk', category: 'Executive', price: 520000, stock: 5, sku: 'WDX-CEO-002', image: '', status: 'Active' },
    { id: '3', name: 'Modular Hybrid Workstation', category: 'Workstations', price: 85000, stock: 20, sku: 'WDX-WS-001', image: '', status: 'Active' },
    { id: '4', name: 'ErgoMaster High Back Chair', category: 'Seating', price: 45000, stock: 12, sku: 'WDX-CHR-005', image: '', status: 'Active' },
    { id: '5', name: 'Executive File Cabinet', category: 'Storage', price: 35000, stock: 5, sku: 'WDX-STR-012', image: '', status: 'Low Stock' },
    { id: '6', name: 'Grand Boardroom Table (12-Seater)', category: 'Conference', price: 320000, stock: 2, sku: 'WDX-CNF-003', image: '', status: 'Active' },
];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [cart, setCart] = useState<LineItem[]>([]);
  const [posCustomer, setPosCustomer] = useState({ name: '', phone: '' });
  const [searchProduct, setSearchProduct] = useState('');
  
  // Filtering & View State
  const [sourceFilter, setSourceFilter] = useState<'All' | 'Web' | 'Showroom'>('All');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Paid' | 'Unpaid' | 'Partial'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Tracking Modal State
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [editingTrackingOrder, setEditingTrackingOrder] = useState<Order | null>(null);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');

  // POS Functions
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
        setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } : item));
    } else {
        setCart([...cart, { productId: product.id, productName: product.name, quantity: 1, price: product.price, total: product.price }]);
    }
  };

  const removeFromCart = (productId: string) => {
      setCart(cart.filter(item => item.productId !== productId));
  };

  const sendWhatsAppConfirmation = (order: Order) => {
      const message = `*Order Update* 🔔\n\nHi ${order.customerName},\nYour order *${order.orderNumber}* status is now *${order.status}*.\nTotal: Rs ${order.total.toLocaleString()}\n\nThank you for choosing WoodEx!`;
      alert(`[WhatsApp API Simulator]\n\nSending message to ${order.customerName}...\n\n${message}`);
  };

  const updateOrderStatus = (id: string, newStatus: Order['status']) => {
      const updatedOrders = orders.map(o => {
          if (o.id === id) {
              const updated = { ...o, status: newStatus };
              if (newStatus === 'Completed' && o.status !== 'Completed') {
                  setTimeout(() => sendWhatsAppConfirmation(updated), 500);
              }
              return updated;
          }
          return o;
      });
      setOrders(updatedOrders);
  };

  const completeOrder = () => {
      if(cart.length === 0) return;
      const total = cart.reduce((acc, item) => acc + item.total, 0);
      const newOrder: Order = {
          id: Date.now().toString(),
          orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
          customerName: posCustomer.name || 'Walk-in Customer',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          total: total,
          status: 'Completed',
          paymentStatus: 'Paid',
          source: 'Showroom',
          items: cart,
          trackingNumber: 'Pending'
      };
      
      setOrders([newOrder, ...orders]);
      setIsPosOpen(false);
      setCart([]);
      setPosCustomer({name: '', phone: ''});
      setTimeout(() => sendWhatsAppConfirmation(newOrder), 500);
  };

  const toggleOrderDetails = (id: string) => {
      setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const openTrackingModal = (order: Order) => {
      setEditingTrackingOrder(order);
      setNewTrackingNumber(order.trackingNumber || '');
      setIsTrackingModalOpen(true);
  };

  const generateTrackingNumber = () => {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      setNewTrackingNumber(`WX-TRK-${randomNum}`);
  };

  const saveTrackingNumber = () => {
      if (!editingTrackingOrder) return;
      const updatedOrders = orders.map(o => o.id === editingTrackingOrder.id ? { ...o, trackingNumber: newTrackingNumber } : o);
      setOrders(updatedOrders);
      setIsTrackingModalOpen(false);
      setEditingTrackingOrder(null);
  };

  const filteredOrders = orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource = sourceFilter === 'All' || order.source === sourceFilter;
      const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;
      return matchesSearch && matchesSource && matchesPayment;
  });

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
       <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Order Management</h2>
            <p className="text-slate-500">Unified system for Web & Showroom orders.</p>
          </div>
          <Button className="bg-lime-500 hover:bg-lime-600 text-black font-bold" onClick={() => setIsPosOpen(true)}>
             <Plus size={18}/> New Showroom Order
          </Button>
       </div>

       {/* KPIs */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-slate-900 border-slate-800 flex items-center gap-4">
             <div className="p-3 bg-blue-900/30 rounded-lg text-blue-400"><ShoppingCart size={24}/></div>
             <div>
                <p className="text-slate-500 text-xs uppercase font-bold">Total Revenue</p>
                <h3 className="text-2xl font-bold text-white">Rs 2.46M</h3>
             </div>
          </Card>
          <Card className="p-6 bg-slate-900 border-slate-800 flex items-center gap-4">
             <div className="p-3 bg-purple-900/30 rounded-lg text-purple-400"><Globe size={24}/></div>
             <div>
                <p className="text-slate-500 text-xs uppercase font-bold">Web Orders</p>
                <h3 className="text-2xl font-bold text-white">2</h3>
             </div>
          </Card>
          <Card className="p-6 bg-slate-900 border-slate-800 flex items-center gap-4">
             <div className="p-3 bg-lime-900/30 rounded-lg text-lime-400"><Store size={24}/></div>
             <div>
                <p className="text-slate-500 text-xs uppercase font-bold">Showroom Sales</p>
                <h3 className="text-2xl font-bold text-white">3</h3>
             </div>
          </Card>
       </div>

       {/* Toolbar */}
       <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-wrap">
              <div className="flex gap-2">
                 <Button variant={sourceFilter === 'All' ? 'primary' : 'ghost'} onClick={() => setSourceFilter('All')}>All</Button>
                 <Button variant={sourceFilter === 'Web' ? 'primary' : 'ghost'} onClick={() => setSourceFilter('Web')}>Web</Button>
                 <Button variant={sourceFilter === 'Showroom' ? 'primary' : 'ghost'} onClick={() => setSourceFilter('Showroom')}>Showroom</Button>
              </div>
              <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
              <div className="flex items-center gap-2">
                 <span className="text-xs text-slate-500 font-bold uppercase">Payment:</span>
                 <select 
                   value={paymentFilter} 
                   onChange={(e) => setPaymentFilter(e.target.value as any)}
                   className="bg-slate-800 border border-slate-700 text-white text-sm rounded px-2 py-1 focus:ring-1 focus:ring-lime-500"
                 >
                    <option value="All">All Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial</option>
                 </select>
              </div>
          </div>
          <div className="relative w-64">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
             <Input 
                placeholder="Search orders..." 
                className="pl-9 bg-slate-800 border-slate-700 text-white" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
       </div>

       {/* Orders List */}
       <div className="space-y-4">
          {filteredOrders.length === 0 && (
             <div className="text-center py-10 text-slate-500">No orders found matching filters.</div>
          )}
          {filteredOrders.map(order => (
             <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div 
                    className="p-4 flex items-center justify-between border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors"
                    onClick={() => toggleOrderDetails(order.id)}
                >
                   <div className="flex items-center gap-4">
                      <div className="mr-2 text-slate-500">
                          {expandedOrderId === order.id ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                      </div>
                      <div className={`w-10 h-10 rounded flex items-center justify-center text-xs shrink-0 ${order.source === 'Showroom' ? 'bg-lime-900/50 text-lime-400' : 'bg-purple-900/50 text-purple-400'}`}>
                         {order.source === 'Showroom' ? <Store size={18}/> : <Globe size={18}/>}
                      </div>
                      <div>
                         <h4 className="font-bold text-white text-lg">{order.orderNumber}</h4>
                         <p className="text-xs text-slate-500">{order.date}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="text-right hidden sm:block">
                         <p className="text-xs text-slate-500 uppercase">Customer</p>
                         <p className="text-sm font-medium text-blue-400">{order.customerName}</p>
                      </div>
                      <div className="text-right w-24">
                         <p className="text-xs text-slate-500 uppercase">Total</p>
                         <p className="text-sm font-bold text-white">Rs {order.total.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-slate-500 uppercase">Payment</p>
                         <Badge color={order.paymentStatus === 'Paid' ? 'green' : order.paymentStatus === 'Partial' ? 'yellow' : 'red'}>{order.paymentStatus}</Badge>
                      </div>
                      <div className="text-right" onClick={(e) => e.stopPropagation()}>
                         <p className="text-xs text-slate-500 uppercase mb-1">Status</p>
                         <select 
                             value={order.status} 
                             onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                             className={`text-xs font-bold px-2 py-1 rounded border bg-transparent focus:outline-none focus:ring-1 focus:ring-lime-500 cursor-pointer ${
                                order.status === 'Completed' ? 'border-green-800 text-green-400 bg-green-900/20' :
                                order.status === 'Processing' ? 'border-blue-800 text-blue-400 bg-blue-900/20' :
                                order.status === 'Cancelled' ? 'border-red-800 text-red-400 bg-red-900/20' :
                                'border-gray-600 text-gray-400 bg-gray-800'
                             }`}
                         >
                             <option value="Pending" className="bg-slate-900 text-gray-400">PENDING</option>
                             <option value="Processing" className="bg-slate-900 text-blue-400">PROCESSING</option>
                             <option value="Completed" className="bg-slate-900 text-green-400">COMPLETED</option>
                             <option value="Cancelled" className="bg-slate-900 text-red-400">CANCELLED</option>
                         </select>
                      </div>
                   </div>
                   <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                       <Button variant="ghost" className="h-8 w-8 p-0" title="Send WhatsApp Confirmation" onClick={() => sendWhatsAppConfirmation(order)}>
                           <MessageSquare size={16} className="text-lime-500"/>
                       </Button>
                   </div>
                </div>
                
                {/* Expanded details */}
                {expandedOrderId === order.id && (
                   <div className="p-6 bg-slate-950 border-t border-slate-800 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Order Items */}
                          <div>
                              <h5 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2">
                                  <Package size={16} className="text-lime-500"/> Items Summary
                              </h5>
                              <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                                  <table className="w-full text-sm text-left">
                                      <thead className="bg-slate-800 text-xs text-slate-500 uppercase">
                                          <tr>
                                              <th className="px-4 py-2">Product</th>
                                              <th className="px-4 py-2 text-center">Qty</th>
                                              <th className="px-4 py-2 text-right">Price</th>
                                              <th className="px-4 py-2 text-right">Total</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-800">
                                          {order.items.length === 0 ? (
                                              <tr><td colSpan={4} className="p-4 text-center text-slate-500 italic">No items recorded.</td></tr>
                                          ) : (
                                              order.items.map((item, idx) => (
                                                  <tr key={idx}>
                                                      <td className="px-4 py-2 text-slate-300">{item.productName}</td>
                                                      <td className="px-4 py-2 text-center text-slate-400">{item.quantity}</td>
                                                      <td className="px-4 py-2 text-right text-slate-400">{item.price.toLocaleString()}</td>
                                                      <td className="px-4 py-2 text-right text-white font-medium">{item.total.toLocaleString()}</td>
                                                  </tr>
                                              ))
                                          )}
                                      </tbody>
                                      <tfoot className="bg-slate-900 border-t border-slate-800">
                                          <tr>
                                              <td colSpan={3} className="px-4 py-2 text-right font-bold text-slate-400">Grand Total</td>
                                              <td className="px-4 py-2 text-right font-bold text-lime-400">Rs {order.total.toLocaleString()}</td>
                                          </tr>
                                      </tfoot>
                                  </table>
                              </div>
                          </div>

                          {/* Order Actions & Info */}
                          <div className="space-y-6">
                              <div>
                                  <h5 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2">
                                      <Truck size={16} className="text-blue-500"/> Shipping & Tracking
                                  </h5>
                                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                                      <div className="flex justify-between items-center mb-2">
                                          <span className="text-slate-500 text-sm">Tracking Number</span>
                                          {order.trackingNumber && order.trackingNumber !== 'Pending' ? (
                                              <span className="text-lime-400 font-mono font-bold">{order.trackingNumber}</span>
                                          ) : (
                                              <span className="text-orange-400 text-xs">Not Assigned</span>
                                          )}
                                      </div>
                                      <Button 
                                          variant="outline" 
                                          className="w-full mt-2 border-slate-700 hover:bg-slate-800 text-slate-300"
                                          onClick={() => openTrackingModal(order)}
                                      >
                                          {order.trackingNumber && order.trackingNumber !== 'Pending' ? 'Edit Tracking Info' : 'Add Tracking Number'}
                                      </Button>
                                  </div>
                              </div>
                              
                              <div>
                                  <h5 className="text-sm font-bold text-white uppercase mb-4">Quick Actions</h5>
                                  <div className="flex gap-3">
                                      <Button variant="outline" className="flex-1 text-xs h-9 border-slate-700 text-slate-300"><Eye size={14}/> View Invoice</Button>
                                      <Button variant="outline" className="flex-1 text-xs h-9 border-slate-700 text-slate-300"><Download size={14}/> PDF Receipt</Button>
                                  </div>
                              </div>
                          </div>
                      </div>
                   </div>
                )}
             </div>
          ))}
       </div>

       {/* POS Modal */}
       <Modal isOpen={isPosOpen} onClose={() => setIsPosOpen(false)} title="New Showroom Order (POS)" className="max-w-5xl h-[80vh]">
          <div className="grid grid-cols-12 gap-6 h-full">
             {/* Product Selection */}
             <div className="col-span-7 flex flex-col h-full border-r border-slate-800 pr-6">
                <div className="mb-4">
                   <Input 
                     placeholder="Search Products..." 
                     value={searchProduct} 
                     onChange={(e) => setSearchProduct(e.target.value)} 
                     className="bg-slate-800 border-slate-700 text-white"
                   />
                </div>
                <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start">
                   {MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase())).map(product => (
                      <div key={product.id} onClick={() => addToCart(product)} className="p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-pointer hover:border-lime-500 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-sm text-white line-clamp-2">{product.name}</h4>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-lime-400 font-bold text-sm">Rs {product.price.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-500">Stock: {product.stock}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Cart & Checkout */}
             <div className="col-span-5 flex flex-col h-full">
                <div className="space-y-3 mb-4">
                   <Input placeholder="Customer Name" value={posCustomer.name} onChange={e => setPosCustomer({...posCustomer, name: e.target.value})} className="bg-slate-800 border-slate-700 text-white"/>
                   <Input placeholder="Phone Number" value={posCustomer.phone} onChange={e => setPosCustomer({...posCustomer, phone: e.target.value})} className="bg-slate-800 border-slate-700 text-white"/>
                </div>
                
                <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-slate-800 flex text-xs font-bold text-slate-500 uppercase">
                        <span className="flex-1">Item</span>
                        <span className="w-12 text-center">Qty</span>
                        <span className="w-20 text-right">Total</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {cart.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">No items added yet.</div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={idx} className="flex items-center text-sm group">
                                    <div className="flex-1 text-slate-300 truncate pr-2">{item.productName}</div>
                                    <div className="w-12 text-center text-white">{item.quantity}</div>
                                    <div className="w-20 text-right text-lime-400 font-medium">{item.total.toLocaleString()}</div>
                                    <button onClick={() => removeFromCart(item.productId)} className="ml-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 border-t border-slate-800 bg-slate-900">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-bold text-white">Total</span>
                            <span className="text-xl font-bold text-lime-400">Rs {cart.reduce((a,c) => a + c.total, 0).toLocaleString()}</span>
                        </div>
                        <Button className="w-full bg-slate-700 hover:bg-lime-500 hover:text-black text-white font-bold py-3" onClick={completeOrder}>
                           <Check size={18}/> Complete & Send Confirmation
                        </Button>
                    </div>
                </div>
             </div>
          </div>
       </Modal>

       {/* Tracking Number Modal */}
       <Modal isOpen={isTrackingModalOpen} onClose={() => setIsTrackingModalOpen(false)} title="Update Tracking Information" className="max-w-md">
            <div className="space-y-4">
                <p className="text-sm text-slate-400">
                    Enter the tracking number for order <span className="font-bold text-white">{editingTrackingOrder?.orderNumber}</span>.
                </p>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Tracking Number</label>
                    <div className="flex gap-2">
                        <Input 
                            value={newTrackingNumber} 
                            onChange={(e) => setNewTrackingNumber(e.target.value)}
                            placeholder="e.g. WX-TRK-12345"
                            className="flex-1"
                        />
                        <Button variant="secondary" onClick={generateTrackingNumber}>Generate</Button>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="ghost" onClick={() => setIsTrackingModalOpen(false)}>Cancel</Button>
                    <Button className="bg-lime-500 text-black font-bold" onClick={saveTrackingNumber}>Save Tracking Info</Button>
                </div>
            </div>
       </Modal>
    </div>
  );
};

export default Orders;
