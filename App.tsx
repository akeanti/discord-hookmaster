import React, { useState, useEffect, useRef } from 'react';
import { WebhookPayload, SavedWebhook } from './types';
import WebhookPreview from './components/WebhookPreview';
import { sendWebhook, validateWebhook, getWebhookDetails } from './services/discordService';

// --- Icons ---
const Icons = {
  Edit: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Code: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  History: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Template: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
  Tools: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  ChevronUp: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>,
  ChevronDown: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
  Duplicate: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Upload: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
};

// --- Defaults ---

const DEFAULT_PAYLOAD: WebhookPayload = {
  content: "",
  username: "HookBot",
  avatar_url: "",
  embeds: [
    {
      title: "Welcome to better-embeds.com",
      description: "Start crafting the perfect notification today.",
      color: 5814783,
      fields: [],
      timestamp: new Date().toISOString()
    }
  ],
  components: [],
  allowed_mentions: { parse: ['users', 'roles', 'everyone'] }
};

const normalizePayload = (payload: WebhookPayload): WebhookPayload => {
  const allowedMentions = payload.allowed_mentions ?? { parse: [] };
  return {
    ...payload,
    allowed_mentions: {
      ...allowedMentions,
      parse: allowedMentions.parse ?? []
    }
  };
};

const TEMPLATES: { name: string; payload: WebhookPayload }[] = [
  {
    name: "Server Announcement",
    payload: {
      content: "@everyone",
      username: "Announcements",
      embeds: [{
        title: "📢 Big Update!",
        description: "We have just released version 2.0. Check out the changelog below.",
        color: 5763719,
        fields: [{ name: "New Features", value: "• Dark Mode\n• Templates\n• Tools" }],
        footer: { text: "The Admin Team" },
        timestamp: new Date().toISOString()
      }],
      allowed_mentions: { parse: ['everyone'] }
    }
  },
  {
    name: "Rules Embed",
    payload: {
      username: "Server Rules",
      embeds: [{
        title: "📜 Community Guidelines",
        description: "Please read the following rules carefully.",
        color: 15548997,
        fields: [
          { name: "1. Be Respectful", value: "Treat everyone with respect. Harassment is not tolerated." },
          { name: "2. No Spam", value: "Avoid sending repetitive messages." }
        ],
        thumbnail: { url: "https://cdn.discordapp.com/embed/avatars/0.png" }
      }]
    }
  }
];

// --- UI Components ---

const Label = ({ children }: { children?: React.ReactNode }) => (
  <label className="block text-[11px] font-bold text-[#b5bac1] uppercase mb-1.5 select-none">{children}</label>
);

const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="w-full group">
    {label && <Label>{label}</Label>}
    <input className="input-base w-full p-2 rounded text-sm outline-none bg-[#1e1f22] border border-transparent focus:border-[#5865F2] transition-colors" {...props} />
  </div>
);

const TextArea = ({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) => (
  <div className="w-full">
    {label && <Label>{label}</Label>}
    <textarea className="input-base w-full p-2 rounded text-sm outline-none min-h-[80px] resize-y bg-[#1e1f22] border border-transparent focus:border-[#5865F2] transition-colors" {...props} />
  </div>
);

const IconButton = ({ icon: Icon, onClick, title, danger }: { icon: any, onClick: (e: any) => void, title?: string, danger?: boolean }) => (
  <button 
    onClick={onClick} 
    title={title}
    className={`p-1.5 rounded transition-colors ${danger ? 'text-[#949BA4] hover:text-red-400 hover:bg-[#1e1f22]' : 'text-[#949BA4] hover:text-[#dbdee1] hover:bg-[#1e1f22]'}`}
  >
    <Icon />
  </button>
);

// --- Utils Tab Components ---

const TimestampGenerator = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const unixTime = Math.floor(new Date(date).getTime() / 1000);
  const formats = [
    { code: 't', label: 'Short Time' }, { code: 'T', label: 'Long Time' },
    { code: 'd', label: 'Short Date' }, { code: 'D', label: 'Long Date' },
    { code: 'f', label: 'Short DateTime' }, { code: 'F', label: 'Long DateTime' },
    { code: 'R', label: 'Relative' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
       <div className="bg-[#1e1f22] p-4 rounded border border-[#111214]">
         <Label>Select Date & Time</Label>
         <input type="datetime-local" className="w-full bg-[#2b2d31] text-white p-2 rounded mt-2 outline-none border border-[#111214] focus:border-[#5865F2]" value={date} onChange={(e) => setDate(e.target.value)} />
       </div>
       <div className="space-y-2">
         {formats.map((f) => (
           <div key={f.code} className="bg-[#1e1f22] p-3 rounded flex items-center justify-between border border-[#111214] hover:border-[#5865F2] transition-colors">
              <div>
                 <div className="text-xs text-[#949BA4] uppercase font-bold mb-1">{f.label}</div>
                 <code className="bg-[#2b2d31] px-1.5 py-0.5 rounded text-sm text-[#dbdee1] font-mono">{`<t:${unixTime}:${f.code}>`}</code>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(`<t:${unixTime}:${f.code}>`); }} className="text-xs bg-[#5865F2] hover:bg-[#4752c4] text-white px-3 py-1.5 rounded font-bold">Copy</button>
           </div>
         ))}
       </div>
    </div>
  );
};

const ColorConverter = () => {
  const [hex, setHex] = useState('#5865F2');
  const [int, setInt] = useState(5793266);
  return (
    <div className="space-y-4 animate-fade-in">
       <div className="flex gap-4 items-start">
          <div className="w-24 h-24 rounded-lg shadow-inner border border-[#111214]" style={{ backgroundColor: hex }}></div>
          <div className="flex-1 space-y-3">
             <Input label="Hex Color" value={hex} onChange={(e) => { setHex(e.target.value); if (/^#[0-9A-F]{6}$/i.test(e.target.value)) setInt(parseInt(e.target.value.replace('#', ''), 16)); }} />
             <Input label="Integer (Discord API)" type="number" value={int} onChange={(e) => { const n = parseInt(e.target.value); if(!isNaN(n)){ setInt(n); setHex('#' + n.toString(16).padStart(6, '0')); } }} />
          </div>
       </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'editor' | 'settings' | 'json' | 'history' | 'templates' | 'tools'>('editor');
  const [toolTab, setToolTab] = useState<'timestamp' | 'color'>('timestamp');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [payload, setPayload] = useState<WebhookPayload>(DEFAULT_PAYLOAD);
  const [jsonText, setJsonText] = useState(() => JSON.stringify(DEFAULT_PAYLOAD, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedWebhook[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [expandedEmbeds, setExpandedEmbeds] = useState<number[]>([0]);
  const [rememberUrl, setRememberUrl] = useState(true);
  const validationTimeoutRef = useRef<number | null>(null);
  const validationRequestRef = useRef(0);
  const detailsAbortRef = useRef<AbortController | null>(null);
  const allowedMentionsParse = payload.allowed_mentions?.parse ?? [];

  // Init
  useEffect(() => {
    const saved = localStorage.getItem('be_history');
    if (saved) setHistory(JSON.parse(saved));
    const remember = localStorage.getItem('be_remember_url');
    if (remember !== null) setRememberUrl(remember === 'true');
    const lastUrl = localStorage.getItem('be_last_url');
    if (lastUrl && (remember === null || remember === 'true')) handleUrlChange(lastUrl);
  }, []);

  useEffect(() => {
    if (activeView === 'json' && !jsonError) {
      setJsonText(JSON.stringify(payload, null, 2));
    }
  }, [payload, activeView, jsonError]);

  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) window.clearTimeout(validationTimeoutRef.current);
      if (detailsAbortRef.current) detailsAbortRef.current.abort();
    };
  }, []);

  const handleUrlChange = (url: string) => {
    setWebhookUrl(url);
    if (rememberUrl) localStorage.setItem('be_last_url', url);
    if (validationTimeoutRef.current) window.clearTimeout(validationTimeoutRef.current);
    if (detailsAbortRef.current) detailsAbortRef.current.abort();
    setIsValidUrl(null);
    const trimmedUrl = url.trim();
    if (trimmedUrl.length <= 20) return;
    validationTimeoutRef.current = window.setTimeout(async () => {
      const requestId = ++validationRequestRef.current;
      const valid = await validateWebhook(trimmedUrl);
      if (requestId !== validationRequestRef.current) return;
      setIsValidUrl(valid);
      if (!valid) return;
      const controller = new AbortController();
      detailsAbortRef.current = controller;
      const details = await getWebhookDetails(trimmedUrl, controller.signal);
      if (requestId !== validationRequestRef.current) return;
      if (details) {
        setPayload(p => normalizePayload({
          ...p,
          username: details.name || p.username,
          avatar_url: details.avatar_url || p.avatar_url
        }));
      }
    }, 350);
  };

  const handleSend = async () => {
    if (!isValidUrl) return alert("Invalid Webhook URL");
    setSending(true);
    const result = await sendWebhook(webhookUrl, payload, files);
    setSending(false);
    if (result.success) {
      const newHistory = [
        { id: Date.now().toString(), url: webhookUrl, name: payload.username || "Webhook" },
        ...history.filter(h => h.url !== webhookUrl)
      ].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('be_history', JSON.stringify(newHistory));
      alert("Sent successfully!");
    } else {
      alert("Error: " + result.error);
    }
  };

  // Embed Helpers
  const toggleEmbed = (idx: number) => setExpandedEmbeds(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  const moveEmbed = (idx: number, dir: 'up' | 'down') => {
    if (!payload.embeds) return;
    const newEmbeds = [...payload.embeds];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= newEmbeds.length) return;
    [newEmbeds[idx], newEmbeds[target]] = [newEmbeds[target], newEmbeds[idx]];
    setPayload({ ...payload, embeds: newEmbeds });
  };

  // Component Helpers
  const addComponentRow = () => setPayload({ ...payload, components: [...(payload.components || []), { type: 1, components: [] }] });
  const addComponent = (rowIdx: number, type: 2 | 3) => {
    const rows = [...(payload.components || [])];
    const row = rows[rowIdx];
    if (!row.components) row.components = [];
    if (type === 3) row.components = [{ type: 3, custom_id: `select_${Date.now()}`, options: [] }];
    else row.components.push({ type: 2, style: 1, label: "Button", custom_id: `btn_${Date.now()}` });
    setPayload({ ...payload, components: rows });
  };
  
  // File Helpers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };
  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  // Import/Export
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webhook-${Date.now()}.json`;
    a.click();
  };
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        const normalized = normalizePayload(json);
        setPayload(normalized);
        setJsonText(JSON.stringify(normalized, null, 2));
        setJsonError(null);
        setActiveView('editor');
      } catch (err) { alert("Invalid JSON file"); }
    };
    reader.readAsText(file);
  };

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      const normalized = normalizePayload(parsed);
      setPayload(normalized);
      setJsonError(null);
    } catch (err) {
      setJsonError('Invalid JSON. Fix the syntax to update the preview.');
    }
  };

  const applyTemplate = (nextPayload: WebhookPayload) => {
    const normalized = normalizePayload(nextPayload);
    setPayload(normalized);
    setJsonText(JSON.stringify(normalized, null, 2));
    setJsonError(null);
    setActiveView('editor');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('be_history');
  };

  return (
    <div className="flex h-screen w-full bg-[#313338] text-[#dbdee1] overflow-hidden font-sans">
      
      {/* Sidebar */}
      <nav className="w-18 flex flex-col items-center py-4 bg-[#1e1f22] border-r border-[#111214] shrink-0 z-20">
         <div className="w-10 h-10 bg-[#5865F2] rounded-xl flex items-center justify-center mb-6 shadow-md cursor-default">
            <span className="font-bold text-white text-lg">B</span>
         </div>
         <div className="flex flex-col gap-2 w-full px-2">
            {[
              { id: 'editor', icon: Icons.Edit, label: 'Editor' },
              { id: 'settings', icon: Icons.Settings, label: 'Settings' },
              { id: 'json', icon: Icons.Code, label: 'JSON' },
              { id: 'history', icon: Icons.History, label: 'History' },
              { id: 'templates', icon: Icons.Template, label: 'Templates' },
              { id: 'tools', icon: Icons.Tools, label: 'Toolkit' },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveView(item.id as any)} className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all group ${activeView === item.id ? 'bg-[#35373C] text-[#5865F2]' : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#dbdee1]'}`}>
                <item.icon />
                <div className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">{item.label}</div>
              </button>
            ))}
         </div>
      </nav>

      {/* Main Drawer */}
      <div className="w-[500px] flex flex-col bg-[#2b2d31] border-r border-[#1e1f22] shadow-xl z-10 shrink-0 h-full">
        {/* Header */}
        <div className="p-4 border-b border-[#1f2023] bg-[#2b2d31]">
           <div className="relative mb-3">
              <input type="text" placeholder="Webhook URL..." value={webhookUrl} onChange={(e) => handleUrlChange(e.target.value)} className={`w-full bg-[#1e1f22] text-xs p-2.5 pl-3 rounded outline-none border transition-colors ${isValidUrl === true ? 'border-green-500' : isValidUrl === false ? 'border-red-500' : 'border-[#111214] focus:border-[#5865F2]'}`} />
              <div className={`absolute right-2 top-2.5 w-2 h-2 rounded-full ${isValidUrl ? 'bg-green-500' : 'bg-[#404249]'}`}></div>
           </div>
           <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#dbdee1] uppercase tracking-wide opacity-90">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h2>
              <button onClick={handleSend} disabled={sending || !isValidUrl} className={`px-5 py-1.5 rounded text-xs font-bold text-white transition-all shadow-md ${sending || !isValidUrl ? 'bg-[#3b3d44] opacity-50 cursor-not-allowed' : 'bg-[#248046] hover:bg-[#1a6334] active:scale-95'}`}>{sending ? 'Sending...' : 'Send Message'}</button>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
           
           {/* Editor View */}
           {activeView === 'editor' && (
             <div className="space-y-6 animate-fade-in">
                {/* Identity */}
                <section className="space-y-3">
                   <div className="grid grid-cols-2 gap-3">
                      <Input label="Username" value={payload.username || ''} onChange={e => setPayload({...payload, username: e.target.value})} />
                      <Input label="Avatar URL" value={payload.avatar_url || ''} onChange={e => setPayload({...payload, avatar_url: e.target.value})} />
                   </div>
                   <TextArea label="Content" value={payload.content || ''} onChange={e => setPayload({...payload, content: e.target.value})} />
                </section>

                {/* Files */}
                <section>
                   <div className="flex items-center justify-between mb-2">
                      <Label>Attachments ({files.length})</Label>
                      <label className="cursor-pointer text-[10px] bg-[#404249] hover:bg-[#4f515a] text-white px-3 py-1 rounded font-bold transition-colors">
                         + Upload File
                         <input type="file" multiple className="hidden" onChange={handleFileChange} />
                      </label>
                   </div>
                   <div className="space-y-2">
                      {files.map((f, i) => (
                         <div key={i} className="flex justify-between items-center bg-[#1e1f22] p-2 rounded text-xs border border-[#111214]">
                            <span className="truncate flex-1 text-[#dbdee1]">{f.name} <span className="text-[#949BA4]">({(f.size/1024).toFixed(1)}KB)</span></span>
                            <button onClick={() => removeFile(i)} className="text-[#949BA4] hover:text-red-400 p-1">×</button>
                         </div>
                      ))}
                      {files.length === 0 && <div className="text-center p-4 border border-dashed border-[#404249] rounded text-[#949BA4] text-xs">No files attached</div>}
                   </div>
                </section>

                {/* Embeds */}
                <section>
                   <div className="flex items-center justify-between mb-2">
                      <Label>Embeds</Label>
                      <button onClick={() => {
                          const newEmbeds = [...(payload.embeds || []), { title: "New Embed", description: "" }];
                          setPayload({...payload, embeds: newEmbeds});
                          setExpandedEmbeds([...expandedEmbeds, newEmbeds.length - 1]);
                        }} className="text-[10px] bg-[#5865F2] hover:bg-[#4752c4] text-white px-2 py-0.5 rounded font-bold">+ ADD</button>
                   </div>
                   <div className="space-y-3">
                      {payload.embeds?.map((embed, idx) => (
                        <div key={idx} className="bg-[#313338] rounded border border-[#1e1f22] transition-colors hover:border-[#404249] overflow-hidden">
                           <div className="flex items-center p-2 gap-2 bg-[#2b2d31] border-b border-[#1f2023] cursor-pointer" onClick={() => toggleEmbed(idx)}>
                              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: embed.color ? '#' + embed.color.toString(16).padStart(6, '0') : '#202225' }} />
                              <div className="flex-1 text-xs font-bold truncate text-[#dbdee1]">{embed.title || `Embed ${idx+1}`}</div>
                              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                 <IconButton icon={Icons.ChevronUp} onClick={() => moveEmbed(idx, 'up')} title="Move Up" />
                                 <IconButton icon={Icons.ChevronDown} onClick={() => moveEmbed(idx, 'down')} title="Move Down" />
                                 <IconButton icon={Icons.Trash} onClick={() => {
                                    const ne = [...payload.embeds!];
                                    ne.splice(idx, 1);
                                    setPayload({...payload, embeds: ne});
                                    setExpandedEmbeds(prev => prev.filter(i => i !== idx).map(i => (i > idx ? i - 1 : i)));
                                 }} danger title="Delete" />
                              </div>
                           </div>
                           
                           {expandedEmbeds.includes(idx) && (
                             <div className="p-3 space-y-3 bg-[#313338]">
                                <div className="grid grid-cols-2 gap-3 p-2 bg-[#2b2d31] rounded border border-[#1e1f22] mb-2">
                                  <Input label="Author Name" value={embed.author?.name || ''} onChange={e => { const ne = [...payload.embeds!]; ne[idx].author = { ...ne[idx].author, name: e.target.value }; setPayload({...payload, embeds: ne}); }} />
                                  <Input label="Author Icon" placeholder="https://... or attachment://file.png" value={embed.author?.icon_url || ''} onChange={e => { const ne = [...payload.embeds!]; ne[idx].author = { ...ne[idx].author, icon_url: e.target.value }; setPayload({...payload, embeds: ne}); }} />
                                </div>
                                <Input label="Title" value={embed.title || ''} onChange={e => { const ne = [...payload.embeds!]; ne[idx].title = e.target.value; setPayload({...payload, embeds: ne}); }} />
                                <TextArea label="Description" value={embed.description || ''} onChange={e => { const ne = [...payload.embeds!]; ne[idx].description = e.target.value; setPayload({...payload, embeds: ne}); }} />
                                <div className="grid grid-cols-2 gap-3">
                                   <div>
                                      <Label>Color</Label>
                                      <div className="flex gap-2"><input type="color" className="w-8 h-8 rounded cursor-pointer bg-transparent" value={embed.color ? '#' + embed.color.toString(16).padStart(6, '0') : '#000000'} onChange={e => { const ne = [...payload.embeds!]; ne[idx].color = parseInt(e.target.value.replace('#', ''), 16); setPayload({...payload, embeds: ne}); }} /><div className="flex-1 bg-[#1e1f22] flex items-center px-2 rounded text-xs">{embed.color ? '#' + embed.color.toString(16).padStart(6, '0').toUpperCase() : 'None'}</div></div>
                                   </div>
                                   <Input label="URL" value={embed.url || ''} onChange={e => { const ne = [...payload.embeds!]; ne[idx].url = e.target.value; setPayload({...payload, embeds: ne}); }} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                   <Input label="Thumbnail URL" placeholder="https://... or attachment://file.png" value={embed.thumbnail?.url || ''} onChange={e => { const ne = [...payload.embeds!]; ne[idx].thumbnail = { ...ne[idx].thumbnail, url: e.target.value }; setPayload({...payload, embeds: ne}); }} />
                                   <Input label="Image URL" placeholder="https://... or attachment://file.png" value={embed.image?.url || ''} onChange={e => { const ne = [...payload.embeds!]; ne[idx].image = { ...ne[idx].image, url: e.target.value }; setPayload({...payload, embeds: ne}); }} />
                                </div>
                                <div className="space-y-1 bg-[#2b2d31] p-2 rounded">
                                   <div className="flex justify-between"><Label>Fields</Label><button className="text-[10px] text-[#00A8FC] font-bold" onClick={() => { const ne = [...payload.embeds!]; ne[idx].fields = [...(ne[idx].fields||[]), {name:'Name', value:'Value', inline:true}]; setPayload({...payload, embeds: ne}); }}>+ Add</button></div>
                                   {embed.fields?.map((f, fi) => (
                                      <div key={fi} className="bg-[#1e1f22] p-2 rounded grid grid-cols-12 gap-2 mb-1">
                                         <div className="col-span-11 space-y-1">
                                            <input className="w-full bg-transparent text-xs font-bold border-b border-[#404249] pb-1 outline-none" value={f.name} onChange={e => { const ne = [...payload.embeds!]; ne[idx].fields![fi].name = e.target.value; setPayload({...payload, embeds: ne}); }} />
                                            <textarea className="w-full bg-transparent text-xs outline-none h-8 resize-none" value={f.value} onChange={e => { const ne = [...payload.embeds!]; ne[idx].fields![fi].value = e.target.value; setPayload({...payload, embeds: ne}); }} />
                                            <label className="flex items-center gap-1"><input type="checkbox" checked={f.inline} onChange={e => { const ne = [...payload.embeds!]; ne[idx].fields![fi].inline = e.target.checked; setPayload({...payload, embeds: ne}); }} /><span className="text-[10px] text-[#949BA4]">Inline</span></label>
                                         </div>
                                         <button className="text-[#da373c]" onClick={() => { const ne = [...payload.embeds!]; ne[idx].fields!.splice(fi, 1); setPayload({...payload, embeds: ne}); }}>×</button>
                                      </div>
                                   ))}
                                </div>
                                <Input label="Footer Text" value={embed.footer?.text || ''} onChange={e => { const ne = [...payload.embeds!]; ne[idx].footer = { ...ne[idx].footer, text: e.target.value }; setPayload({...payload, embeds: ne}); }} />
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                </section>
                
                {/* Components */}
                <section>
                   <div className="flex items-center justify-between mb-2">
                      <Label>Action Rows</Label>
                      <button onClick={addComponentRow} className="text-[10px] bg-[#5865F2] hover:bg-[#4752c4] text-white px-2 py-0.5 rounded font-bold">+ Row</button>
                   </div>
                   {payload.components?.map((row, ri) => (
                      <div key={ri} className="bg-[#313338] p-2 rounded border border-[#1e1f22] mb-2 relative group">
                         <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button onClick={() => addComponent(ri, 2)} className="bg-[#248046] text-white text-[10px] px-1.5 rounded">+ Btn</button>
                            <button onClick={() => addComponent(ri, 3)} className="bg-[#4E5058] text-white text-[10px] px-1.5 rounded">+ Menu</button>
                            <button onClick={() => { const c = [...payload.components!]; c.splice(ri, 1); setPayload({...payload, components: c}); }} className="bg-[#DA373C] text-white text-[10px] px-1.5 rounded">×</button>
                         </div>
                         <div className="flex gap-2 flex-wrap pt-4">
                            {row.components?.length === 0 && <span className="text-xs text-[#949BA4] italic p-1">Empty Row</span>}
                            {row.components?.map((comp, ci) => (
                               <div key={ci} className="bg-[#1e1f22] p-2 rounded border border-[#111214] text-xs">
                                  {comp.type === 2 ? (
                                    <div className="flex flex-col gap-1">
                                       <span className="font-bold text-[#dbdee1]">Button</span>
                                       <input className="bg-[#2b2d31] p-1 rounded w-24" placeholder="Label" value={comp.label} onChange={e => { const nc = [...payload.components!]; nc[ri].components![ci].label = e.target.value; setPayload({...payload, components: nc}); }} />
                                       <select className="bg-[#2b2d31] p-1 rounded" value={comp.style} onChange={e => { const nc = [...payload.components!]; nc[ri].components![ci].style = parseInt(e.target.value); setPayload({...payload, components: nc}); }}>
                                          <option value={1}>Primary</option><option value={2}>Secondary</option><option value={3}>Success</option><option value={4}>Danger</option><option value={5}>Link</option>
                                       </select>
                                    </div>
                                  ) : (
                                     <div className="flex flex-col gap-1 w-32">
                                        <span className="font-bold text-[#dbdee1]">Menu</span>
                                        <input className="bg-[#2b2d31] p-1 rounded" placeholder="Placeholder" value={comp.placeholder} onChange={e => { const nc = [...payload.components!]; nc[ri].components![ci].placeholder = e.target.value; setPayload({...payload, components: nc}); }} />
                                        <button className="bg-[#404249] px-2 py-1 rounded text-[10px]" onClick={() => { 
                                           const nc = [...payload.components!]; 
                                           nc[ri].components![ci].options = [...(nc[ri].components![ci].options || []), {label: 'Opt', value: 'opt'}]; 
                                           setPayload({...payload, components: nc}); 
                                        }}>Edit Options ({comp.options?.length})</button>
                                     </div>
                                  )}
                               </div>
                            ))}
                         </div>
                      </div>
                   ))}
                </section>
             </div>
           )}

           {/* Settings View */}
           {activeView === 'settings' && (
             <div className="space-y-6 animate-fade-in">
                <div className="bg-[#1e1f22] p-4 rounded border border-[#111214]">
                   <h3 className="text-sm font-bold text-white mb-2">Allowed Mentions</h3>
                   <p className="text-xs text-[#949BA4] mb-4">Control which mentions trigger a notification.</p>
                   <div className="space-y-2">
                      {['everyone', 'roles', 'users'].map(type => (
                         <label key={type} className="flex items-center gap-3 cursor-pointer bg-[#2b2d31] p-2 rounded hover:bg-[#35373C] transition-colors">
                            <input type="checkbox" className="w-4 h-4 accent-[#5865F2]" 
                               checked={allowedMentionsParse.includes(type as any)}
                               onChange={(e) => {
                                  const current = allowedMentionsParse;
                                  const newVal = e.target.checked ? [...current, type] : current.filter(t => t !== type);
                                  setPayload(normalizePayload({...payload, allowed_mentions: { ...payload.allowed_mentions, parse: newVal as any }}));
                               }}
                            />
                            <span className="text-sm capitalize text-[#dbdee1]">{type}</span>
                         </label>
                      ))}
                   </div>
                </div>
                <div className="bg-[#1e1f22] p-4 rounded border border-[#111214]">
                   <h3 className="text-sm font-bold text-white mb-2">Privacy</h3>
                   <p className="text-xs text-[#949BA4] mb-4">Control how webhook URLs are stored on this device.</p>
                   <label className="flex items-center gap-3 cursor-pointer bg-[#2b2d31] p-2 rounded hover:bg-[#35373C] transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#5865F2]"
                        checked={rememberUrl}
                        onChange={(e) => {
                          const nextValue = e.target.checked;
                          setRememberUrl(nextValue);
                          localStorage.setItem('be_remember_url', String(nextValue));
                          if (!nextValue) localStorage.removeItem('be_last_url');
                        }}
                      />
                      <span className="text-sm text-[#dbdee1]">Remember last webhook URL</span>
                   </label>
                </div>
                <div className="bg-[#1e1f22] p-4 rounded border border-[#111214]">
                   <h3 className="text-sm font-bold text-white mb-2">Forum / Thread</h3>
                   <Input label="Thread Name" placeholder="Create a new thread with this name..." value={payload.thread_name || ''} onChange={(e) => setPayload({...payload, thread_name: e.target.value})} />
                   <p className="text-[10px] text-[#949BA4] mt-2">Only works if the webhook channel is a Forum or if you want to create a thread in a text channel.</p>
                </div>
             </div>
           )}

           {/* JSON View */}
           {activeView === 'json' && (
             <div className="h-full flex flex-col animate-fade-in">
                <div className="flex gap-2 mb-2">
                   <button onClick={exportJSON} className="flex-1 bg-[#2b2d31] hover:bg-[#35373c] text-xs font-bold py-2 rounded text-[#dbdee1] border border-[#1e1f22]">Export .json</button>
                   <label className="flex-1 bg-[#2b2d31] hover:bg-[#35373c] text-xs font-bold py-2 rounded text-[#dbdee1] border border-[#1e1f22] text-center cursor-pointer">
                      Import .json
                      <input type="file" className="hidden" accept=".json" onChange={importJSON} />
                   </label>
                </div>
                {jsonError && (
                  <div className="text-xs text-red-400 bg-[#2b2d31] border border-[#3f1f23] rounded px-3 py-2 mb-2">
                    {jsonError}
                  </div>
                )}
                <div className="bg-[#1e1f22] flex-1 rounded p-1 border border-[#111214]">
                   <textarea className="w-full h-full bg-transparent text-[#98c379] font-mono text-xs p-4 outline-none resize-none" value={jsonText} onChange={e => handleJsonChange(e.target.value)} />
                </div>
             </div>
           )}

           {/* Tools & Templates & History */}
           {activeView === 'history' && (
             <div className="space-y-2 animate-fade-in">
                <div className="flex justify-end">
                  <button onClick={clearHistory} className="text-[10px] bg-[#404249] hover:bg-[#4f515a] text-white px-2 py-1 rounded font-bold">Clear History</button>
                </div>
                {history.map(h => (
                   <div key={h.id} className="bg-[#1e1f22] p-3 rounded flex justify-between items-center border border-[#111214] hover:border-[#5865F2]">
                      <div className="truncate flex-1 pr-2">
                         <div className="font-bold text-sm text-white">{h.name}</div>
                         <div className="text-[10px] text-[#949BA4] truncate">{h.url}</div>
                      </div>
                      <button onClick={() => handleUrlChange(h.url)} className="bg-[#2b2d31] text-xs px-3 py-1 rounded text-[#dbdee1] hover:text-white hover:bg-[#5865F2]">Load</button>
                   </div>
                ))}
                {history.length === 0 && <p className="text-center text-xs text-[#949BA4] py-8">No history yet.</p>}
             </div>
           )}
           {activeView === 'templates' && (
              <div className="grid grid-cols-1 gap-3 animate-fade-in">
                 {TEMPLATES.map((t, i) => (
                    <div key={i} className="bg-[#1e1f22] p-4 rounded border border-[#111214] hover:border-[#5865F2] cursor-pointer group" onClick={() => applyTemplate(t.payload)}>
                       <div className="font-bold text-sm text-white group-hover:text-[#5865F2]">{t.name}</div>
                       <div className="text-[10px] text-[#949BA4]">Click to apply preset</div>
                    </div>
                 ))}
              </div>
           )}
           {activeView === 'tools' && (
             <div className="animate-fade-in h-full flex flex-col">
               <div className="flex bg-[#1e1f22] p-1 rounded mb-4 shrink-0">
                  <button onClick={() => setToolTab('timestamp')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${toolTab === 'timestamp' ? 'bg-[#5865F2] text-white' : 'text-[#949BA4] hover:text-[#dbdee1]'}`}>Timestamp</button>
                  <button onClick={() => setToolTab('color')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${toolTab === 'color' ? 'bg-[#5865F2] text-white' : 'text-[#949BA4] hover:text-[#dbdee1]'}`}>Colors</button>
               </div>
               <div className="flex-1">
                 {toolTab === 'timestamp' && <TimestampGenerator />}
                 {toolTab === 'color' && <ColorConverter />}
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Preview Pane */}
      <div className="flex-1 bg-[#313338] flex flex-col min-w-0 relative">
         <div className="h-14 border-b border-[#1f2023] flex items-center px-4 shrink-0 bg-[#313338] z-10 shadow-sm">
            <span className="text-2xl text-[#80848e] mr-2">#</span><span className="font-bold text-white text-base">preview</span>
            <div className="h-6 w-[1px] bg-[#3f4147] mx-4"></div>
            <span className="text-xs text-[#b5bac1]">better-embeds.com</span>
         </div>
         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex justify-center bg-[#313338]">
            <div className="w-full max-w-[700px] animate-fade-in pb-20">
               <div className="opacity-50 select-none mb-6 space-y-4 pointer-events-none">
                  {[1,2].map(i=><div key={i} className="flex gap-4"><div className="w-10 h-10 rounded-full bg-[#2b2d31]" /><div className="space-y-2 flex-1"><div className="h-4 w-1/4 bg-[#2b2d31] rounded" /><div className="h-3 w-1/2 bg-[#2b2d31] rounded" /></div></div>)}
               </div>
               <WebhookPreview payload={payload} />
               {/* File Previews inside the Preview Pane for realism */}
               {files.length > 0 && (
                 <div className="pl-[56px] mt-2 space-y-2">
                   {files.map((f, i) => (
                     <div key={i} className="bg-[#2b2d31] p-3 rounded max-w-sm border border-[#202225] flex items-center gap-3">
                        <div className="bg-[#1e1f22] p-2 rounded"><Icons.Upload /></div>
                        <div className="overflow-hidden">
                           <div className="text-sm font-medium text-[#dbdee1] truncate">{f.name}</div>
                           <div className="text-xs text-[#949BA4]">{ (f.size/1024).toFixed(2) } KB</div>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default App;
