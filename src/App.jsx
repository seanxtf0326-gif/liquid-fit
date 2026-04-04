import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, ArrowRight, Command, Activity, Dumbbell, Flame, Moon, CheckCircle, Circle, X, CheckCircle2, CircleDashed, Save, Loader2, Trash2 } from 'lucide-react';

// --- 全局样式与 CSS 变量注入 ---
const globalStyles = `
  :root {
    --bg-base: #f8f9fa;
    --glass-bg: rgba(255, 255, 255, 0.12);
    --text-primary: #1a1a1a;
    --text-secondary: #6e6e73;
    --accent-color: #0071e3;
    --border-light: rgba(255, 255, 255, 0.18);
  }

  body {
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob { animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }

  /* 隐藏滚动条，但保留滚动功能 */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* 针对弹窗等内部保留极简滚动条 */
  .custom-scrollbar { overscroll-behavior: contain; }
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.3); }

  /* --- TrueFocus 特效样式 --- */
  .focus-container { position: relative; display: flex; gap: 0.6em; align-items: center; justify-content: center; flex-wrap: wrap; outline: none; user-select: none; }
  .focus-word { position: relative; font-size: 3.5rem; font-weight: 900; cursor: pointer; transition: filter 0.3s ease, color 0.3s ease; outline: none; user-select: none; }
  @media (min-width: 640px) { .focus-word { font-size: 5.5rem; gap: 0.8em; } }
  .focus-word.active { filter: blur(0); }
  .focus-frame { position: absolute; top: 0; left: 0; pointer-events: none; box-sizing: content-box; border: none; }
  .corner { position: absolute; width: 1rem; height: 1rem; border: 3px solid var(--border-color, #fff); filter: drop-shadow(0px 0px 4px var(--border-color, #fff)); border-radius: 3px; transition: none; }
  .top-left { top: -10px; left: -10px; border-right: none; border-bottom: none; }
  .top-right { top: -10px; right: -10px; border-left: none; border-bottom: none; }
  .bottom-left { bottom: -10px; left: -10px; border-right: none; border-top: none; }
  .bottom-right { bottom: -10px; right: -10px; border-left: none; border-top: none; }
`;

// --- 渐入动画组件 ---
const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- TrueFocus 动画组件 ---
const TrueFocus = ({
  sentence = 'True Focus', separator = ' ', manualMode = false, blurAmount = 5,
  borderColor = 'green', glowColor = 'rgba(0, 255, 0, 0.6)', animationDuration = 0.5, pauseBetweenAnimations = 1
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % words.length);
      }, (animationDuration + pauseBetweenAnimations) * 1000);
      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();
    setFocusRect({
      x: activeRect.left - parentRect.left, y: activeRect.top - parentRect.top,
      width: activeRect.width, height: activeRect.height
    });
  }, [currentIndex, words.length]);

  return (
    <div className="focus-container" ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span key={index} ref={el => (wordRefs.current[index] = el)}
            className={`focus-word text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'active' : ''}`}
            style={{
              filter: manualMode ? (isActive ? `blur(0px)` : `blur(${blurAmount}px)`) : (isActive ? `blur(0px)` : `blur(${blurAmount}px)`),
              '--border-color': borderColor, '--glow-color': glowColor, transition: `filter ${animationDuration}s ease`
            }}
            onMouseEnter={() => { if (manualMode) { setLastActiveIndex(index); setCurrentIndex(index); } }}
            onMouseLeave={() => { if (manualMode) setCurrentIndex(lastActiveIndex); }}
          >
            {word}
          </span>
        );
      })}
      <motion.div className="focus-frame"
        animate={{ x: focusRect.x, y: focusRect.y, width: focusRect.width, height: focusRect.height, opacity: currentIndex >= 0 ? 1 : 0 }}
        transition={{ duration: animationDuration }}
        style={{ '--border-color': borderColor, '--glow-color': glowColor }}
      >
        <span className="corner top-left"></span><span className="corner top-right"></span>
        <span className="corner bottom-left"></span><span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
};

// --- 动作数据库 ---
const exerciseDB = {
    '标准俯卧撑': { reps: '8-12个', sets: '4组', icon: 'Activity', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    '折刀俯卧撑': { reps: '8-12个', sets: '4组', icon: 'Zap', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    '宽距俯卧撑': { reps: '12个', sets: '4组', icon: 'Dumbbell', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    '爱心形俯卧撑': { reps: '8-12个', sets: '4组', icon: 'Flame', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    '宽距引体向上': { reps: '按需(5-8个)', sets: '4组', icon: 'Activity', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
    '两头起': { reps: '10-15个', sets: '4组', icon: 'Zap', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    '举腿': { reps: '10-15个', sets: '4组', icon: 'Dumbbell', color: 'bg-pink-100 text-pink-600 border-pink-200' }
};

// --- 30天核心训练数据 ---
const planData = [
    { day: 1, type: '训练日', target: '全身综合激活与胸臂雕刻（主攻上腹）', exercises: ['标准俯卧撑', '宽距俯卧撑', '爱心形俯卧撑', '两头起'], replacements: '跪姿/标准钻石俯卧撑/卷腹。', message: '万事开头难，欢迎开启蜕变之旅！' },
    { day: 2, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '休息也是训练的一部分，保证充足睡眠和蛋白质摄入！' },
    { day: 3, type: '训练日', target: '打造倒三角与肩宽腰细视觉（主攻下腹）', exercises: ['标准俯卧撑', '折刀俯卧撑', '宽距引体向上', '举腿'], replacements: '弹力带辅助/扩间距/屈膝举腿。', message: '背部和下腹是新手的薄弱区，注意收紧核心！' },
    { day: 4, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '今天可能会感到明显的肌肉酸痛，多喝水，做轻度拉伸。' },
    { day: 5, type: '训练日', target: '全身综合激活与胸臂雕刻（主攻上腹）', exercises: ['标准俯卧撑', '宽距俯卧撑', '爱心形俯卧撑', '两头起'], replacements: '', message: '建立“念动一致”，把注意力集中在发力的肌肉上。' },
    { day: 6, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '三分练七分吃，保证足够的碳水摄入提供燃料。' },
    { day: 7, type: '训练日', target: '打造倒三角与肩宽腰细视觉（主攻下腹）', exercises: ['标准俯卧撑', '折刀俯卧撑', '宽距引体向上', '举腿'], replacements: '', message: '折刀俯卧撑是拓宽肩部利器，控制下落速度！' },
    { day: 8, type: '休息日', target: '全身系统恢复', exercises: [], replacements: '', message: '坚持完第一周！享受微微疲惫但充满力量的感觉。' },
    { day: 9, type: '训练日', target: '全身综合激活与胸臂雕刻（主攻上腹）', exercises: ['标准俯卧撑', '宽距俯卧撑', '爱心形俯卧撑', '两头起'], replacements: '', message: '优先保证动作质量，宁可做8个标准的也不做变形的。' },
    { day: 10, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '进度条达三分之一！把打卡变成像刷牙一样的习惯。' },
    { day: 11, type: '训练日', target: '打造倒三角与肩宽腰细视觉（主攻下腹）', exercises: ['标准俯卧撑', '折刀俯卧撑', '宽距引体向上', '举腿'], replacements: '', message: '背阔肌决定气场，想象把手肘往下往肋骨方向拉。' },
    { day: 12, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '出门散个步，良好的血液循环有助于带走代谢废物。' },
    { day: 13, type: '训练日', target: '全身综合激活与胸臂雕刻（主攻上腹）', exercises: ['标准俯卧撑', '宽距俯卧撑', '爱心形俯卧撑', '两头起'], replacements: '', message: '突破瓶颈期，当你觉得做不下去时，咬牙再完成最后两个！' },
    { day: 14, type: '休息日', target: '心理与生理双重放松', exercises: [], replacements: '', message: '两周达成！肌肉充血感和核心紧绷感一定更强了。' },
    { day: 15, type: '训练日', target: '打造倒三角与肩宽腰细视觉（主攻下腹）', exercises: ['标准俯卧撑', '折刀俯卧撑', '宽距引体向上', '举腿'], replacements: '', message: '控制！离心收缩才是最撕裂肌肉的阶段。' },
    { day: 16, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '行程过半，现在最容易放弃，坚持下去就是胜利！' },
    { day: 17, type: '训练日', target: '全身综合激活与胸臂雕刻（主攻上腹）', exercises: ['标准俯卧撑', '宽距俯卧撑', '爱心形俯卧撑', '两头起'], replacements: '', message: '宽距练胸轮廓，爱心形练手臂线条，全方位雕刻！' },
    { day: 18, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '薄肌身材的秘诀在于极低的体脂和恰到好处的肌肉量。' },
    { day: 19, type: '训练日', target: '打造倒三角与肩宽腰细视觉（主攻下腹）', exercises: ['标准俯卧撑', '折刀俯卧撑', '宽距引体向上', '举腿'], replacements: '', message: '肩宽了，腰在视觉上就细了。感受肩前束的燃烧！' },
    { day: 20, type: '休息日', target: '全身系统恢复', exercises: [], replacements: '', message: '三分之二旅程完成！今晚给自己加个鸡腿（去皮）！' },
    { day: 21, type: '训练日', target: '全身综合激活与胸臂雕刻（主攻上腹）', exercises: ['标准俯卧撑', '宽距俯卧撑', '爱心形俯卧撑', '两头起'], replacements: '', message: '挑战自我！尝试将动作做到极致的慢。' },
    { day: 22, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '关注身体反馈，有轻微关节不适及时调整动作角度。' },
    { day: 23, type: '训练日', target: '打造倒三角与肩宽腰细视觉（主攻下腹）', exercises: ['标准俯卧撑', '折刀俯卧撑', '宽距引体向上', '举腿'], replacements: '', message: '每一次举腿都在为你下腹部的线条打基础。' },
    { day: 24, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '胜利在望，你应该已经能感受内啡肽带来的快乐了。' },
    { day: 25, type: '训练日', target: '全身综合激活与胸臂雕刻（主攻上腹）', exercises: ['标准俯卧撑', '宽距俯卧撑', '爱心形俯卧撑', '两头起'], replacements: '', message: '核心收紧是一切的基础，腹肌应处于发力绷紧状态。' },
    { day: 26, type: '休息日', target: '心理与生理双重放松', exercises: [], replacements: '', message: '回想第一天的艰辛，看看现在的从容，这是自律的奖励。' },
    { day: 27, type: '训练日', target: '打造倒三角与肩宽腰细视觉（主攻下腹）', exercises: ['标准俯卧撑', '折刀俯卧撑', '宽距引体向上', '举腿'], replacements: '', message: '最后一次强化，榨干你肌肉里最后一丝力气！' },
    { day: 28, type: '休息日', target: '肌肉恢复与生长', exercises: [], replacements: '', message: '快到终点了，保持优质睡眠，为最后一次训练储备能量。' },
    { day: 29, type: '训练日', target: '全身综合激活与胸臂雕刻（主攻上腹）', exercises: ['标准俯卧撑', '宽距俯卧撑', '爱心形俯卧撑', '两头起'], replacements: '', message: '第30天的前哨战！展现你的训练成果！' },
    { day: 30, type: '休息日', target: '全面恢复与新阶段规划', exercises: [], replacements: '', message: '恭喜完成挑战！休息后可开启新一轮更高强度的训练。' }
];

const renderIcon = (iconName, className) => {
    switch(iconName) {
        case 'Zap': return <Zap className={className} strokeWidth={2.5} />;
        case 'Dumbbell': return <Dumbbell className={className} strokeWidth={2.5} />;
        case 'Flame': return <Flame className={className} strokeWidth={2.5} />;
        case 'Activity': default: return <Activity className={className} strokeWidth={2.5} />;
    }
};

const ExerciseMiniIcon = ({ name }) => {
    const config = exerciseDB[name] || { icon: 'Activity', color: 'bg-gray-100 text-gray-600 border-gray-200' };
    return (
        <div className={`w-8 h-8 rounded-full ${config.color} p-1.5 flex items-center justify-center border shadow-sm -ml-2 first:ml-0 opacity-90 group-hover:opacity-100 transition-transform group-hover:scale-110 backdrop-blur-md`} title={name}>
            {renderIcon(config.icon, "w-full h-full")}
        </div>
    );
};

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedDay, setSelectedDay] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving'
  
  // --- 交互状态 ---
  const [isPastHero, setIsPastHero] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const isNavExpanded = !isPastHero || isNavHovered || isDropdownOpen || isSettingsOpen;
  const lenisRef = useRef(null);

  // --- 初始化：从浏览器本地存储加载进度 ---
  useEffect(() => {
    const localData = localStorage.getItem('liquid-fit-data-v1');
    if (localData) {
      try {
        setCompletedDays(JSON.parse(localData));
      } catch (e) {
        console.error("Local data parse error", e);
      }
    }
  }, []);

  // --- 保存：持久化到 localStorage ---
  const toggleComplete = (day) => {
    setSaveStatus('saving');
    let newCompleted = completedDays.includes(day) ? completedDays.filter(d => d !== day) : [...completedDays, day];
    
    // 状态更新与本地同步
    setCompletedDays(newCompleted); 
    localStorage.setItem('liquid-fit-data-v1', JSON.stringify(newCompleted));
    
    // 模拟保存反馈
    setTimeout(() => setSaveStatus('saved'), 600);
  };

  const handleClearAll = () => {
    setCompletedDays([]);
    localStorage.removeItem('liquid-fit-data-v1');
    setIsSettingsOpen(false);
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 600);
  };

  // --- 初始化 Lenis 平滑滚动 ---
  useEffect(() => {
    let lenis;
    let rafId;
    const initLenis = () => {
      if (!window.Lenis) return;
      lenisRef.current = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true,
        smoothTouch: false, 
      });
      function raf(time) {
        lenisRef.current.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    };

    if (!window.Lenis) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
      script.async = true;
      script.onload = initLenis;
      document.head.appendChild(script);
    } else {
      initLenis();
    }

    const handleScroll = () => setIsPastHero(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToDay = (day) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        lenisRef.current?.scrollTo(`#day-${day}`, { offset: -100, duration: 1.5 });
      }, 150);
    } else {
      lenisRef.current?.scrollTo(`#day-${day}`, { offset: -100, duration: 1.5 });
    }
  };

  const uncompletedPlans = planData.filter(d => !completedDays.includes(d.day));
  const completedPlans = planData.filter(d => completedDays.includes(d.day));
  const progressPercentage = Math.round((completedDays.length / 30) * 100);

  const renderCard = (data) => {
    const isRest = data.type === '休息日';
    const isCompleted = completedDays.includes(data.day);
    
    return (
      <div id={`day-${data.day}`} key={data.day} onClick={() => setSelectedDay(data)}
        className={`backdrop-blur-2xl saturate-180 bg-white/40 border border-white/40 rounded-3xl shadow-lg p-6 flex flex-col hover:-translate-y-2 hover:shadow-xl hover:bg-white/60 transition-all duration-500 cursor-pointer group relative overflow-hidden ${isCompleted ? 'ring-2 ring-[var(--accent-color)] bg-white/60' : ''}`}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <span className={`text-4xl font-bold tracking-tighter transition-colors ${isCompleted ? 'text-[var(--accent-color)]' : 'text-gray-400 group-hover:text-gray-500'}`}>D{data.day}</span>
          <div className="flex gap-2">
            {isCompleted && (<span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-blue-100 text-[var(--accent-color)] border border-blue-200 flex items-center shadow-sm"><CheckCircle className="w-3 h-3 mr-1" /> 已完成</span>)}
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 shadow-sm backdrop-blur-md ${isRest ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>{isRest ? <Moon className="w-3 h-3" /> : <Flame className="w-3 h-3" />} {data.type}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold min-h-[56px] leading-snug relative z-10 text-[var(--text-primary)]">{data.target}</h3>
        {!isRest && data.exercises?.length > 0 ? (
          <div className="flex mt-4 mb-4 items-center relative z-10"><div className="flex pl-2">{data.exercises.map((ex, i) => <ExerciseMiniIcon key={i} name={ex} />)}</div></div>
        ) : (<div className="h-12 mt-4 mb-4 relative z-10"></div>)}
        <div className="mt-auto pt-4 border-t border-[var(--border-light)] flex items-center justify-between text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] font-medium transition-colors relative z-10">
          <span>查看详情</span><ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-[var(--accent-color)] selection:text-white pb-20">
      <style>{globalStyles}</style>

      {/* --- 全屏沉浸式下拉模糊遮罩 --- */}
      <AnimatePresence>
        {(isDropdownOpen || isSettingsOpen) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-xl pointer-events-none" />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100 mix-blend-multiply filter blur-[120px] opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-100 mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-cyan-50 mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <nav onMouseEnter={() => setIsNavHovered(true)} onMouseLeave={() => setIsNavHovered(false)}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 backdrop-blur-2xl saturate-180 bg-white/40 border border-white/40 rounded-full shadow-lg h-14 flex items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isNavExpanded ? 'w-11/12 max-w-2xl px-2 sm:px-6 justify-between' : 'w-14 justify-center cursor-pointer delay-100'}`}
      >
        <div className={`flex items-center gap-2 text-[var(--text-primary)] group flex-shrink-0 transition-all duration-500 z-20 ${!isNavExpanded ? 'justify-center w-full' : 'pl-2 cursor-pointer'}`} onClick={() => { setCurrentView('home'); lenisRef.current?.scrollTo(0); }}>
          <Command className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90 flex-shrink-0" />
          <AnimatePresence>
              {isNavExpanded && (<motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="font-semibold tracking-tight text-lg hidden sm:block whitespace-nowrap overflow-hidden">Liquid Fit</motion.span>)}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {isNavExpanded && (
            <motion.div initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }} animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }} exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }} transition={{ duration: 0.3 }} className="flex gap-2 sm:gap-6 text-sm font-semibold text-[var(--text-secondary)] h-full items-center absolute left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
              <div className="relative group flex items-center h-full px-2" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                <span className={`cursor-pointer hover:text-[var(--text-primary)] transition-colors duration-300 ${currentView === 'home' ? 'text-[var(--text-primary)]' : ''}`} onClick={() => setCurrentView('home')}>计划概览</span>
                <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-[80vw] sm:w-[50vw] bg-white/80 backdrop-blur-3xl border border-white/50 rounded-3xl shadow-2xl flex-col p-4 max-h-[60vh] overflow-y-auto no-scrollbar overscroll-contain opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top scale-95 group-hover:scale-100 hidden sm:flex" data-lenis-prevent="true">
                    {planData.map(d => (
                        <div key={d.day} onClick={() => { scrollToDay(d.day); setIsDropdownOpen(false); }} className="px-6 py-4 rounded-2xl hover:bg-black/5 cursor-pointer transition-colors flex justify-between items-center group/item">
                            <span className="font-black italic tracking-tighter text-2xl sm:text-4xl text-[var(--text-primary)] opacity-80 group-hover/item:opacity-100 group-hover/item:text-[var(--accent-color)] uppercase transform -skew-x-6 transition-all">DAY {d.day}</span>
                            {completedDays.includes(d.day) ? (<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--accent-color)] transition-transform group-hover/item:scale-110" />) : (<Circle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 opacity-50 transition-transform group-hover/item:scale-110" />)}
                        </div>
                    ))}
                </div>
              </div>
              <div className="flex items-center h-full px-2"><span className={`cursor-pointer hover:text-[var(--text-primary)] transition-colors duration-300 ${currentView === 'records' ? 'text-[var(--text-primary)]' : ''}`} onClick={() => { setCurrentView('records'); lenisRef.current?.scrollTo(0); }}>打卡记录</span></div>
              <div className="relative group flex items-center h-full px-2" onMouseEnter={() => setIsSettingsOpen(true)} onMouseLeave={() => setIsSettingsOpen(false)}>
                <span className="cursor-pointer hover:text-[var(--text-primary)] transition-colors duration-300">设置</span>
                <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-48 bg-white/80 backdrop-blur-3xl border border-white/50 rounded-2xl shadow-2xl flex-col p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top scale-95 group-hover:scale-100 hidden sm:flex">
                    <div onClick={handleClearAll} className="px-4 py-3 rounded-xl hover:bg-red-50 cursor-pointer transition-colors flex items-center gap-2 group/item"><Trash2 className="w-4 h-4 text-red-500 opacity-80 group-hover/item:opacity-100" /><span className="font-semibold text-sm text-red-500 opacity-80 group-hover/item:opacity-100">一键清空计划</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isNavExpanded && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/60 text-[var(--accent-color)] text-xs font-bold shadow-sm whitespace-nowrap flex-shrink-0 z-20">
              {saveStatus === 'saving' && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
              {saveStatus === 'saved' && <Save className="w-3 h-3 text-green-500" title="已本地保存" />}
              <span>进度 {progressPercentage}%</span>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10 pt-32 sm:pt-40 px-6 max-w-7xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
            {currentView === 'home' && (
                <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    <section className="flex flex-col items-center justify-center text-center pb-20">
                        <FadeIn><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/40 bg-white/30 backdrop-blur-xl mb-8 text-sm font-medium text-[var(--text-secondary)] shadow-sm"><Sparkles className="w-4 h-4 text-[var(--accent-color)]" /><span>清爽薄肌 · 专属定制</span></div></FadeIn>
                        <FadeIn delay={0.1}>
                            <div className="mb-6 max-w-4xl mx-auto"><TrueFocus sentence="30 天蜕变" manualMode={false} blurAmount={5} borderColor="#06b6d4" glowColor="rgba(6, 182, 212, 0.6)" animationDuration={0.6} pauseBetweenAnimations={1.5} /></div>
                        </FadeIn>
                        <FadeIn delay={0.2}><p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-light">居家无器械，隔天循环，精准雕刻核心线条。<br className="hidden sm:block" />保持专注，享受每一次流汗的瞬间。</p></FadeIn>
                    </section>
                    <section className="mb-20"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{planData.map((data, index) => (<FadeIn key={data.day} delay={(index % 10) * 0.05} className="h-full">{renderCard(data)}</FadeIn>))}</div></section>
                </motion.div>
            )}
            {currentView === 'records' && (
                <motion.div key="records" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">打卡里程碑</h2><p className="text-[var(--text-secondary)]">回顾你的努力，规划下一步的蜕变。</p></div>
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-8"><CircleDashed className="w-6 h-6 text-orange-500" /><h3 className="text-2xl font-bold text-[var(--text-primary)]">待打卡任务 ({uncompletedPlans.length})</h3></div>
                        {uncompletedPlans.length === 0 ? (<div className="py-12 text-center bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl text-[var(--text-secondary)] font-medium">太棒了！所有的任务都已经完成啦！</div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{uncompletedPlans.map(data => renderCard(data))}</div>)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-8"><CheckCircle2 className="w-6 h-6 text-green-500" /><h3 className="text-2xl font-bold text-[var(--text-primary)]">已达成记录 ({completedPlans.length})</h3></div>
                        {completedPlans.length === 0 ? (<div className="py-12 text-center bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl text-[var(--text-secondary)] font-medium">还没有已完成的记录，去开启第一天的训练吧！</div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-80 hover:opacity-100 transition-opacity">{completedPlans.map(data => renderCard(data))}</div>)}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* Footer - 创作者信息 */}
      <footer className="relative z-10 py-8 px-6 text-center">
        <div className="backdrop-blur-2xl saturate-180 bg-white/30 border border-white/40 rounded-2xl max-w-md mx-auto py-4 px-6 shadow-lg">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            创作者：<span className="font-bold text-[var(--accent-color)]">ARIES</span>
          </p>
        </div>
      </footer>

      <AnimatePresence>
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setSelectedDay(null)}></motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative backdrop-blur-2xl saturate-180 bg-white/70 border border-white/50 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar overscroll-contain" data-lenis-prevent="true">
            <button onClick={() => setSelectedDay(null)} className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-white/50 hover:bg-white rounded-full p-2 shadow-sm border border-[var(--border-light)]"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">Day {selectedDay.day}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1.5 shadow-sm ${selectedDay.type === '休息日' ? 'bg-indigo-50/80 text-indigo-600 border-indigo-200' : 'bg-orange-50/80 text-orange-600 border-orange-200'}`}>{selectedDay.type === '休息日' ? <Moon className="w-4 h-4" /> : <Flame className="w-4 h-4" />} {selectedDay.type}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-8 leading-tight">{selectedDay.target}</h3>
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm text-[var(--text-secondary)] mb-3 flex items-center gap-2 font-medium"><Activity className="w-4 h-4" /> {selectedDay.type === '休息日' ? '今日安排' : '核心动作与精准频次'}</h4>
                    {selectedDay.type === '休息日' || !selectedDay.exercises?.length ? (
                        <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 text-indigo-900 font-medium flex items-center gap-4 shadow-sm"><div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center"><Moon className="w-6 h-6 text-indigo-500" /></div><p className="font-light">今日重点在于休息与营养，让肌肉充分恢复生长，无需核心训练。</p></div>
                    ) : (<div className="space-y-3">{selectedDay.exercises.map((exName, idx) => {
                        const exDetails = exerciseDB[exName] || { reps: '-', sets: '-', icon: 'Activity', color: 'bg-gray-100 text-gray-600 border-gray-200' };
                        return (<div key={idx} className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white/60 hover:bg-white/80 transition-colors shadow-sm"><div className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl ${exDetails.color} flex items-center justify-center shadow-inner border`}>{renderIcon(exDetails.icon, "w-8 h-8 sm:w-10 sm:h-10 opacity-80")}</div><div className="flex-1"><div className="text-[var(--text-primary)] font-semibold text-lg">{exName}</div><div className="flex flex-wrap gap-2 mt-2"><span className="text-[var(--text-secondary)] text-sm flex items-center gap-1.5 font-medium bg-white/60 px-2.5 py-1 rounded-md border border-white/70"><Activity className="w-3.5 h-3.5" /> 每组 {exDetails.reps}</span><span className="text-[var(--text-secondary)] text-sm flex items-center gap-1.5 font-medium bg-white/60 px-2.5 py-1 rounded-md border border-white/70"><Circle className="w-3.5 h-3.5" /> 共 {exDetails.sets}</span></div></div></div>);
                    })}</div>)}
                </div>
                {selectedDay.replacements && (<div><h4 className="text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2 font-medium"><Zap className="w-4 h-4" />新手替换方案</h4><div className="bg-white/50 rounded-2xl p-4 border border-white/60 text-[var(--text-primary)] text-sm leading-relaxed shadow-sm font-light">{selectedDay.replacements}</div></div>)}
                <div><h4 className="text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2 font-medium"><CheckCircle className="w-4 h-4" />教练寄语</h4><div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 text-blue-900 italic leading-relaxed relative overflow-hidden shadow-sm font-light"><div className="absolute top-0 right-0 text-6xl opacity-10 font-serif leading-none pt-2 pr-4 text-blue-500">"</div>{selectedDay.message}</div></div>
                <div className="pt-4 mt-6">
                    <button onClick={() => toggleComplete(selectedDay.day)} className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-95 ${completedDays.includes(selectedDay.day) ? 'bg-white/90 text-[var(--text-primary)] border border-white shadow-sm' : 'bg-[var(--accent-color)] text-white hover:bg-blue-600 hover:shadow-blue-500/25 hover:-translate-y-1'}`}>{completedDays.includes(selectedDay.day) ? <><CheckCircle className="w-6 h-6 text-green-500" /> 已完成今日任务</> : <><Circle className="w-6 h-6" /> 标记为已完成</>}</button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}