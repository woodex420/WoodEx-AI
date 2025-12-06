import React from 'react';
import { Zap, ArrowRight, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { Card, Button, Badge } from './Shared';

const Automation = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Automation Studio</h2>
            <p className="text-slate-500">Create workflows: IF [Trigger] THEN [Action]</p>
          </div>
          <Button><Zap size={18} /> New Workflow</Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 relative overflow-hidden group hover:border-blue-500 transition-colors cursor-pointer">
             <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">ACTIVE</div>
             </div>
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                   <Zap size={24} />
                </div>
                <h3 className="font-bold text-lg dark:text-white">New Lead Welcome</h3>
             </div>
             <div className="space-y-3 relative">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                   <span className="font-bold">IF</span> Lead Created
                </div>
                <div className="flex justify-center text-slate-400"><ArrowRight size={16} className="rotate-90" /></div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                   <span className="font-bold">THEN</span> Send WhatsApp Template: "Welcome"
                </div>
             </div>
          </Card>

          <Card className="p-6 group hover:border-blue-500 transition-colors cursor-pointer">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                   <Mail size={24} />
                </div>
                <h3 className="font-bold text-lg dark:text-white">Invoice Reminder</h3>
             </div>
             <div className="space-y-3 relative">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                   <span className="font-bold">IF</span> Invoice Due Date = Today
                </div>
                <div className="flex justify-center text-slate-400"><ArrowRight size={16} className="rotate-90" /></div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                   <span className="font-bold">THEN</span> Send Email Reminder
                </div>
             </div>
          </Card>
       </div>

       <div className="mt-10">
          <h3 className="text-xl font-bold dark:text-white mb-4">Activity Log</h3>
          <Card className="p-0 overflow-hidden">
             <div className="p-4 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-sm text-slate-500 uppercase">
                Recent Executions
             </div>
             <div className="divide-y dark:divide-slate-700">
                {[1,2,3].map(i => (
                   <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                         <CheckCircle size={18} className="text-green-500" />
                         <div>
                            <p className="text-sm font-medium dark:text-white">Workflow: New Lead Welcome</p>
                            <p className="text-xs text-slate-500">Triggered by: Lead #4592 (John Doe)</p>
                         </div>
                      </div>
                      <span className="text-xs text-slate-400">2 mins ago</span>
                   </div>
                ))}
             </div>
          </Card>
       </div>
    </div>
  );
};

export default Automation;