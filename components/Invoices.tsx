import React, { useState } from 'react';
import { Plus, Download, Send, Trash2, FileText } from 'lucide-react';
import { Card, Button, Input, Badge } from './Shared';
import { Invoice, LineItem } from '../types';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Web Development Service', price: 1500 },
  { id: '2', name: 'UI/UX Design Package', price: 800 },
  { id: '3', name: 'SEO Optimization', price: 500 },
  { id: '4', name: 'Server Maintenance (Monthly)', price: 200 },
];

const Invoices = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [items, setItems] = useState<LineItem[]>([]);
  const [customer, setCustomer] = useState('');

  const addItem = (productId: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    setItems([...items, { productId: product.id, productName: product.name, quantity: 1, price: product.price, total: product.price }]);
  };

  const updateItem = (index: number, field: keyof LineItem, value: number) => {
    const newItems = [...items];
    const item = newItems[index];
    if (field === 'quantity') {
      item.quantity = value;
      item.total = item.price * value;
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold dark:text-white">Invoices & Quotes</h2>
          <Button onClick={() => setView('create')}><Plus size={18} /> Create New</Button>
        </div>
        
        <Card className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-xs">
              <tr>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Client</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm dark:text-slate-300">
              <tr className="border-b dark:border-slate-700">
                <td className="p-4 font-medium">INV-00123</td>
                <td className="p-4">TechCorp Inc.</td>
                <td className="p-4">Oct 24, 2023</td>
                <td className="p-4">$4,500.00</td>
                <td className="p-4"><Badge color="green">Paid</Badge></td>
                <td className="p-4"><Button variant="ghost" className="h-8 w-8 p-0"><Download size={16}/></Button></td>
              </tr>
              <tr className="border-b dark:border-slate-700">
                <td className="p-4 font-medium">INV-00124</td>
                <td className="p-4">Logistics Ltd</td>
                <td className="p-4">Oct 26, 2023</td>
                <td className="p-4">$1,200.00</td>
                <td className="p-4"><Badge color="yellow">Pending</Badge></td>
                <td className="p-4"><Button variant="ghost" className="h-8 w-8 p-0"><Download size={16}/></Button></td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
       <div className="flex items-center gap-4 mb-4">
         <Button variant="outline" onClick={() => setView('list')}>← Back</Button>
         <h2 className="text-2xl font-bold dark:text-white">New Quotation / Invoice</h2>
       </div>

       <div className="grid grid-cols-3 gap-6">
          {/* Builder Form */}
          <Card className="col-span-2 p-6 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium mb-1 dark:text-slate-300">Customer Name</label>
                   <Input placeholder="Enter client name" value={customer} onChange={e => setCustomer(e.target.value)} />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1 dark:text-slate-300">Invoice Date</label>
                   <Input type="date" />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium mb-2 dark:text-slate-300">Line Items</label>
                <div className="space-y-3">
                   {items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                         <div className="flex-1">
                            <p className="text-sm font-medium dark:text-white">{item.productName}</p>
                            <p className="text-xs text-slate-500">${item.price}</p>
                         </div>
                         <div className="w-20">
                            <Input 
                              type="number" 
                              min="1" 
                              value={item.quantity} 
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                            />
                         </div>
                         <div className="w-24 text-right font-medium dark:text-slate-200">
                            ${item.total}
                         </div>
                         <button onClick={() => removeItem(index)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <Trash2 size={16} />
                         </button>
                      </div>
                   ))}
                </div>
                
                <div className="mt-4 flex gap-2">
                   <select 
                     className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm"
                     onChange={(e) => { addItem(e.target.value); e.target.value = ''; }}
                   >
                      <option value="">+ Add Product</option>
                      {MOCK_PRODUCTS.map(p => (
                         <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                      ))}
                   </select>
                </div>
             </div>

             <div className="pt-4 border-t dark:border-slate-700">
                <label className="block text-sm font-medium mb-2 dark:text-slate-300">Notes / Terms</label>
                <textarea className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white" rows={3} placeholder="Payment due in 15 days..."></textarea>
             </div>
          </Card>

          {/* Preview & Actions */}
          <div className="space-y-6">
             <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 dark:text-white">Summary</h3>
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between dark:text-slate-300">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between dark:text-slate-300">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                   </div>
                   <div className="pt-3 border-t dark:border-slate-700 flex justify-between font-bold text-lg dark:text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                   </div>
                </div>
             </Card>

             <Card className="p-4 space-y-3">
                <Button className="w-full justify-center"><Send size={16}/> Send via WhatsApp</Button>
                <Button variant="outline" className="w-full justify-center"><FileText size={16}/> Export PDF</Button>
                <Button variant="secondary" className="w-full justify-center">Save Draft</Button>
             </Card>
          </div>
       </div>
    </div>
  );
};

export default Invoices;