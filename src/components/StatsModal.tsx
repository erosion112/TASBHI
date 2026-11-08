import React from 'react';
import { X, Flame, Award, BarChart2, CheckCircle2 } from 'lucide-react';
import { UserStats, ThemeMode, ZikrItem } from '../types';
import { THEMES } from '../utils/theme';
import { getTodayDateString } from '../utils/storage';

interface StatsModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  stats: UserStats;
  adhkarList: ZikrItem[];
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  theme,
  stats,
  adhkarList,
  onClose
}) => {
  if (!isOpen) return null;

  const currentTheme = THEMES[theme] || THEMES['cyber-emerald'];
  const today = getTodayDateString();
  const todayCount = stats.dailyHistory[today] || 0;

  // Last 7 days breakdown
  const last7Days: { date: string; label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    last7Days.push({
      date: dateKey,
      label: dayLabel,
      count: stats.dailyHistory[dateKey] || 0
    });
  }

  const maxCountInWeek = Math.max(...last7Days.map(d => d.count), 50);

  // Spiritual Milestones definitions
  const milestones = [
    { title: 'The First Bead', desc: 'Completed your very first dhikr', target: 1 },
    { title: 'Fatimah Cycle', desc: '100 Adhkar praise completed', target: 100 },
    { title: 'Steadfast Light', desc: '500 Adhkar accumulated', target: 500 },
    { title: 'Devoted Heart', desc: '1,000 Adhkar recorded', target: 1000 },
    { title: 'Spiritual Radiance', desc: '5,000 Adhkar recorded', target: 5000 },
    { title: 'Enduring Dhikr', desc: '10,000 Adhkar reached', target: 10000 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
      <div 
        className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#070D14] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        style={{
          boxShadow: `0 0 35px ${currentTheme.beadGlow}`
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5" style={{ color: currentTheme.primaryNeon }} />
            <h2 className="text-base font-bold text-white tracking-tight">
              Spiritual Metrics & Milestones
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Top KPI Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Streak</span>
              </div>
              <span className="text-2xl font-mono-tabular font-extrabold text-white">
                {stats.currentStreak}d
              </span>
              <span className="text-[10px] text-slate-400">Best: {stats.bestStreak}d</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Today</span>
              <span 
                className="text-2xl font-mono-tabular font-extrabold"
                style={{ color: currentTheme.primaryNeon }}
              >
                {todayCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">Total counted</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">All-Time</span>
              <span className="text-2xl font-mono-tabular font-extrabold text-white">
                {stats.totalDhikrCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">Lifetime beads</span>
            </div>
          </div>

          {/* 7-Day Activity Chart */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <h3 className="text-xs font-bold text-slate-200 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Past 7 Days Rhythm</span>
              <span className="text-[10px] text-slate-400 font-normal">Daily Count</span>
            </h3>

            <div className="flex items-end justify-between gap-2 h-28 pt-4 pb-1">
              {last7Days.map((day, idx) => {
                const heightPct = Math.max(8, (day.count / maxCountInWeek) * 100);
                const isToday = day.date === today;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[9px] font-mono-tabular text-slate-400 mb-1 group-hover:text-white transition-colors">
                      {day.count > 0 ? day.count : ''}
                    </span>
                    <div className="w-full max-w-[28px] bg-slate-800/80 rounded-t-md relative overflow-hidden flex items-end h-full">
                      <div
                        className="w-full rounded-t-md transition-all duration-300"
                        style={{
                          height: `${heightPct}%`,
                          background: isToday
                            ? `linear-gradient(to top, ${currentTheme.primaryNeon}, ${currentTheme.secondaryNeon})`
                            : 'rgba(255, 255, 255, 0.25)',
                          boxShadow: isToday ? `0 0 10px ${currentTheme.primaryNeon}` : 'none'
                        }}
                      />
                    </div>
                    <span className={`text-[10px] mt-1.5 font-medium ${isToday ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spiritual Milestones List */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Spiritual Milestones</span>
            </div>

            <div className="space-y-2">
              {milestones.map((ms, idx) => {
                const isCompleted = stats.totalDhikrCount >= ms.target;
                const progress = Math.min(100, Math.round((stats.totalDhikrCount / ms.target) * 100));

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-amber-400/[0.06] border-amber-400/30'
                        : 'bg-white/[0.02] border-white/5 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-4 h-4 ${isCompleted ? 'text-amber-400' : 'text-slate-600'}`}
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{ms.title}</span>
                            <span className="text-[10px] font-mono-tabular text-slate-400 font-normal">
                              ({ms.target.toLocaleString()})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">{ms.desc}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono-tabular font-bold text-slate-300">
                        {isCompleted ? 'Achieved' : `${progress}%`}
                      </span>
                    </div>

                    {!isCompleted && (
                      <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dhikr Breakdown by Type */}
          {Object.keys(stats.dhikrBreakdown).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Recitation Breakdown
              </h3>
              <div className="space-y-1.5">
                {Object.entries(stats.dhikrBreakdown).map(([zid, cnt]) => {
                  const match = adhkarList.find(a => a.id === zid);
                  const name = match ? match.transliteration : zid;
                  return (
                    <div
                      key={zid}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                    >
                      <span className="text-slate-300 font-medium truncate pr-2">{name}</span>
                      <span className="font-mono-tabular font-bold text-white shrink-0">
                        {cnt.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
