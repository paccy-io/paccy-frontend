import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-[#FEEBD8] mb-1">{value}</div>
          <div className="text-[#FEEBD8]/70 text-sm">{title}</div>
        </div>
        {icon && <div className="text-[#FEEBD8]/50">{icon}</div>}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className = "" }: ProgressBarProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <div className={`w-full bg-neutral-700 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full ${getProgressColor(
          progress
        )} transition-all duration-300`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

interface TabProps {
  tabs: Array<{ id: string; label: string; icon?: ReactNode }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabProps) {
  return (
    <div className="flex space-x-1 mb-8 bg-[#141414] border border-neutral-700/50 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === tab.id
              ? "bg-[#FEEBD8] text-[#141414]"
              : "text-[#FEEBD8] hover:bg-neutral-700/30"
          }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
