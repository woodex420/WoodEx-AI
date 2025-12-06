
import React, { useState } from 'react';
import { Search, Plus, Calendar, Settings, Trash2, CheckSquare, Square, Tag, Mail } from 'lucide-react';
import { Contact, LeadStatus, Task } from '../types';
import { Badge, Button, Input, Modal } from './Shared';

// Mock Data matching the screenshot style
const MOCK_LEADS: Contact[] = [
  {
    id: '1', sr: 9, date: '10/01/2025', company: 'Green Brain', name: 'Hassan', contact: '333 4405830',
    designation: 'CEO', location: 'Etihad Town Raiwind Rd', leadSource: 'Client', category: 'Furniture',
    assignee: 'Abdullah', quotationStatus: 'Done', lastContact: '-', phone: '+92 333 4405830', email: 'hassan@greenbrain.com',
    avatar: 'https://ui-avatars.com/api/?name=Hassan&background=0D8ABC&color=fff', status: LeadStatus.CLIENT,
    messages: [], tags: [], customFields: { "Budget": "$5k" }, score: 85,
    tasks: [{id: 't1', text: 'Send updated catalogue', completed: false}]
  },
  {
    id: '2', sr: 11, date: '17/01/2025', company: 'Total Parco', name: 'Noman Ahmad', contact: '304 0101317',
    designation: 'Procurement', location: 'Kot ADDU Multan', leadSource: 'New Lead', category: 'Furniture',
    assignee: 'Abdullah', quotationStatus: 'Done', lastContact: '-', phone: '+92 304 0101317', email: 'noman@totalparco.com',
    avatar: 'https://ui-avatars.com/api/?name=Noman&background=random', status: LeadStatus.NEW,
    messages: [], tags: [], score: 40
  },
  {
    id: '3', sr: 1, date: '01/01/2025', company: 'Shareef Edu', name: 'Amir', contact: '300 4326428',
    designation: 'Procurement', location: 'Jati Umra Lahore', leadSource: 'New Lead', category: 'Project',
    assignee: 'Nabeel', quotationStatus: 'Proposal/Quotation', lastContact: '27/01/2025', phone: '+92 300 4326428', email: 'amir@shareef.edu',
    avatar: 'https://ui-avatars.com/api/?name=Amir&background=random', status: LeadStatus.PROPOSAL,
    messages: [], tags: [], score: 65
  },
];

interface CustomFieldDef {
  name: string;
  type: 'text' | 'number' | 'date';
}

interface ScoringRule {
  id: string;
  field: string;
  condition: 'contains' | 'greaterThan' | 'equals';
  value: string;
  points: number;
}

const TEAM_MEMBERS = ['Abdullah', 'Nabeel', 'Imtiaz', 'Admin'];

const LeadGeneration = () => {
  const [leads, setLeads] = useState<Contact[]>(MOCK_LEADS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom columns state with types
  const [customFieldsConfig, setCustomFieldsConfig] = useState<CustomFieldDef[]>([{name: 'Budget', type: 'text'}]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'date'>('text');
  
  // CSV Import Ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Scoring Rules State
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([
     { id: '1', field: 'phone', condition: 'contains', value: '92', points: 10 },
     { id: '2', field: 'Budget', condition: 'contains', value: '5k', points: 20 },
  ]);

  // New Lead Form State
  const [newLead, setNewLead] = useState<Partial<Contact>>({
    company: '',
    name: '',
    contact: '',
    email: '',
    designation: '',
    location: '',
    assignee: TEAM_MEMBERS[0],
    status: LeadStatus.NEW,
    customFields: {}
  });

  const getSourceBadge = (source: string | undefined) => {
     if (source === 'Client') return <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded font-medium">CLIENT</span>
     return <span className="bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200 text-xs px-2 py-1 rounded font-medium">NEW LEAD</span>
  };

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };

  const handleAddCustomField = () => {
    if (newFieldName && !customFieldsConfig.find(c => c.name === newFieldName)) {
      setCustomFieldsConfig([...customFieldsConfig, { name: newFieldName, type: newFieldType }]);
      setNewFieldName('');
      setNewFieldType('text'); // Reset to default
      setIsFieldModalOpen(false);
    }
  };

  const handleRemoveCustomField = (name: string) => {
    setCustomFieldsConfig(customFieldsConfig.filter(c => c.name !== name));
  };

  const calculateScore = (lead: Partial<Contact>) => {
      let score = 0;
      // Base score for completeness
      if (lead.phone) score += 10;
      if (lead.email) score += 10;
      if (lead.company) score += 10;

      // Apply Rules
      scoringRules.forEach(rule => {
          if (rule.field === 'phone' && lead.phone?.includes(rule.value)) score += rule.points;
          // Check Custom Fields
          if (lead.customFields && lead.customFields[rule.field]) {
              const val = lead.customFields[rule.field];
              if (rule.condition === 'contains' && val.includes(rule.value)) score += rule.points;
              if (rule.condition === 'equals' && val === rule.value) score += rule.points;
          }
      });
      return Math.min(score, 100);
  };

  const sendEmailNotification = (lead: Contact) => {
    // Placeholder for Email Service Integration (e.g., SendGrid, AWS SES, Nodemailer)
    const subject = `New Lead Assigned: ${lead.name}`;
    const body = `
      Hi ${lead.assignee},
      
      A new lead has been assigned to you.
      
      Name: ${lead.name}
      Company: ${lead.company}
      Contact: ${lead.contact}
      Email: ${lead.email}
      
      Please follow up within 24 hours.
    `;
    
    // In a real app, this would be an API call
    console.log(`[Email Service Simulator] Sending email to assignee (${lead.assignee})...`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    
    alert(`[Email Sent] Notification sent to ${lead.assignee} regarding new lead ${lead.name}.`);
  };

  const handleCreateLead = () => {
    const createdLead: Contact = {
      id: Date.now().toString(),
      sr: leads.length + 1,
      date: new Date().toLocaleDateString('en-GB'),
      company: newLead.company || 'Unknown',
      name: newLead.name || 'Unknown',
      contact: newLead.contact || '',
      phone: newLead.contact || '',
      email: newLead.email || '',
      designation: newLead.designation || '',
      location: newLead.location || '',
      status: newLead.status as LeadStatus,
      assignee: newLead.assignee || 'Unassigned',
      messages: [],
      tags: [],
      customFields: newLead.customFields || {},
      leadSource: 'Manual',
      quotationStatus: 'Pending',
      lastContact: '-',
      avatar: `https://ui-avatars.com/api/?name=${newLead.name || 'User'}&background=random`,
      score: calculateScore(newLead)
    };

    setLeads([createdLead, ...leads]);
    sendEmailNotification(createdLead);
    setIsAddModalOpen(false);
    setNewLead({ company: '', name: '', contact: '', email: '', designation: '', location: '', assignee: TEAM_MEMBERS[0], status: LeadStatus.NEW, customFields: {} });
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              const text = event.target?.result as string;
              // Simple CSV Parsing (Assumes Header Row)
              const rows = text.split('\n').slice(1);
              const newLeads: Contact[] = rows.map((row, idx) => {
                  const cols = row.split(',');
                  if (cols.length < 3) return null;
                  return {
                      id: `csv-${Date.now()}-${idx}`,
                      sr: leads.length + idx + 1,
                      date: new Date().toLocaleDateString('en-GB'),
                      company: cols[0]?.trim() || 'Imported',
                      name: cols[1]?.trim() || 'Unknown',
                      phone: cols[2]?.trim() || '',
                      status: LeadStatus.NEW,
                      assignee: 'Unassigned',
                      messages: [],
                      tags: ['Imported'],
                      customFields: {},
                      avatar: `https://ui-avatars.com/api/?name=${cols[1]?.trim() || 'User'}&background=random`
                  } as Contact;
              }).filter(l => l !== null) as Contact[];
              
              setLeads([...newLeads, ...leads]);
              alert(`Imported ${newLeads.length} leads successfully.`);
          };
          reader.readAsText(file);
      }
  };

  const handleLeadClick = (lead: Contact) => {
      setSelectedLead(lead);
      setIsDetailsModalOpen(true);
  };

  // Task Management in Details Modal
  const [newTaskText, setNewTaskText] = useState('');
  const addTaskToLead = () => {
      if (!selectedLead || !newTaskText) return;
      const newTask: Task = { id: Date.now().toString(), text: newTaskText, completed: false };
      const updatedLead = { ...selectedLead, tasks: [...(selectedLead.tasks || []), newTask] };
      setSelectedLead(updatedLead);
      setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
      setNewTaskText('');
  };
  const toggleTask = (taskId: string) => {
      if (!selectedLead) return;
      const updatedTasks = selectedLead.tasks?.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      const updatedLead = { ...selectedLead, tasks: updatedTasks };
      setSelectedLead(updatedLead);
      setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
  };
  const removeTask = (taskId: string) => {
     if (!selectedLead) return;
     const updatedTasks = selectedLead.tasks?.filter(t => t.id !== taskId);
     const updatedLead = { ...selectedLead, tasks: updatedTasks };
     setSelectedLead(updatedLead);
     setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
  };

  const filteredLeads = leads.filter(lead => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = lead.name.toLowerCase().includes(q) || 
                            lead.company.toLowerCase().includes(q) ||
                            (lead.customFields && Object.values(lead.customFields).some(v => v.toLowerCase().includes(q)));
      return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
         <div className="p-4 bg-slate-700/50 flex justify-between items-center text-white">
            <span className="font-bold">NEW LEAD</span>
            <span className="text-xl font-bold">{leads.filter(l => l.status === LeadStatus.NEW).length}</span>
         </div>
         <div className="p-4 bg-slate-700/50 flex justify-between items-center text-white">
            <span className="font-bold">DONE</span>
            <span className="text-xl font-bold">19</span>
         </div>
         <div className="p-4 bg-slate-700/50 flex justify-between items-center text-white">
            <span className="font-bold">WON</span>
            <span className="text-xl font-bold">{leads.filter(l => l.status === LeadStatus.WON).length}</span>
         </div>
         <div className="p-4 bg-slate-700/50 flex justify-between items-center text-white">
            <span className="font-bold">TOTAL</span>
            <span className="text-xl font-bold">{leads.length}</span>
         </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-1 overflow-x-auto pb-2 items-center">
           <Button variant="outline" className="whitespace-nowrap"><Calendar size={14}/> Date Range</Button>
           <Button variant="outline" className="whitespace-nowrap">All Sources</Button>
           <Button variant="outline" className="whitespace-nowrap">All Categories</Button>
           <Button variant="outline" className="whitespace-nowrap" onClick={() => setIsFieldModalOpen(true)}>
             <Settings size={14}/> Custom Fields
           </Button>
           <Button variant="outline" className="whitespace-nowrap" onClick={() => setIsScoreModalOpen(true)}>
             <Tag size={14}/> Scoring Rules
           </Button>
           <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <Input 
                 placeholder="Search (Name, Company, Custom Fields)..." 
                 className="pl-9 h-10" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>
        <div className="flex gap-2">
           <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleImportCSV} />
           <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Import CSV</Button>
           <Button className="bg-lime-500 hover:bg-lime-600 text-white border-none" onClick={() => setIsAddModalOpen(true)}>
             <Plus size={18}/> Add Lead
           </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 rounded-lg overflow-x-auto border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-teal-900/50 text-teal-100 text-xs uppercase font-bold whitespace-nowrap">
              <tr>
                <th className="p-4 w-10"><input type="checkbox" className="rounded bg-slate-700 border-slate-600"/></th>
                <th className="p-4">SR</th>
                <th className="p-4">Score</th>
                <th className="p-4">Date</th>
                <th className="p-4">Company</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Location</th>
                {customFieldsConfig.map(f => <th key={f.name} className="p-4 text-lime-400">{f.name}</th>)}
                <th className="p-4">Lead Source</th>
                <th className="p-4">Category</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Quotation</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300 divide-y divide-slate-800 whitespace-nowrap">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => handleLeadClick(lead)}>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded bg-slate-700 border-slate-600"/></td>
                  <td className="p-4 text-slate-500">{lead.sr}</td>
                  <td className="p-4">
                      {lead.score !== undefined && (
                          <div className="flex items-center gap-1">
                              <span className={`text-xs font-bold ${lead.score > 70 ? 'text-green-400' : lead.score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {lead.score}
                              </span>
                              <div className="w-10 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div className={`h-full ${lead.score > 70 ? 'bg-green-500' : lead.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${lead.score}%`}}></div>
                              </div>
                          </div>
                      )}
                  </td>
                  <td className="p-4">{lead.date}</td>
                  <td className="p-4 font-bold text-white">{lead.company}</td>
                  <td className="p-4">{lead.name}</td>
                  <td className="p-4 font-mono text-xs">{lead.contact}</td>
                  <td className="p-4 italic text-slate-400">{lead.designation}</td>
                  <td className="p-4 truncate max-w-[150px]" title={lead.location}>{lead.location}</td>
                  {customFieldsConfig.map(f => (
                    <td key={f.name} className="p-4 text-slate-400">{lead.customFields?.[f.name] || '-'}</td>
                  ))}
                  <td className="p-4">{getSourceBadge(lead.leadSource)}</td>
                  <td className="p-4"><React.Fragment><Badge color="purple">{lead.category}</Badge></React.Fragment></td>
                  <td className="p-4 text-blue-300">{lead.assignee}</td>
                  <td className="p-4">
                     {lead.quotationStatus === 'Done' ? (
                       <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded">Done</span>
                     ) : (lead.quotationStatus || '').includes('Proposal') ? (
                       <span className="bg-orange-900 text-orange-300 text-xs px-2 py-1 rounded">Proposal</span>
                     ) : (
                       <span className="w-4 h-4 block bg-red-900 rounded"></span>
                     )}
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                     <select 
                       value={lead.status}
                       onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                       className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-lime-500"
                     >
                       {Object.values(LeadStatus).map(s => (
                         <option key={s} value={s}>{s}</option>
                       ))}
                     </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {/* Add Lead Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Lead">
            <div className="grid grid-cols-2 gap-4 space-y-2">
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-slate-400 uppercase font-bold">Name</label>
                <Input value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="mt-1" placeholder="John Doe"/>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-slate-400 uppercase font-bold">Company</label>
                <Input value={newLead.company} onChange={e => setNewLead({...newLead, company: e.target.value})} className="mt-1" placeholder="Company Inc."/>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-slate-400 uppercase font-bold">Contact/Phone</label>
                <Input value={newLead.contact} onChange={e => setNewLead({...newLead, contact: e.target.value})} className="mt-1" placeholder="+123456789"/>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-slate-400 uppercase font-bold">Email</label>
                <Input value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="mt-1" placeholder="email@example.com"/>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-slate-400 uppercase font-bold">Assignee</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white mt-1"
                  value={newLead.assignee}
                  onChange={(e) => setNewLead({...newLead, assignee: e.target.value})}
                >
                  {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-slate-400 uppercase font-bold">Status</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white mt-1"
                  value={newLead.status}
                  onChange={(e) => setNewLead({...newLead, status: e.target.value as LeadStatus})}
                >
                  {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 uppercase font-bold">Location</label>
                <Input value={newLead.location} onChange={e => setNewLead({...newLead, location: e.target.value})} className="mt-1" placeholder="City, Country"/>
              </div>

              {/* Dynamic Inputs for Custom Fields */}
              {customFieldsConfig.map(field => (
                <div key={field.name} className="col-span-2 md:col-span-1">
                   <label className="text-xs text-lime-400 uppercase font-bold">{field.name}</label>
                   <Input 
                      type={field.type}
                      className="mt-1" 
                      placeholder={`Enter ${field.name}`}
                      value={newLead.customFields?.[field.name] || ''}
                      onChange={(e) => setNewLead({
                        ...newLead, 
                        customFields: { ...newLead.customFields, [field.name]: e.target.value }
                      })}
                   />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateLead} className="bg-lime-500 hover:bg-lime-600 text-black font-bold">Create Lead</Button>
            </div>
      </Modal>

      {/* Lead Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Lead Details" className="max-w-2xl">
          {selectedLead && (
              <div className="space-y-6">
                  {/* Header Info */}
                  <div className="flex items-start justify-between border-b border-slate-700 pb-4">
                      <div className="flex gap-4">
                          <img src={selectedLead.avatar} className="w-16 h-16 rounded-lg object-cover bg-slate-800" alt=""/>
                          <div>
                              <h3 className="text-xl font-bold text-white">{selectedLead.name}</h3>
                              <p className="text-slate-400">{selectedLead.company} • {selectedLead.designation}</p>
                              <div className="flex gap-2 mt-2">
                                  <Badge color="blue">{selectedLead.status}</Badge>
                                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Score: {selectedLead.score}</span>
                              </div>
                          </div>
                      </div>
                      <div className="text-right text-sm text-slate-400">
                          <p>Assignee: <span className="text-white">{selectedLead.assignee}</span></p>
                          <p>Source: {selectedLead.leadSource}</p>
                      </div>
                  </div>

                  {/* Task Manager */}
                  <div className="bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-3 flex items-center gap-2"><CheckSquare size={16}/> Tasks & Reminders</h4>
                      <div className="space-y-2 mb-3">
                          {(selectedLead.tasks || []).map(task => (
                              <div key={task.id} className="flex items-center gap-2 group p-2 hover:bg-slate-700 rounded">
                                  <button onClick={() => toggleTask(task.id)} className={task.completed ? "text-green-500" : "text-slate-400"}>
                                      {task.completed ? <CheckSquare size={18}/> : <Square size={18}/>}
                                  </button>
                                  <span className={`flex-1 text-sm ${task.completed ? "line-through text-slate-500" : "text-white"}`}>{task.text}</span>
                                  <button onClick={() => removeTask(task.id)} className="text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                              </div>
                          ))}
                          {(!selectedLead.tasks || selectedLead.tasks.length === 0) && <p className="text-slate-500 text-sm italic">No tasks added.</p>}
                      </div>
                      <div className="flex gap-2">
                          <Input placeholder="New task..." value={newTaskText} onChange={e => setNewTaskText(e.target.value)} className="h-9 text-sm"/>
                          <Button className="h-9 px-3 bg-blue-600 text-white" onClick={addTaskToLead}>Add</Button>
                      </div>
                  </div>

                  {/* Custom Fields View */}
                  <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedLead.customFields || {}).map(([key, value]) => (
                          <div key={key} className="bg-slate-800 p-3 rounded">
                              <p className="text-xs text-slate-500 uppercase font-bold">{key}</p>
                              <p className="text-white">{value as string}</p>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </Modal>

      {/* Add Custom Field Modal */}
      <Modal isOpen={isFieldModalOpen} onClose={() => setIsFieldModalOpen(false)} title="Manage Custom Fields" className="max-w-sm">
              <p className="text-sm text-slate-400 mb-4">Add new columns to track specific data points for your leads.</p>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-slate-400 uppercase font-bold">Field Name</label>
                    <Input 
                      placeholder="e.g. Budget, Timeline, Source URL" 
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="mt-1"
                    />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 uppercase font-bold">Field Type</label>
                    <select 
                      value={newFieldType} 
                      onChange={(e) => setNewFieldType(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white mt-1"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                    </select>
                 </div>
                 <Button onClick={handleAddCustomField} disabled={!newFieldName} className="w-full bg-lime-500 text-black font-bold">
                    Add Field
                 </Button>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700">
                 <p className="text-xs font-bold text-slate-500 mb-2">ACTIVE FIELDS</p>
                 <div className="flex flex-col gap-2">
                    {customFieldsConfig.map(f => (
                       <div key={f.name} className="flex justify-between items-center bg-slate-800 p-2 rounded">
                          <div className="flex items-center gap-2">
                             <Badge color="gray">{f.type}</Badge>
                             <span className="text-sm text-white">{f.name}</span>
                          </div>
                          <button onClick={() => handleRemoveCustomField(f.name)} className="text-slate-500 hover:text-red-500">
                             <Trash2 size={14}/>
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
      </Modal>

      {/* Scoring Rules Modal */}
      <Modal isOpen={isScoreModalOpen} onClose={() => setIsScoreModalOpen(false)} title="Lead Scoring Rules">
         <div className="space-y-4">
             <p className="text-sm text-slate-400">Define rules to automatically score leads out of 100.</p>
             <div className="space-y-2">
                 {scoringRules.map(rule => (
                     <div key={rule.id} className="flex items-center gap-2 text-sm bg-slate-800 p-2 rounded border border-slate-700">
                         <span className="text-slate-400">IF</span>
                         <span className="font-bold text-white">{rule.field}</span>
                         <span className="text-blue-400">{rule.condition}</span>
                         <span className="font-bold text-white">"{rule.value}"</span>
                         <span className="text-slate-400">ADD</span>
                         <span className="font-bold text-green-400">+{rule.points}</span>
                     </div>
                 ))}
             </div>
             <div className="p-4 bg-slate-800/50 rounded text-xs text-slate-500 italic">
                 Note: Basic completeness (Phone, Email, Company) adds +30 points automatically.
             </div>
         </div>
      </Modal>
    </div>
  );
};

export default LeadGeneration;
