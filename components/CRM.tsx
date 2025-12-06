
import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Tag, Plus, Wand2, User, CheckSquare, Square, Trash2, ShoppingBag } from 'lucide-react';
import { Contact, Message, LeadStatus, Task } from '../types';
import { Card, Badge, Button, Input } from './Shared';
import { generateSmartReply, analyzeLeadSentiment } from '../services/geminiService';

// Mock Data
const MOCK_CONTACTS: Contact[] = [
  {
    id: '1', name: 'Alice Freeman', phone: '+1 234 567 8900', email: 'alice@example.com', avatar: 'https://picsum.photos/200/200',
    company: 'TechCorp Inc.', status: LeadStatus.NEGOTIATION, lastMessage: 'Can you send the updated proposal?',
    lastMessageTime: '10:30 AM', unreadCount: 2, tags: ['VIP', 'Urgent'],
    messages: [
      { id: '1', text: 'Hi, I saw your product online.', sender: 'user', timestamp: '10:00 AM' },
      { id: '2', text: 'Hello Alice! How can I help you today?', sender: 'agent', timestamp: '10:05 AM' },
      { id: '3', text: 'Can you send the updated proposal?', sender: 'user', timestamp: '10:30 AM' },
    ],
    tasks: [
      { id: 't1', text: 'Send updated proposal', completed: false },
      { id: 't2', text: 'Schedule follow-up call', completed: true },
    ],
    orders: [
        { id: 'o1', orderNumber: 'ORD-101', date: '2025-01-15', total: 12000, status: 'Completed', paymentStatus: 'Paid', items: [], customerName: 'Alice Freeman', source: 'Web' }
    ]
  },
  {
    id: '2', name: 'Bob Smith', phone: '+1 987 654 3210', email: 'bob@example.com', avatar: 'https://picsum.photos/201/201',
    company: 'Logistics Ltd', status: LeadStatus.NEW, lastMessage: 'Thanks for the info.',
    lastMessageTime: 'Yesterday', unreadCount: 0, tags: ['Cold Lead'],
    messages: [
      { id: '1', text: 'Is this available in bulk?', sender: 'user', timestamp: 'Yesterday' },
      { id: '2', text: 'Yes, Bob. We offer wholesale pricing.', sender: 'agent', timestamp: 'Yesterday' },
      { id: '3', text: 'Thanks for the info.', sender: 'user', timestamp: 'Yesterday' },
    ],
    tasks: []
  },
];

const CRM = () => {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string>(MOCK_CONTACTS[0].id);
  const [inputText, setInputText] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'info' | 'orders'>('info'); // Tab state
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact?.messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedContact) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedContacts = contacts.map(c => {
      if (c.id === selectedContact.id) {
        return { ...c, messages: [...c.messages, newMessage], lastMessage: inputText, lastMessageTime: 'Just now' };
      }
      return c;
    });

    setContacts(updatedContacts);
    setInputText('');
  };

  const handleAiSuggest = async () => {
    if (!selectedContact) return;
    setIsAiThinking(true);
    const suggestion = await generateSmartReply(selectedContact);
    setInputText(suggestion);
    setIsAiThinking(false);
  };

  const handleAnalyze = async () => {
    if(!selectedContact) return;
    setIsAiThinking(true);
    const result = await analyzeLeadSentiment(selectedContact.messages);
    alert(`Sentiment Score: ${result.score}\nSummary: ${result.summary}`);
    setIsAiThinking(false);
  }

  // Task Management Functions
  const handleAddTask = () => {
    if (!newTaskText.trim() || !selectedContact) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };

    const updatedContacts = contacts.map(c => {
      if (c.id === selectedContact.id) {
        return { ...c, tasks: [...(c.tasks || []), newTask] };
      }
      return c;
    });

    setContacts(updatedContacts);
    setNewTaskText('');
  };

  const toggleTask = (taskId: string) => {
    if (!selectedContact) return;
    const updatedContacts = contacts.map(c => {
      if (c.id === selectedContact.id) {
        return {
          ...c,
          tasks: c.tasks?.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return c;
    });
    setContacts(updatedContacts);
  };

  const removeTask = (taskId: string) => {
    if (!selectedContact) return;
    const updatedContacts = contacts.map(c => {
      if (c.id === selectedContact.id) {
        return {
          ...c,
          tasks: c.tasks?.filter(t => t.id !== taskId)
        };
      }
      return c;
    });
    setContacts(updatedContacts);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Left: Contact List */}
      <Card className="w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b dark:border-slate-700">
          <h3 className="font-semibold mb-3 dark:text-white">Inbox</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <Input placeholder="Search contacts..." className="pl-10" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {contacts.map(contact => (
            <div 
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className={`p-4 border-b dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedContactId === contact.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-3">
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-sm dark:text-white">{contact.name}</h4>
                    <p className="text-xs text-slate-500">{contact.company}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{contact.lastMessageTime}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pl-12">
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{contact.lastMessage}</p>
                {(contact.unreadCount || 0) > 0 && (
                  <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">{contact.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Middle: Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/50 relative">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <img src={selectedContact.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold dark:text-white">{selectedContact.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Online via WhatsApp
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <button title="Sentiment Analysis" onClick={handleAnalyze} className="hover:bg-slate-100 p-2 rounded-full"><Wand2 size={20}/></button>
                <Phone size={20} className="cursor-pointer hover:text-blue-500" />
                <Video size={20} className="cursor-pointer hover:text-blue-500" />
                <MoreVertical size={20} className="cursor-pointer" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://site-assets.fontawesome.com/releases/v6.5.1/svgs/solid/message-lines.svg')]">
               {selectedContact.messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[70%] px-4 py-2 rounded-xl shadow-sm text-sm ${
                     msg.sender === 'agent' 
                      ? 'bg-green-100 text-slate-900 rounded-tr-none dark:bg-green-700 dark:text-white' 
                      : 'bg-white text-slate-900 rounded-tl-none dark:bg-slate-800 dark:text-white'
                   }`}>
                     <p>{msg.text}</p>
                     <p className={`text-[10px] mt-1 text-right ${msg.sender === 'agent' ? 'text-green-800 dark:text-green-200' : 'text-slate-400'}`}>
                       {msg.timestamp}
                     </p>
                   </div>
                 </div>
               ))}
               <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
              <div className="flex gap-2 items-center">
                 <Button variant="ghost" className="p-2"><Paperclip size={20} /></Button>
                 <Input 
                  placeholder="Type a message..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                 <Button onClick={handleSendMessage} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                   <Send size={18} />
                 </Button>
              </div>
              <div className="mt-2 flex gap-2">
                 <Button variant="secondary" onClick={handleAiSuggest} disabled={isAiThinking} className="text-xs h-8 px-3">
                   {isAiThinking ? <Wand2 className="animate-spin" size={12}/> : <Wand2 size={12} />}
                   AI Smart Reply
                 </Button>
                 <span className="text-xs text-slate-400 flex items-center ml-auto">
                    Press Enter to send
                 </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <User size={48} className="mb-4 opacity-50"/>
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </Card>

      {/* Right: Lead Details & Tasks */}
      <Card className="w-1/4 flex flex-col hidden xl:flex h-full">
        {selectedContact ? (
          <div className="flex flex-col h-full">
            {/* Header */}
             <div className="p-6 text-center border-b dark:border-slate-700 shrink-0">
              <img src={selectedContact.avatar} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover shadow-md" alt="" />
              <h3 className="font-bold text-lg dark:text-white">{selectedContact.name}</h3>
              <p className="text-slate-500">{selectedContact.company}</p>
              <div className="mt-3 flex justify-center gap-2">
                 <Badge color="blue">{selectedContact.status}</Badge>
              </div>
            </div>

            <div className="flex p-2 gap-2 border-b dark:border-slate-700">
                <Button variant={rightPanelTab === 'info' ? 'secondary' : 'ghost'} onClick={() => setRightPanelTab('info')} className="flex-1 text-xs h-8">Info</Button>
                <Button variant={rightPanelTab === 'orders' ? 'secondary' : 'ghost'} onClick={() => setRightPanelTab('orders')} className="flex-1 text-xs h-8">Orders</Button>
            </div>

            {/* Tabs / Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
               {rightPanelTab === 'info' && (
                   <>
                       {/* Tasks Section */}
                       <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase mb-3 block flex items-center justify-between">
                             Tasks & Reminders
                             <span className="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-0.5 rounded-full">{selectedContact.tasks?.length || 0}</span>
                          </label>
                          
                          <div className="space-y-2 mb-3">
                             {(selectedContact.tasks || []).map(task => (
                                <div key={task.id} className="flex items-center group">
                                   <button 
                                      onClick={() => toggleTask(task.id)}
                                      className={`mr-2 ${task.completed ? 'text-green-500' : 'text-slate-400 hover:text-slate-600'}`}
                                   >
                                      {task.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                                   </button>
                                   <span className={`text-sm flex-1 ${task.completed ? 'line-through text-slate-500' : 'dark:text-slate-300'}`}>
                                      {task.text}
                                   </span>
                                   <button onClick={() => removeTask(task.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Trash2 size={14} />
                                   </button>
                                </div>
                             ))}
                             {(!selectedContact.tasks || selectedContact.tasks.length === 0) && (
                                <p className="text-xs text-slate-400 italic">No active tasks.</p>
                             )}
                          </div>

                          <div className="flex gap-2">
                             <Input 
                                placeholder="Add new task..." 
                                value={newTaskText} 
                                onChange={e => setNewTaskText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                                className="h-8 text-xs"
                             />
                             <Button onClick={handleAddTask} variant="secondary" className="h-8 px-2"><Plus size={14}/></Button>
                          </div>
                       </div>

                      {/* Info Section */}
                      <div className="space-y-4 pt-4 border-t dark:border-slate-700">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                          <p className="dark:text-white text-sm">{selectedContact.email}</p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase">Phone</label>
                          <p className="dark:text-white text-sm">{selectedContact.phone}</p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Tags</label>
                          <div className="flex flex-wrap gap-2">
                            {selectedContact.tags.map(tag => (
                              <span key={tag} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-xs dark:text-slate-300">
                                <Tag size={10} /> {tag}
                              </span>
                            ))}
                            <button className="text-blue-500 text-xs flex items-center gap-1 hover:underline">
                              <Plus size={10} /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                   </>
               )}
               
               {rightPanelTab === 'orders' && (
                   <div className="space-y-4">
                       <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Order History</label>
                       {(selectedContact.orders || []).length > 0 ? (
                           selectedContact.orders?.map(order => (
                               <div key={order.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                   <div className="flex justify-between items-center mb-2">
                                       <span className="font-bold text-sm dark:text-white">{order.orderNumber}</span>
                                       <Badge color={order.paymentStatus === 'Paid' ? 'green' : 'red'}>{order.paymentStatus}</Badge>
                                   </div>
                                   <div className="flex justify-between items-center text-xs text-slate-500">
                                       <span>{order.date}</span>
                                       <span className="font-bold dark:text-slate-300">Rs {order.total.toLocaleString()}</span>
                                   </div>
                               </div>
                           ))
                       ) : (
                           <div className="text-center text-slate-400 py-4 flex flex-col items-center">
                               <ShoppingBag size={24} className="mb-2 opacity-50"/>
                               <p className="text-xs">No orders found.</p>
                           </div>
                       )}
                   </div>
               )}
            </div>
            
            <div className="p-4 border-t dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800/50">
              <Button variant="outline" className="w-full mb-2">Create Quotation</Button>
              <Button variant="outline" className="w-full">Create Invoice</Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 mt-10">No contact selected</div>
        )}
      </Card>
    </div>
  );
};

export default CRM;
