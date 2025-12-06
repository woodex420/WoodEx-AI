
import React, { useState, useRef } from 'react';
import { Upload, Download, Plus, Filter, Package, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import { Card, Button, Input, Badge, Modal } from './Shared';
import { Product } from '../types';

const MOCK_INVENTORY: Product[] = [
  { id: '1', name: 'Royal Prestige CEO Desk', category: 'Executive', price: 450000, stock: 0, sku: 'WDX-CEO-001', image: '', status: 'Out of Stock' },
  { id: '2', name: 'Imperial Luxury CEO Desk', category: 'Executive', price: 520000, stock: 0, sku: 'WDX-CEO-002', image: '', status: 'Out of Stock' },
  { id: '3', name: 'Modular Hybrid Workstation', category: 'Workstations', price: 85000, stock: 0, sku: 'WDX-WS-001', image: '', status: 'Out of Stock' },
  { id: '4', name: 'ErgoMaster High Back Chair', category: 'Seating', price: 45000, stock: 12, sku: 'WDX-CHR-005', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=200&h=200&fit=crop', status: 'Active' },
  { id: '5', name: 'Executive File Cabinet', category: 'Storage', price: 35000, stock: 5, sku: 'WDX-STR-012', image: '', status: 'Low Stock' },
];

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              const text = event.target?.result as string;
              // Simple CSV parsing logic (skipping header row)
              const rows = text.split('\n').slice(1);
              const newProducts: Product[] = rows.map((row, idx) => {
                  const cols = row.split(',');
                  if (cols.length < 5) return null;
                  return {
                      id: `csv-${Date.now()}-${idx}`,
                      name: cols[1]?.trim() || 'Unknown Product',
                      category: cols[2]?.trim() || 'General',
                      price: parseFloat(cols[9]?.replace(/[" ,]/g, '') || '0'),
                      stock: 10, // Default stock for imported items
                      sku: cols[4]?.trim() || `SKU-${idx}`,
                      image: '',
                      status: 'Active'
                  } as Product;
              }).filter(p => p !== null) as Product[];

              setProducts([...newProducts, ...products]);
              alert(`Imported ${newProducts.length} products successfully.`);
          };
          reader.readAsText(file);
      }
  };

  const handleAddNew = () => {
      setEditingProduct({
          id: Date.now().toString(),
          name: '',
          category: 'Furniture',
          price: 0,
          stock: 0,
          sku: '',
          image: '',
          status: 'Active'
      });
      setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
      setEditingProduct({ ...product });
      setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this product?')) {
          setProducts(products.filter(p => p.id !== id));
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setEditingProduct(prev => ({ ...prev, image: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveProduct = () => {
      if (!editingProduct.name || !editingProduct.price) {
          alert("Please fill in required fields (Name, Price).");
          return;
      }

      let status: Product['status'] = 'Active';
      if ((editingProduct.stock || 0) === 0) status = 'Out of Stock';
      else if ((editingProduct.stock || 0) <= 10) status = 'Low Stock';

      const finalProduct = { ...editingProduct, status } as Product;

      if (products.find(p => p.id === finalProduct.id)) {
          // Update existing
          setProducts(products.map(p => p.id === finalProduct.id ? finalProduct : p));
      } else {
          // Create new
          setProducts([finalProduct, ...products]);
      }
      setIsModalOpen(false);
  };

  const handleStockChange = (id: string, newStock: number) => {
      if (isNaN(newStock) || newStock < 0) return;
      
      const updatedProducts = products.map(p => {
          if (p.id === id) {
              let status: Product['status'] = 'Active';
              if (newStock === 0) status = 'Out of Stock';
              else if (newStock <= 10) status = 'Low Stock';
              
              return { ...p, stock: newStock, status };
          }
          return p;
      });
      setProducts(updatedProducts);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header & Stats */}
       <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Product Catalog</h2>
            <p className="text-slate-500">Manage your product inventory and pricing</p>
          </div>
          <div className="flex gap-2">
             <input type="file" ref={csvInputRef} className="hidden" accept=".csv" onChange={handleImportCSV} />
             <Button variant="outline" onClick={() => csvInputRef.current?.click()}><Upload size={16}/> Import CSV</Button>
             <Button variant="outline"><Download size={16}/> Export</Button>
             <Button className="bg-cyan-500 hover:bg-cyan-600 text-white border-none" onClick={handleAddNew}>
                 <Plus size={16}/> Add Product
             </Button>
          </div>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-slate-800 border-slate-700">
             <p className="text-xs font-bold text-slate-500 uppercase">Total Products</p>
             <h3 className="text-2xl font-bold text-white mt-1">{products.length}</h3>
          </Card>
          <Card className="p-4 bg-slate-800 border-slate-700">
             <p className="text-xs font-bold text-green-500 uppercase">In Stock</p>
             <h3 className="text-2xl font-bold text-green-400 mt-1">{products.filter(p => p.stock > 10).length}</h3>
          </Card>
          <Card className="p-4 bg-slate-800 border-slate-700">
             <p className="text-xs font-bold text-orange-500 uppercase">Low Stock</p>
             <h3 className="text-2xl font-bold text-orange-400 mt-1">{products.filter(p => p.stock > 0 && p.stock <= 10).length}</h3>
          </Card>
          <Card className="p-4 bg-slate-800 border-slate-700">
             <p className="text-xs font-bold text-red-500 uppercase">Out of Stock</p>
             <h3 className="text-2xl font-bold text-red-400 mt-1">{products.filter(p => p.stock === 0).length}</h3>
          </Card>
       </div>

       {/* Toolbar */}
       <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
          <div className="relative flex-1">
             <Input 
                placeholder="Search products..." 
                className="bg-slate-800 border-slate-700 text-white" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300"><Filter size={16}/> Filter</Button>
       </div>

       {/* List */}
       <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
          <table className="w-full text-left border-collapse">
             <thead className="bg-slate-800 text-slate-400 text-xs uppercase font-bold">
                <tr>
                   <th className="p-4">Product Info</th>
                   <th className="p-4">Category</th>
                   <th className="p-4">Price</th>
                   <th className="p-4">Stock (Direct Edit)</th>
                   <th className="p-4">Status</th>
                   <th className="p-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-800 text-sm">
                {filteredProducts.map(product => (
                   <tr key={product.id} className="hover:bg-slate-800/50">
                      <td className="p-4">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-700 rounded overflow-hidden flex items-center justify-center text-slate-500 text-xs shrink-0">
                                {product.image ? (
                                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span>IMG</span>
                                )}
                            </div>
                            <div>
                               <h4 className="font-bold text-white">{product.name}</h4>
                               <p className="text-xs text-slate-500">{product.sku}</p>
                            </div>
                         </div>
                      </td>
                      <td className="p-4">
                         <Badge color="gray">{product.category}</Badge>
                      </td>
                      <td className="p-4 font-bold text-white">Rs {product.price.toLocaleString()}</td>
                      <td className="p-4">
                         <div className="flex flex-col gap-2 max-w-[100px]">
                            <Input 
                                type="number" 
                                value={product.stock}
                                onChange={(e) => handleStockChange(product.id, parseInt(e.target.value))}
                                className={`h-8 text-center font-bold ${
                                    product.stock === 0 ? 'border-red-500 text-red-500 bg-red-900/10' :
                                    product.stock <= 10 ? 'border-orange-500 text-orange-500 bg-orange-900/10' :
                                    'border-slate-600 text-white'
                                }`}
                            />
                            <div className="h-1.5 bg-slate-700 rounded-full w-full overflow-hidden">
                               <div 
                                   className={`h-full transition-all duration-300 ${product.stock === 0 ? 'bg-red-500' : product.stock <= 10 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                   style={{width: `${Math.min(product.stock * 5, 100)}%`}}
                               ></div>
                            </div>
                         </div>
                      </td>
                      <td className="p-4">
                         <span className={`text-xs font-bold px-2 py-1 rounded border ${
                            product.status === 'Active' ? 'border-green-800 text-green-400 bg-green-900/20' :
                            product.status === 'Low Stock' ? 'border-orange-800 text-orange-400 bg-orange-900/20' :
                            'border-red-800 text-red-400 bg-red-900/20'
                         }`}>
                            {product.status.toUpperCase()}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                         <Button variant="ghost" className="text-slate-400 hover:text-white mr-2" onClick={() => handleEdit(product)}>Edit</Button>
                         <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-900/20" onClick={() => handleDelete(product.id)}><Trash2 size={16}/></Button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Add/Edit Product Modal */}
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct.id ? "Edit Product" : "Add Product"} className="max-w-lg">
           <div className="space-y-4">
               {/* Image Upload */}
               <div className="flex flex-col items-center mb-6">
                   <div className="w-32 h-32 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden relative group">
                       {editingProduct.image ? (
                           <>
                               <img src={editingProduct.image} alt="Product" className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Button variant="ghost" className="text-white text-xs" onClick={() => fileInputRef.current?.click()}>Change</Button>
                               </div>
                           </>
                       ) : (
                           <div className="text-center p-4 cursor-pointer hover:bg-slate-700/50 w-full h-full flex flex-col items-center justify-center" onClick={() => fileInputRef.current?.click()}>
                               <ImageIcon className="text-slate-500 mb-2" size={24}/>
                               <span className="text-xs text-slate-400">Upload Image</span>
                           </div>
                       )}
                   </div>
                   <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*" 
                       onChange={handleImageUpload} 
                   />
                   {editingProduct.image && (
                       <Button variant="ghost" className="text-red-400 text-xs mt-2 h-6" onClick={() => setEditingProduct({...editingProduct, image: ''})}>Remove Image</Button>
                   )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                       <Input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="mt-1" />
                   </div>
                   <div>
                       <label className="text-xs font-bold text-slate-500 uppercase">SKU</label>
                       <Input value={editingProduct.sku} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} className="mt-1" />
                   </div>
                   <div>
                       <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                       <Input value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="mt-1" />
                   </div>
                   <div>
                       <label className="text-xs font-bold text-slate-500 uppercase">Price (Rs)</label>
                       <Input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="mt-1" />
                   </div>
                   <div>
                       <label className="text-xs font-bold text-slate-500 uppercase">Stock</label>
                       <Input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} className="mt-1" />
                   </div>
                   <div className="col-span-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                       <select 
                          value={editingProduct.status} 
                          onChange={e => setEditingProduct({...editingProduct, status: e.target.value as any})}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white mt-1"
                       >
                           <option value="Active">Active</option>
                           <option value="Low Stock">Low Stock</option>
                           <option value="Out of Stock">Out of Stock</option>
                       </select>
                   </div>
               </div>

               <div className="flex justify-end gap-2 mt-6">
                   <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                   <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold" onClick={handleSaveProduct}>Save Product</Button>
               </div>
           </div>
       </Modal>
    </div>
  );
};

export default ProductCatalog;
