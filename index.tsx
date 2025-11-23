import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, 
  TreeDeciduous, 
  Wind, 
  AlertTriangle, 
  Activity, 
  Map as MapIcon, 
  Bell,
  Search,
  Cpu,
  Zap,
  Send,
  MoreHorizontal,
  ArrowUpRight,
  ShieldCheck,
  Bot,
  Loader2,
  Wifi,
  FileText,
  Play,
  Thermometer,
  CloudRain,
  Flame,
  Database,
  Server,
  Share2,
  Smartphone,
  BrainCircuit,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

// --- Types ---
type Alert = {
  id: number;
  treeId: string;
  location: string;
  risk: number;
  status: "CRITICAL" | "WARNING" | "STABLE";
  type: string;
  time: string;
};

type ChatMessage = {
  id: number;
  sender: 'user' | 'ai';
  text: string | React.ReactNode;
};

type TreeNode = {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  status: 'safe' | 'warning' | 'critical';
  tilt: number;
};

// --- Mock Data ---
const ALERTS: Alert[] = [
  { id: 1, treeId: "T-1092", location: "Nguyễn Trãi, Thanh Xuân", risk: 92, status: "CRITICAL", type: "Nghiêng > 15°", time: "2 phút trước" },
  { id: 2, treeId: "T-0451", location: "Trần Phú, Hà Đông", risk: 78, status: "WARNING", type: "Rung lắc mạnh", time: "15 phút trước" },
  { id: 3, treeId: "T-2201", location: "Láng Hạ, Đống Đa", risk: 45, status: "STABLE", type: "Bảo trì định kỳ", time: "1 giờ trước" },
];

const FORECAST_DATA = [
  { time: '14:00', risk: 20 },
  { time: '15:00', risk: 35 },
  { time: '16:00', risk: 85 }, // High risk
  { time: '17:00', risk: 90 }, // High risk
  { time: '18:00', risk: 60 },
  { time: '19:00', risk: 30 },
];

// --- Components ---

// 1. Glass Card Container
const GlassCard = ({ 
  children, 
  className = "", 
  noPadding = false 
}: { 
  children?: React.ReactNode; 
  className?: string;
  noPadding?: boolean;
}) => (
  <div className={`relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden flex flex-col ${className}`}>
    {/* Noise texture for realism */}
    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    
    {/* Gradient Glow Effect */}
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none"></div>
    
    <div className={`relative z-10 h-full flex flex-col ${noPadding ? '' : 'p-6'}`}>
      {children}
    </div>
  </div>
);

// 2. Dangerous Time Forecast Widget
const RiskForecastWidget = () => (
  <GlassCard className="h-full">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold">Dự báo Rủi ro (LSTM Model)</h3>
          <p className="text-xs text-slate-400">Phân tích từ Weather API & Lịch sử cảm biến</p>
        </div>
      </div>
      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">AI Confidence: 94%</span>
    </div>

    <div className="flex items-end gap-2 h-32 mt-auto">
      {FORECAST_DATA.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
           <div className="w-full relative h-full flex items-end">
              <div 
                className={`w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80 ${
                  item.risk > 80 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 
                  item.risk > 50 ? 'bg-yellow-500' : 'bg-emerald-500/50'
                }`}
                style={{ height: `${item.risk}%` }}
              ></div>
              {item.risk > 80 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap animate-bounce">
                  Nguy hiểm
                </div>
              )}
           </div>
           <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
        </div>
      ))}
    </div>
    <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-400 flex items-center gap-2">
      <AlertTriangle className="w-3 h-3 text-red-400" />
      <span>Dự báo: Cơn giông mạnh lúc <strong>16:00 - 17:00</strong>. Khuyến nghị gia cố các cây nghiêng.</span>
    </div>
  </GlassCard>
);

// 3. System Architecture Visualization
const ArchitectureDiagram = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 lg:p-0">
    {/* Layer 1 */}
    <GlassCard className="border-emerald-500/30">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Cpu className="w-24 h-24" />
      </div>
      <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Tầng 1: Vật lý & Biên</div>
      <div className="text-xl font-bold text-white mb-2">Green Node</div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded">
          <Activity className="w-4 h-4 text-emerald-400" /> MPU6050 (Sensor)
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded">
          <Cpu className="w-4 h-4 text-blue-400" /> ESP32 (Controller)
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded">
          <Wifi className="w-4 h-4 text-yellow-400" /> LoRa Module
        </div>
      </div>
      <div className="mt-auto flex justify-center text-emerald-500/50">
        <ArrowRight className="animate-pulse" />
      </div>
    </GlassCard>

    {/* Layer 2 */}
    <GlassCard className="border-blue-500/30">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Share2 className="w-24 h-24" />
      </div>
      <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Tầng 2: Kết nối & Dữ liệu</div>
      <div className="text-xl font-bold text-white mb-2">Gateway & Cloud</div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded">
          <Server className="w-4 h-4 text-blue-400" /> The Things Network
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded">
          <Share2 className="w-4 h-4 text-purple-400" /> MQTT Broker
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded">
          <Database className="w-4 h-4 text-emerald-400" /> InfluxDB (Time-series)
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded border border-yellow-500/30">
          <CloudRain className="w-4 h-4 text-yellow-400" /> External Weather API
        </div>
      </div>
      <div className="mt-auto flex justify-center text-blue-500/50">
        <ArrowRight className="animate-pulse" />
      </div>
    </GlassCard>

    {/* Layer 3 */}
    <GlassCard className="border-purple-500/30 bg-purple-500/5">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <BrainCircuit className="w-24 h-24" />
      </div>
      <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Tầng 3: AI Core (Quan trọng)</div>
      <div className="text-xl font-bold text-white mb-2">Intelligence Engine</div>
      <div className="space-y-2 mb-4">
        <div className="bg-purple-500/20 p-3 rounded border border-purple-500/30">
          <div className="text-sm font-bold text-white">Anomaly Detection</div>
          <div className="text-xs text-purple-200">Phát hiện bất thường rung chấn</div>
        </div>
        <div className="bg-purple-500/20 p-3 rounded border border-purple-500/30">
          <div className="text-sm font-bold text-white">LSTM Forecaster</div>
          <div className="text-xs text-purple-200">Dự báo nguy cơ đổ cây</div>
        </div>
      </div>
      <div className="mt-auto flex justify-center text-purple-500/50">
        <ArrowRight className="animate-pulse" />
      </div>
    </GlassCard>

    {/* Layer 4 */}
    <GlassCard className="border-orange-500/30">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Smartphone className="w-24 h-24" />
      </div>
      <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">Tầng 4: Ứng dụng</div>
      <div className="text-xl font-bold text-white mb-2">User Interaction</div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded">
          <LayoutDashboard className="w-4 h-4 text-orange-400" /> Web Dashboard
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded">
          <Bot className="w-4 h-4 text-emerald-400" /> GenAI Assistant
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2 rounded">
          <Bell className="w-4 h-4 text-red-400" /> SMS/Zalo Alert
        </div>
      </div>
    </GlassCard>
  </div>
);

// 4. Sidebar
const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  onToggleAutoDemo, 
  isAutoDemo
}: { 
  activeTab: string, 
  setActiveTab: (t: string) => void,
  onToggleAutoDemo: () => void,
  isAutoDemo: boolean
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Đã xuất báo cáo: GREEN_SAFE_REPORT_2024.pdf");
    }, 2000);
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'architecture', icon: Layers, label: 'Kiến trúc hệ thống' },
    { id: 'map', icon: MapIcon, label: 'Bản đồ Số' },
    { id: 'devices', icon: Cpu, label: 'Thiết bị AIoT' },
    { id: 'alerts', icon: AlertTriangle, label: 'Cảnh báo' },
  ];

  return (
    <div className="h-full flex flex-col py-6 w-20 lg:w-64 transition-all duration-300 border-r border-white/5 bg-slate-900/50 backdrop-blur-lg fixed lg:static z-50">
      <div className="flex items-center gap-3 px-6 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
          <TreeDeciduous className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col hidden lg:flex">
          <span className="text-lg font-bold text-white tracking-wide">Green Safe</span>
          <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Smart Urban Guard</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
              activeTab === item.id 
                ? 'bg-gradient-to-r from-emerald-500/20 to-transparent text-emerald-300' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {activeTab === item.id && (
              <div className="absolute left-0 h-full w-1 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            )}
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-400' : ''}`} />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </button>
        ))}

        {/* Divider */}
        <div className="h-px bg-white/5 my-2 mx-4"></div>
        
        <div className="text-xs font-bold text-slate-500 px-4 mb-2 uppercase tracking-wider hidden lg:block">Công cụ</div>

        {/* Auto Demo Button */}
        <button
          onClick={onToggleAutoDemo}
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group border ${
            isAutoDemo 
              ? 'border-red-500/30 bg-red-500/10 text-red-400' 
              : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
           {isAutoDemo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 group-hover:text-emerald-400" />}
          <span className="hidden lg:block font-medium">
            {isAutoDemo ? 'Dừng Demo' : 'Auto Demo'}
          </span>
        </button>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200 group"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          ) : (
            <FileText className="w-5 h-5 group-hover:text-emerald-400" />
          )}
          <span className="hidden lg:block font-medium">
            {isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
          </span>
        </button>
      </div>

      <div className="px-6 mt-auto">
        <GlassCard className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 !border-white/5" noPadding>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-slate-200">System Health</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">98.5%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-[98.5%] bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
            </div>
            <div className="mt-2 text-[10px] text-slate-500">Node T-1092 sending data...</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// 5. Stat Card
const StatCard = ({ title, value, subtext, icon: Icon, trend, color = "emerald" }: any) => (
  <GlassCard className="group hover:border-white/20 transition-colors duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
    <div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
    {/* Decoration */}
    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-${color}-500 to-transparent opacity-50`}></div>
  </GlassCard>
);

// 6. Updated AI Chat Widget with Multi-turn Logic
const AIChatWidget = ({ isAutoDemo }: { isAutoDemo: boolean }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'ai', text: 'Xin chào! Tôi là GreenAI. Bạn muốn kiểm tra trạng thái cây hay xem phân tích kiến trúc hệ thống?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto Demo Logic: 3-4 conversation turns
  useEffect(() => {
    let demoInterval: any;
    if (isAutoDemo) {
      const script = [
        { role: 'user', text: "Kiến trúc hệ thống hoạt động thế nào?" },
        { role: 'ai', text: "Hệ thống gồm 4 tầng: (1) Green Node thu thập dữ liệu rung chấn > (2) Gateway TTN & MQTT đẩy dữ liệu về Cloud > (3) AI Core phân tích LSTM & Phát hiện bất thường > (4) Cảnh báo qua Web & Zalo." },
        { role: 'user', text: "Dự báo thời tiết chiều nay?" },
        { role: 'ai', text: "Dữ liệu từ Weather API: Có giông lốc vào lúc 16:00. AI Core khuyến nghị kích hoạt cảnh báo Vàng cho khu vực Thanh Xuân." },
        { role: 'user', text: "Tình trạng Node T-1092 hiện tại?" },
        { role: 'ai', text: "Node T-1092 (Nguyễn Trãi): Góc nghiêng 16°. Cảm biến MPU6050 báo động. Nguy cơ đổ: 92%. Đã gửi SMS cho đội ứng cứu." }
      ];
      
      let step = 0;
      demoInterval = setInterval(() => {
        if (step >= script.length) {
           step = 0; // Loop or stop
           setMessages([{ id: Date.now(), sender: 'ai', text: 'Demo Reset. Tôi có thể giúp gì thêm?' }]);
           return;
        }

        const msg = script[step];
        if (msg.role === 'user') {
          setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: msg.text }]);
          setIsTyping(true);
        } else {
          setIsTyping(false);
          setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: msg.text }]);
        }
        step++;
      }, 4000); // New message every 4 seconds
    }
    return () => clearInterval(demoInterval);
  }, [isAutoDemo]);

  const processResponse = (query: string) => {
    const q = query.toLowerCase();
    setIsTyping(true);
    
    setTimeout(() => {
      let response = "Tôi chưa hiểu rõ câu hỏi. Bạn hãy thử hỏi về 'kiến trúc', 'dự báo' hoặc 'mã cây'.";
      
      if (q.includes("kiến trúc") || q.includes("hoạt động")) {
        response = "Green Safe vận hành trên 4 tầng: Device (ESP32+MPU6050) -> Connectivity (LoRaWAN/MQTT) -> AI Core (Anomaly Detection + LSTM) -> App Layer (Dashboard/Zalo).";
      } else if (q.includes("dự báo") || q.includes("thời tiết")) {
        response = "Mô hình LSTM kết hợp Weather API dự báo: Tăng cường giám sát lúc 16:00 - 17:00 do khả năng có gió giật cấp 7.";
      } else if (q.includes("1092") || q.includes("nguyễn trãi")) {
        response = "Cảnh báo cấp 1: Cây T-1092 tại Nguyễn Trãi đang có độ nghiêng vượt ngưỡng an toàn (15 độ). Đề nghị cử đội xử lý.";
      }

      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    processResponse(input);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <GlassCard className="flex flex-col h-full !p-0" noPadding>
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center animate-pulse-slow">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">GreenAI Assistant</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online • AI Core Active
            </div>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar max-h-[400px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10 focus-within:border-emerald-500/50 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi về kiến trúc, dự báo..." 
            className="bg-transparent border-none outline-none text-sm text-white px-3 py-2 flex-1 placeholder-slate-500"
          />
          <button 
            onClick={handleSend}
            className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-[0_0_10px_rgba(16,185,129,0.4)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

// 7. Simulated Map Widget (Updated with Real Dots and Legend)
const MapWidget = () => {
  // Generate random tree nodes once
  const treeNodes: TreeNode[] = useMemo(() => {
    const nodes: TreeNode[] = [];
    // 1 Critical Node (Fixed for Demo)
    nodes.push({ id: "T-1092", x: 60, y: 40, status: "critical", tilt: 16 });
    // 2 Warning Nodes
    nodes.push({ id: "T-0451", x: 30, y: 70, status: "warning", tilt: 8 });
    nodes.push({ id: "T-0112", x: 80, y: 25, status: "warning", tilt: 7 });

    // 35 Safe Nodes Randomly Placed
    for (let i = 0; i < 35; i++) {
      nodes.push({
        id: `T-${1000 + i}`,
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        status: "safe",
        tilt: Math.random() * 2
      });
    }
    return nodes;
  }, []);

  return (
    <GlassCard className="h-full relative group !p-0 overflow-hidden" noPadding>
      <div className="absolute inset-0 bg-slate-800">
        {/* Fake Map Grid */}
        <div className="w-full h-full opacity-20" style={{ 
          backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}></div>

        {/* Radar Scan Effect */}
        <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 w-[100vh] h-[100vh] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent rotate-45 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
        
        {/* Map Nodes */}
        {treeNodes.map((node) => (
          <div 
            key={node.id}
            className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all duration-300 group/node z-10
              ${node.status === 'critical' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] animate-bounce z-20' : 
                node.status === 'warning' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 
                'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] opacity-80 hover:scale-125'}`
            }
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {/* Tooltip on Hover */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-white/10 px-3 py-2 rounded-lg opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1">
                <TreeDeciduous className={`w-3 h-3 ${node.status === 'critical' ? 'text-red-400' : 'text-emerald-400'}`} />
                <span className="font-bold text-xs text-white">{node.id}</span>
              </div>
              <div className="text-[10px] text-slate-300">Tilt: {node.tilt.toFixed(1)}°</div>
              <div className={`text-[10px] uppercase font-bold ${
                 node.status === 'critical' ? 'text-red-400' : 
                 node.status === 'warning' ? 'text-yellow-400' : 'text-emerald-400'
              }`}>{node.status}</div>
            </div>
            
            {/* Ping effect for critical nodes */}
            {node.status === 'critical' && (
               <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            )}
          </div>
        ))}

        {/* Legend Overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur border border-white/10 p-3 rounded-xl z-20">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Trạng thái cây</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
              An toàn
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></span>
              Cảnh báo (Nghiêng nhẹ)
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
              Nguy hiểm (Sắp đổ)
            </div>
          </div>
        </div>
        
        {/* Map Controls Overlay */}
        <div className="absolute top-4 left-4 flex gap-2 z-20">
          <button className="bg-slate-900/80 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-2">
            <Wifi className="w-3 h-3" />
            LoRaWAN Connected
          </button>
          <button className="bg-emerald-500/10 backdrop-blur border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Live Monitoring
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

// 8. Boot Screen Component
const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Initializing System...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 150);

    const texts = [
      "Loading Green Node Modules...",
      "Connecting to The Things Network...",
      "Syncing with InfluxDB...",
      "Activating LSTM Model...",
      "System Ready."
    ];

    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex++;
      if (textIndex < texts.length) setText(texts[textIndex]);
    }, 600);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0f172a] z-[100] flex flex-col items-center justify-center text-emerald-500">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <TreeDeciduous className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-emerald-400" />
      </div>
      <div className="font-mono text-2xl font-bold tracking-widest mb-2">GREEN SAFE</div>
      <div className="font-mono text-sm text-emerald-400/70 mb-6">{text}</div>
      
      <div className="w-64 h-1 bg-emerald-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-400 transition-all duration-200 ease-out shadow-[0_0_10px_rgba(16,185,129,0.6)]" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 font-mono text-xs text-emerald-600">{progress}%</div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [booted, setBooted] = useState(false);
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [sensorData, setSensorData] = useState({ temp: 28, noise: 60, aqi: 50 });

  // Auto Demo Logic
  useEffect(() => {
    let interval: any;
    if (isAutoDemo) {
      const tabs = ['dashboard', 'architecture', 'map'];
      let currentIndex = tabs.indexOf(activeTab);
      if (currentIndex === -1) currentIndex = 0;
      
      interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[currentIndex]);
      }, 8000); 
    }
    return () => clearInterval(interval);
  }, [isAutoDemo, activeTab]);

  // Real-time Sensor Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const isSpike = Math.random() > 0.85;
      const newTemp = isSpike ? 36 + Math.random() * 5 : 28 + Math.random() * 3;
      const newNoise = isSpike ? 90 + Math.random() * 10 : 50 + Math.random() * 20;
      const newAqi = isSpike ? 160 + Math.random() * 40 : 40 + Math.random() * 40;
      setSensorData({ temp: newTemp, noise: newNoise, aqi: Math.floor(newAqi) });
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  if (!booted) {
    return <BootScreen onComplete={() => setBooted(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200 selection:bg-emerald-500/30 animate-in fade-in duration-700 font-sans">
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onToggleAutoDemo={() => setIsAutoDemo(!isAutoDemo)}
        isAutoDemo={isAutoDemo}
      />

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {activeTab === 'architecture' ? 'System Architecture' : 'Dashboard'}
              <span className="text-emerald-500">.</span>
            </h1>
            <p className="text-slate-400 text-sm">
              {activeTab === 'architecture' 
                ? 'Sơ đồ luồng dữ liệu 4 tầng (Device - Connectivity - AI Core - App)' 
                : 'Chào mừng trở lại. Hệ thống giám sát cây xanh thông minh.'}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full md:w-64 pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 sm:text-sm transition-all duration-200"
                placeholder="Tìm kiếm Node, Khu vực..."
              />
            </div>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}

        {activeTab === 'architecture' ? (
          <ArchitectureDiagram />
        ) : (
          <>
            {/* Real-time Alert Banner */}
            {(sensorData.temp > 35 || sensorData.noise > 85 || sensorData.aqi > 150) && (
              <div className="mb-6 relative overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 p-4 animate-pulse">
                <div className="relative flex items-center gap-4">
                  <div className="flex-shrink-0 p-3 bg-red-500/20 rounded-lg text-red-400">
                    <Flame className="w-8 h-8 animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-400">CẢNH BÁO: CHỈ SỐ VƯỢT NGƯỠNG AN TOÀN</h3>
                    <div className="flex gap-3 mt-1">
                      {sensorData.temp > 35 && <span className="text-xs bg-red-500/20 px-2 py-1 rounded">Temp: {sensorData.temp.toFixed(1)}°C</span>}
                      {sensorData.noise > 85 && <span className="text-xs bg-orange-500/20 px-2 py-1 rounded">Noise: {sensorData.noise.toFixed(0)}dB</span>}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg">Xử lý ngay</button>
                </div>
              </div>
            )}

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard title="Tổng số cây giám sát" value="42,593" subtext="Hà Nội" icon={TreeDeciduous} trend="+125" color="emerald" />
              <StatCard title="Rủi ro cao" value="03" subtext="Cần xử lý gấp" icon={AlertTriangle} trend="Critical" color="red" />
              <StatCard title="Nhiệt độ" value={`${sensorData.temp.toFixed(1)}°C`} subtext={sensorData.temp > 35 ? "Cao" : "Ổn định"} icon={Thermometer} color={sensorData.temp > 35 ? "red" : "blue"} />
              <StatCard title="Không khí (AQI)" value={sensorData.aqi} subtext="Thời gian thực" icon={CloudRain} trend={sensorData.aqi > 150 ? "Xấu" : "Tốt"} color={sensorData.aqi > 150 ? "orange" : "violet"} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Map & Chat */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
                 <div className="h-full"><MapWidget /></div>
                 <div className="h-full flex flex-col gap-6">
                    {/* Forecast Widget (Top Half) */}
                    <div className="flex-1"><RiskForecastWidget /></div>
                    {/* Recent Alerts (Bottom Half) */}
                    <GlassCard className="flex-1 overflow-auto" noPadding>
                       <div className="p-4 border-b border-white/5 font-bold text-white flex justify-between">
                         <span>Cảnh báo gần đây</span>
                         <Activity className="w-4 h-4 text-emerald-400" />
                       </div>
                       <div className="p-2 space-y-2">
                         {ALERTS.map(a => (
                           <div key={a.id} className="p-2 bg-white/5 rounded border border-white/5 flex justify-between items-center">
                             <div>
                               <div className="text-xs font-bold text-white">{a.treeId}</div>
                               <div className="text-[10px] text-slate-400">{a.type}</div>
                             </div>
                             <span className={`text-[10px] px-2 py-0.5 rounded ${a.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                               {a.status}
                             </span>
                           </div>
                         ))}
                       </div>
                    </GlassCard>
                 </div>
              </div>
              
              {/* Chat Sidebar */}
              <div className="h-[500px]">
                <AIChatWidget isAutoDemo={isAutoDemo} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
