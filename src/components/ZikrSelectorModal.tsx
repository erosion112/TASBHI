import React, { useState } from 'react';
import { X, Plus, Sparkles, Check, Trash2, BookOpen } from 'lucide-react';
import { ZikrItem, ThemeMode } from '../types';
import { THEMES } from '../utils/theme';

interface ZikrSelectorModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  currentZikrId: string;
  adhkarList: ZikrItem[];
  onSelectZikr: (zikr: ZikrItem) => void;
  onAddCustomZikr: (zikr: ZikrItem) => void;
  onDeleteCustomZikr: (id: string) => void;
  onClose: () => void;
}

export const ZikrSelectorModal: React.FC<ZikrSelectorModalProps> = ({
  isOpen,
  theme,
  currentZikrId,
  adhkarList,
  onSelectZikr,
  onAddCustomZikr,
  onDeleteCustomZikr,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // Form states for custom dhikr
  const [customArabic, setCustomArabic] = useState('');
  const [customTranslit, setCustomTranslit] = useState('');
  const [customTranslation, setCustomTranslation] = useState('');
  const [customMeaning, setCustomMeaning] = useState('');
  const [customTarget, setCustomTarget] = useState(33);

  if (!isOpen) return null;

  const currentTheme = THEMES[theme] || THEMES['cyber-emerald'];

  const categories = [
    { id: 'all', name: 'All Adhkar' },
    { id: 'tasbih-fatimah', name: 'Tasbih Fatimah' },
    { id: 'daily', name: 'Daily Essential' },
    { id: 'forgiveness', name: 'Forgiveness' },
    { id: 'praise', name: 'Praise & Glory' },
    { id: 'custom', name: 'My Custom' }
  ];

  const filteredList = adhkarList.filter(item => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'custom') return item.isCustom;
    return item.category === selectedCategory;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTranslit.trim()) return;

    const newZikr: ZikrItem = {
      id: `custom_${Date.now()}`,
      arabic: customArabic.trim() || customTranslit.trim(),
      transliteration: customTranslit.trim(),
      translation: customTranslation.trim() || 'Custom Supplication',
      meaning: customMeaning.trim() || 'Personal invocation and remembrance of Allah.',
      defaultTarget: customTarget || 33,
      category: 'custom',
      isCustom: true
    };

    onAddCustomZikr(newZikr);
    onSelectZikr(newZikr);
    setIsCreatingCustom(false);
    setCustomArabic('');
    setCustomTranslit('');
    setCustomTranslation('');
    setCustomMeaning('');
    setCustomTarget(33);
  };

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
            <BookOpen className="w-5 h-5" style={{ color: currentTheme.primaryNeon }} />
            <h2 className="text-base font-bold text-white tracking-tight">
              Select Supplication (Dhikr)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 p-3 overflow-x-auto border-b border-white/5 shrink-0 no-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setIsCreatingCustom(false);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
                style={{
                  backgroundColor: isSelected ? currentTheme.primaryNeon : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#000000' : '#94A3B8',
                  boxShadow: isSelected ? `0 0 10px ${currentTheme.primaryNeon}` : 'none'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {/* New Custom Dhikr Button / Form Toggle */}
          {!isCreatingCustom ? (
            <button
              onClick={() => setIsCreatingCustom(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-dashed border-white/20 hover:border-white/40 text-slate-300 hover:text-white text-xs font-semibold bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" style={{ color: currentTheme.primaryNeon }} />
              <span>Create Custom Supplication / Dua</span>
            </button>
          ) : (
            <form onSubmit={handleCreateCustom} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.primaryNeon }} />
                  New Custom Dhikr
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingCustom(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Arabic Text (Optional)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={customArabic}
                  onChange={e => setCustomArabic(e.target.value)}
                  placeholder="سُبْحَانَ ٱللَّٰهِ"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-arabic text-lg focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Title / Transliteration *</label>
                  <input
                    type="text"
                    required
                    value={customTranslit}
                    onChange={e => setCustomTranslit(e.target.value)}
                    placeholder="e.g. Rabbana Atina"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Count</label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={customTarget}
                    onChange={e => setCustomTarget(parseInt(e.target.value) || 33)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono-tabular focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">English Translation</label>
                <input
                  type="text"
                  value={customTranslation}
                  onChange={e => setCustomTranslation(e.target.value)}
                  placeholder="e.g. Our Lord, give us good in this world"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl text-xs font-bold text-black transition-all cursor-pointer active:scale-98"
                style={{ backgroundColor: currentTheme.primaryNeon }}
              >
                Save & Set Active
              </button>
            </form>
          )}

          {/* Adhkar Items List */}
          {filteredList.map(item => {
            const isSelected = item.id === currentZikrId;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectZikr(item);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-white/[0.08] border-cyan-400/40 shadow-lg'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {item.transliteration}
                      </span>
                      {isSelected && (
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: currentTheme.primaryNeon }}
                        >
                          <Check className="w-2.5 h-2.5 text-black" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {item.translation}
                    </span>
                  </div>

                  <span 
                    className="font-arabic text-xl text-right text-slate-100 shrink-0 font-medium"
                    dir="rtl"
                  >
                    {item.arabic}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 mt-1 border-t border-white/5">
                  <span className="truncate pr-2">{item.meaning}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono-tabular text-slate-400">
                      Target: {item.defaultTarget}
                    </span>
                    {item.isCustom && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteCustomZikr(item.id);
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete custom dhikr"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
