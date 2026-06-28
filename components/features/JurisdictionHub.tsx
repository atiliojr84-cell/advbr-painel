"use client";

import { useState } from "react";
import { jurisdictions } from "../../data/jurisdictions";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export default function JurisdictionHub({ 
  statuses = {}, 
  pings = {} 
}: { 
  statuses?: Record<string, string>;
  pings?: Record<string, number>;
}) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const getGroupStatus = (tribunais: any[]) => {
    let hasOffline = false;
    let hasInstavel = false;

    tribunais.forEach(trib => {
      const status = statuses[trib.name];
      if (status === 'offline') hasOffline = true;
      if (status === 'instavel') hasInstavel = true;
    });

    if (hasOffline) return 'offline';
    if (hasInstavel) return 'instavel';
    return 'online';
  };

  const getRegionTribunals = (regionName: string) => {
    if (regionName === 'Federais') return jurisdictions.federais;
    const regionData = jurisdictions.regioes[regionName as keyof typeof jurisdictions.regioes];
    const allTribs: any[] = [];
    Object.values(regionData).forEach(stateTribs => allTribs.push(...stateTribs));
    return allTribs;
  };

  const getStatusColor = (status: string) => {
    if (status === 'offline') return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
    if (status === 'instavel') return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]';
    if (status === 'online') return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]';
    return 'bg-slate-500'; 
  };

  const getRegionButtonClass = (status: string, isActive: boolean) => {
    if (status === 'offline') return `border-red-900/50 ${isActive ? 'bg-red-950/40' : 'bg-red-950/20 hover:bg-red-950/40'}`;
    if (status === 'instavel') return `border-yellow-900/50 ${isActive ? 'bg-yellow-950/40' : 'bg-yellow-950/20 hover:bg-yellow-950/40'}`;
    return `border-slate-700 ${isActive ? 'bg-slate-800' : 'bg-slate-800/50 hover:bg-slate-800'}`;
  };

  const getStateContainerClass = (status: string) => {
    if (status === 'offline') return 'border-l-2 border-red-800/50 bg-red-950/10 p-3 rounded-r-lg';
    if (status === 'instavel') return 'border-l-2 border-yellow-800/50 bg-yellow-950/10 p-3 rounded-r-lg';
    return 'border-l-2 border-slate-700/50 p-3'; 
  };

  const regions = ['Federais', ...Object.keys(jurisdictions.regioes)];

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
        <i className="fa-solid fa-map-location-dot text-blue-500"></i> Status por Região
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map(region => {
          const tribs = getRegionTribunals(region);
          const groupStatus = getGroupStatus(tribs);
          const isActive = activeRegion === region;

          return (
            <div key={region} className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveRegion(isActive ? null : region)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${getRegionButtonClass(groupStatus, isActive)}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(groupStatus)}`} />
                  <span className="font-bold text-white text-lg">{region}</span>
                </div>
                {isActive ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>

              {isActive && (
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">

                  {region === 'Federais' ? (
                    <div className="grid grid-cols-1 gap-2">
                      {jurisdictions.federais.map(trib => (
                        <a key={trib.name} href={trib.url} target="_blank" rel="noopener noreferrer" 
                           className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors group">
                          <div className="flex flex-col">
                            <span className="text-slate-200 text-sm font-medium">{trib.name}</span>
                            {/* AQUI ENTRA O PING */}
                            {pings[trib.name] !== undefined && (
                              <span className="text-xs text-slate-500 mt-0.5">{pings[trib.name]}ms</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(statuses[trib.name])}`} />
                            <ExternalLink size={14} className="text-slate-500 group-hover:text-blue-400" />
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    Object.entries(jurisdictions.regioes[region as keyof typeof jurisdictions.regioes]).map(([estado, tribunais]) => {
                      const stateStatus = getGroupStatus(tribunais);

                      return (
                        <div key={estado} className={`space-y-2 transition-colors ${getStateContainerClass(stateStatus)}`}>
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{estado}</h3>
                          <div className="grid grid-cols-1 gap-2">
                            {tribunais.map(trib => (
                              <a key={trib.name} href={trib.url} target="_blank" rel="noopener noreferrer" 
                                 className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-700 transition-colors group">
                                <div className="flex flex-col">
                                  <span className="text-slate-200 text-sm font-medium">{trib.name}</span>
                                  {/* AQUI ENTRA O PING */}
                                  {pings[trib.name] !== undefined && (
                                    <span className="text-xs text-slate-500 mt-0.5">{pings[trib.name]}ms</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(statuses[trib.name])}`} />
                                  <ExternalLink size={14} className="text-slate-500 group-hover:text-blue-400" />
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
