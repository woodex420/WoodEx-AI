
import React, { useState } from 'react';
import { Plus, Download, Send, FileText, Palette, Check, ArrowRight } from 'lucide-react';
import { Card, Button, Input, Badge } from './Shared';
import { Quotation, Product, LineItem } from '../types';

// Mock Products for selection
const PRODUCTS: Product[] = [
  { id: '1', name: 'Workstation', category: 'Furniture', price: 125000, stock: 10, sku: 'WDX-001', image: '', status: 'Active' },
  { id: '2', name: 'Cubicle workstation', category: 'Furniture', price: 52000, stock: 25, sku: 'WDX-002', image: '', status: 'Active' },
  { id: '3', name: 'Executive Desk', category: 'Furniture', price: 195000, stock: 2, sku: 'WDX-003', image: '', status: 'Low Stock' },
];

const Quotations = () => {
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  
  // Builder State
  const [items, setItems] = useState<LineItem[]>([]);
  const [client, setClient] = useState({ name: 'Akmal Bukhari', phone: '92 301 4236808' });
  const [terms, setTerms] = useState({
      validity: '15 Days',
      deliveryTime: '8 to 10 Days',
      transportation: 'Outstation charges depend on city, quantity and load',
      taxes: 'The above quote excludes all applicable taxes.'
  });

  const addItem = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    setItems([...items, { 
        productId: product.id, 
        productName: product.name, 
        description: '4 Person workstation make in ms base 18g with powder coating top lamination mdf tactile size 8 x 4 mobile unit with 3 drawer top frosted glass acrylic 5mm',
        quantity: 1, 
        price: product.price, 
        total: product.price 
    }]);
  };

  const updateItem = (index: number, quantity: number) => {
     const newItems = [...items];
     newItems[index].quantity = quantity;
     newItems[index].total = newItems[index].price * quantity;
     setItems(newItems);
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + item.total, 0);
  const subtotal = calculateSubtotal();

  if (view === 'list') {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="p-6 bg-slate-800 border-slate-700">
              <p className="text-slate-400 text-sm">Total Quotations</p>
              <h3 className="text-3xl font-bold text-white mt-2">142</h3>
           </Card>
           <Card className="p-6 bg-slate-800 border-slate-700">
              <p className="text-slate-400 text-sm">Approved</p>
              <h3 className="text-3xl font-bold text-green-400 mt-2">45</h3>
           </Card>
           <Card className="p-6 bg-slate-800 border-slate-700">
              <p className="text-slate-400 text-sm">Pending Value</p>
              <h3 className="text-3xl font-bold text-blue-400 mt-2">$1.2M</h3>
           </Card>
        </div>

        <div className="flex justify-between items-center">
           <div className="flex gap-2">
              <Button variant="secondary" className="bg-white dark:bg-slate-800">All Quotations</Button>
              <Button variant="ghost">Pending</Button>
              <Button variant="ghost">Approved</Button>
              <Button variant="ghost">Rejected</Button>
           </div>
           <Button className="bg-lime-500 hover:bg-lime-600 text-slate-900 font-bold" onClick={() => setView('builder')}>
              <Plus size={18} /> New Quotation
           </Button>
        </div>

        {/* List */}
        <div className="space-y-4">
           {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-500 transition-all cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center text-slate-400 font-bold">QT</div>
                    <div>
                       <h4 className="font-bold text-white flex items-center gap-2">
                          WF-1010{i+3} <Badge color="gray">Pending</Badge>
                       </h4>
                       <p className="text-sm text-slate-400">Pachem Global • {items.length + 2} Items • 2025-01-22</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-slate-500">Total Amount</p>
                    <p className="text-xl font-bold text-lime-400">45,000</p>
                 </div>
              </div>
           ))}
        </div>
      </div>
    );
  }

  return (
     <div className="h-[calc(100vh-100px)] flex flex-col animate-fade-in">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setView('list')}>← Back</Button>
              <h2 className="text-2xl font-bold dark:text-white">Quotation Builder</h2>
           </div>
           <div className="flex gap-2">
              <Button variant={activeTab === 'content' ? 'primary' : 'ghost'} onClick={() => setActiveTab('content')}>Content</Button>
              <Button variant={activeTab === 'style' ? 'primary' : 'ghost'} onClick={() => setActiveTab('style')}><Palette size={16}/> Terms</Button>
           </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
           {/* Editor Panel */}
           <Card className="flex flex-col p-6 overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              {activeTab === 'content' ? (
                 <div className="space-y-6">
                    <div>
                       <label className="text-sm font-semibold dark:text-slate-300">Client Details</label>
                       <div className="grid grid-cols-2 gap-2 mt-2">
                            <Input placeholder="Client Name" value={client.name} onChange={e => setClient({...client, name: e.target.value})} />
                            <Input placeholder="Phone" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} />
                       </div>
                    </div>
                    
                    <div>
                       <label className="text-sm font-semibold dark:text-slate-300 mb-2 block">Line Items</label>
                       <select className="w-full p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 mb-4" onChange={(e) => addItem(e.target.value)}>
                          <option>+ Add Product</option>
                          {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price}</option>)}
                       </select>

                       <div className="space-y-2">
                          {items.map((item, idx) => (
                             <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-700">
                                <div className="flex justify-between mb-2">
                                    <p className="font-medium dark:text-white">{item.productName}</p>
                                    <p className="text-xs text-slate-500 font-mono">Qty: <input type="number" value={item.quantity} onChange={(e) => updateItem(idx, parseInt(e.target.value))} className="w-12 bg-slate-900 text-center border border-slate-600 rounded"/></p>
                                </div>
                                <textarea 
                                    className="w-full bg-slate-900 text-xs text-slate-400 p-2 rounded mb-2 h-16"
                                    value={item.description}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[idx].description = e.target.value;
                                        setItems(newItems);
                                    }}
                                />
                                <div className="text-right font-bold text-white">Rs {item.total.toLocaleString()}</div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="space-y-6">
                    <h3 className="font-bold text-white">Terms & Conditions</h3>
                    <div>
                       <label className="text-sm font-semibold dark:text-slate-300">Quotation Validity</label>
                       <Input value={terms.validity} onChange={e => setTerms({...terms, validity: e.target.value})} className="mt-2"/>
                    </div>
                    <div>
                       <label className="text-sm font-semibold dark:text-slate-300">Delivery Time</label>
                       <Input value={terms.deliveryTime} onChange={e => setTerms({...terms, deliveryTime: e.target.value})} className="mt-2"/>
                    </div>
                    <div>
                       <label className="text-sm font-semibold dark:text-slate-300">Transportation</label>
                       <textarea className="w-full bg-slate-900 border-slate-700 rounded p-2 text-sm text-white mt-2" rows={3} value={terms.transportation} onChange={e => setTerms({...terms, transportation: e.target.value})}/>
                    </div>
                    <div>
                       <label className="text-sm font-semibold dark:text-slate-300">Taxes</label>
                       <Input value={terms.taxes} onChange={e => setTerms({...terms, taxes: e.target.value})} className="mt-2"/>
                    </div>
                 </div>
              )}
           </Card>

           {/* PDF Preview Panel - Replicating WoodEx Style */}
           <div className="bg-slate-800 p-8 rounded-xl overflow-y-auto flex justify-center items-start shadow-inner">
              <div className="bg-white w-full max-w-[595px] min-h-[842px] shadow-2xl p-8 relative text-slate-900 text-[10px]" style={{fontFamily: 'Arial, sans-serif'}}>
                 
                 {/* Header Bar */}
                 <div className="bg-slate-200 h-4 absolute top-8 left-0 right-0 flex justify-between px-8 items-center">
                    <span className="font-bold">Date</span>
                    <span className="font-bold">4/12/2025</span>
                 </div>

                 {/* Branding */}
                 <div className="mt-8 flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center font-bold text-white text-lg">W</div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">WoodEx Furniture</h1>
                            <p className="text-slate-500 max-w-[200px]">LG 89 Zainab Tower, Model Town, Link Road, Lahore</p>
                            <p className="font-bold">92 322 4000768</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-slate-400 uppercase">Quotation</h2>
                        <div className="border-t-2 border-slate-200 mt-2 pt-1">
                            <p className="font-bold text-sm">NO. WF-10136</p>
                        </div>
                    </div>
                 </div>

                 {/* Client Info */}
                 <div className="flex mb-6">
                     <div className="w-20 font-bold text-slate-600">
                         <p>Company</p>
                         <p>Ph:</p>
                     </div>
                     <div>
                         <p className="font-bold">{client.name}</p>
                         <p>{client.phone}</p>
                     </div>
                 </div>

                 {/* Table */}
                 <table className="w-full mb-8 border-collapse">
                    <thead className="bg-green-700 text-white uppercase font-bold text-center">
                       <tr>
                          <th className="p-1 w-8 border border-white">Sr:</th>
                          <th className="p-1 w-24 border border-white">Item</th>
                          <th className="p-1 text-left border border-white">DESCRIPTION</th>
                          <th className="p-1 w-10 border border-white">QTY</th>
                          <th className="p-1 w-20 border border-white">UNIT PRICE</th>
                          <th className="p-1 w-24 border border-white">TOTAL</th>
                       </tr>
                    </thead>
                    <tbody className="text-xs">
                       {items.map((item, i) => (
                          <React.Fragment key={i}>
                            <tr className="border border-slate-300">
                                <td className="p-2 text-center align-top border-r border-slate-300">{i+1}</td>
                                <td className="p-2 font-bold align-top border-r border-slate-300">{item.productName}</td>
                                <td className="p-2 align-top border-r border-slate-300">
                                    {item.description}
                                </td>
                                <td className="p-2 text-center align-top border-r border-slate-300">{item.quantity}</td>
                                <td className="p-2 text-right align-top border-r border-slate-300">{item.price.toFixed(2)}</td>
                                <td className="p-2 text-right align-top">{item.total.toFixed(2)}</td>
                            </tr>
                            {/* Spacer rows to mimic grid look if needed */}
                          </React.Fragment>
                       ))}
                       {/* Empty rows filler */}
                       {[1,2].map(k => (
                           <tr key={`empty-${k}`} className="border border-slate-300 h-6">
                               <td className="border-r border-slate-300"></td>
                               <td className="border-r border-slate-300"></td>
                               <td className="border-r border-slate-300"></td>
                               <td className="border-r border-slate-300"></td>
                               <td className="border-r border-slate-300"></td>
                               <td className="text-right p-1 text-slate-300">0.00</td>
                           </tr>
                       ))}
                    </tbody>
                 </table>

                 {/* Summary Block */}
                 <div className="flex justify-end mb-8">
                    <div className="w-64">
                        <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="font-bold text-slate-600">SUBTOTAL</span>
                            <span className="font-bold">Rs: {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-600">Rent</span>
                            <span>Rs: 0</span>
                        </div>
                         <div className="flex justify-between py-1 border-b border-slate-200 bg-slate-100">
                            <span className="font-bold text-slate-600">SUBTOTAL DISCOUNT</span>
                            <span className="font-bold">Rs: {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-600">Advance</span>
                            <span>Rs: 0</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-600 text-[10px] font-bold">TOTAL TAX</span>
                            <span>Rs: 0</span>
                        </div>
                         <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-600 text-[10px] font-bold">SHIPPING/HANDLING</span>
                            <span>Rs: 0</span>
                        </div>
                        <div className="flex justify-between py-2 border-b-2 border-black mt-1">
                            <span className="font-bold text-sm">Balance Due</span>
                            <span className="font-bold text-sm">Rs: {subtotal.toLocaleString()}</span>
                        </div>
                    </div>
                 </div>

                 {/* Terms */}
                 <div className="text-[10px] space-y-1 mb-10">
                     <div className="grid grid-cols-[120px_1fr]">
                         <span className="font-bold">Quotation Validity</span>
                         <span>{terms.validity}</span>
                     </div>
                     <div className="grid grid-cols-[120px_1fr]">
                         <span className="font-bold">DeliveryTime</span>
                         <span>{terms.deliveryTime}</span>
                     </div>
                     <div className="grid grid-cols-[120px_1fr]">
                         <span className="font-bold">Transportation</span>
                         <span>{terms.transportation}</span>
                     </div>
                     <div className="grid grid-cols-[120px_1fr]">
                         <span className="font-bold">Taxes</span>
                         <span>{terms.taxes}</span>
                     </div>
                 </div>

                 {/* Footer Bar */}
                 <div className="bg-slate-300 h-6 absolute bottom-0 left-0 right-0 flex items-center justify-center">
                    <span className="font-bold text-slate-600">THANK YOU FOR YOUR BUSINESS!</span>
                 </div>
                 <div className="absolute bottom-0 right-0 h-6 w-20 bg-lime-500"></div>
                 <div className="absolute bottom-0 right-20 h-6 w-20 bg-green-700"></div>

              </div>
           </div>
        </div>

        {/* Action Bar */}
        <div className="h-16 bg-white dark:bg-slate-800 border-t dark:border-slate-700 mt-4 flex items-center justify-between px-6 rounded-lg">
           <span className="text-sm text-slate-500">Draft saved automatically</span>
           <div className="flex gap-3">
              <Button variant="outline"><FileText size={16}/> Export PDF</Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white"><Send size={16}/> WhatsApp PDF</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white"><ArrowRight size={16}/> Create Invoice</Button>
           </div>
        </div>
     </div>
  );
};

export default Quotations;
