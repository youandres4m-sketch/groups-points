import React, { useState, useEffect } from 'react';
import { Users, X, Check, Wand2 } from 'lucide-react';
import { Team } from '../types';

interface EditTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  teamCount: number;
  onSave: (newCount: number, updatedNames: Record<number, string>) => void;
}

const PRESET_ANIMALS = [
  'Eagles',
  'Lions',
  'Sharks',
  'Wolves',
  'Falcons',
  'Panthers',
  'Tigers',
  'Bears',
  'Dragons',
];

const PRESET_VOCAB = [
  'Grammar Gurus',
  'Word Wizards',
  'Spelling Stars',
  'Vocab Voyagers',
  'Phonics Pros',
  'Sentence Seekers',
  'Rhetoric Rebels',
  'Syntax Squad',
  'Idiom Aces',
];

export const EditTeamsModal: React.FC<EditTeamsModalProps> = ({
  isOpen,
  onClose,
  teams,
  teamCount,
  onSave,
}) => {
  const [selectedCount, setSelectedCount] = useState<number>(teamCount);
  const [names, setNames] = useState<Record<number, string>>({});

  useEffect(() => {
    if (isOpen) {
      setSelectedCount(teamCount);
      const initialNames: Record<number, string> = {};
      teams.forEach((t) => {
        initialNames[t.id] = t.name;
      });
      // Fill any missing up to 9
      for (let i = 1; i <= 9; i++) {
        if (!initialNames[i]) {
          initialNames[i] = `Team ${i}`;
        }
      }
      setNames(initialNames);
    }
  }, [isOpen, teams, teamCount]);

  if (!isOpen) return null;

  const handleNameChange = (id: number, value: string) => {
    setNames((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const applyPreset = (presetList: string[]) => {
    const updated = { ...names };
    for (let i = 1; i <= 9; i++) {
      if (presetList[i - 1]) {
        updated[i] = presetList[i - 1];
      }
    }
    setNames(updated);
  };

  const handleResetToDefault = () => {
    const updated = { ...names };
    for (let i = 1; i <= 9; i++) {
      updated[i] = `Team ${i}`;
    }
    setNames(updated);
  };

  const handleSave = () => {
    onSave(selectedCount, names);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-teams-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3
                id="edit-teams-title"
                className="font-display font-black text-xl text-white"
              >
                Team Management & Roster
              </h3>
              <p className="text-xs text-slate-400">
                Choose team count and customize team names
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Number of teams */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Number of Active Teams (1 to 9)
          </label>
          <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((count) => {
              const isSelected = selectedCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setSelectedCount(count)}
                  className={`py-2 rounded-lg font-mono-numbers font-black text-sm sm:text-base transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset(PRESET_VOCAB)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
          >
            English Vocab Champions
          </button>
          <button
            type="button"
            onClick={() => applyPreset(PRESET_ANIMALS)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
          >
            Animal Mascots
          </button>
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Reset to "Team 1..9"
          </button>
        </div>

        {/* Section 2: Team Name Inputs */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Customize Team Names ({selectedCount} active)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {Array.from({ length: selectedCount }, (_, i) => i + 1).map((id) => (
              <div
                key={id}
                className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800"
              >
                <span className="w-7 h-7 shrink-0 rounded-lg bg-slate-800 text-amber-400 font-mono-numbers font-black text-xs flex items-center justify-center border border-slate-700">
                  {id}
                </span>
                <input
                  type="text"
                  maxLength={24}
                  value={names[id] || ''}
                  onChange={(e) => handleNameChange(id, e.target.value)}
                  placeholder={`Team ${id}`}
                  className="w-full bg-transparent text-sm font-bold text-white placeholder-slate-500 focus:outline-hidden"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-extrabold shadow-md transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Apply & Save Teams</span>
          </button>
        </div>
      </div>
    </div>
  );
};
