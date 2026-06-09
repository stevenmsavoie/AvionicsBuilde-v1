import React, { useState, useMemo } from 'react';
import { COMPONENTS_DB } from './data/components';
import { 
  Cpu, Zap, Radio, ShieldAlert, CheckCircle, 
  ShoppingCart, ExternalLink, RefreshCw, Trash2, Sliders 
} from 'lucide-react';

export default function App() {
  const [vehicleType, setVehicleType] = useState('Quadcopter'); 
  const [selectedParts, setSelectedParts] = useState({}); 
  const [servoCount, setServoCount] = useState(0);

  const categories = ["Flight Controller", "ESC", "Motor", "Battery", "Sensor", "Camera", "VTX"];

  const selectPart = (category, part) => {
    setSelectedParts(prev => ({
      ...prev,
      [category]: { ...part, quantity: 1 }
    }));
  };

  const adjustQuantity = (category, increment) => {
    setSelectedParts(prev => {
      const item = prev[category];
      if (!item) return prev;
      const newQty = Math.max(1, item.quantity + increment);
      return {
        ...prev,
        [category]: { ...item, quantity: newQty }
      };
    });
  };

  const removePart = (category) => {
    setSelectedParts(prev => {
      const copy = { ...prev };
      delete copy[category];
      return copy;
    });
  };

  const resetBuild = () => {
    setSelectedParts({});
    setServoCount(0);
  };

  const telemetryMetrics = useMemo(() => {
    let totalPrice = 0;
    let totalWeight = 0;
    let maxCurrentDraw = 0.5; 
    let totalUartsUsed = 0;

    Object.keys(selectedParts).forEach(cat => {
      const p = selectedParts[cat];
      totalPrice += p.price * p.quantity;
      if (p.specs.weight) totalWeight += p.specs.weight * p.quantity;
      if (p.specs.uart_required) totalUartsUsed += p.quantity;
    });

    const motorCount = selectedParts["Motor"] ? selectedParts["Motor"].quantity : 0;
    if (selectedParts["Motor"]) {
      maxCurrentDraw += selectedParts["Motor"].specs.max_current * motorCount;
    }

    const totalServos = vehicleType === 'Fixed-Wing' ? servoCount : 0;
    const servoAmpLoad = totalServos * 0.8; 
    maxCurrentDraw += servoAmpLoad;
    totalWeight += totalServos * 9.0; 

    const alerts = [];
    const fc = selectedParts["Flight Controller"];
    const esc = selectedParts["ESC"];
    const battery = selectedParts["Battery"];
    const motor = selectedParts["Motor"];
    const camera = selectedParts["Camera"];
    const vtx = selectedParts["VTX"];

    if (fc && totalUartsUsed > fc.specs.uarts) {
      alerts.push({
        type: "CRITICAL",
        msg: `UART Channel Deficit: Setup requires ${totalUartsUsed} UART lines, but your FC hardware only has ${fc.specs.uarts}.`
      });
    }

    if (esc && motor) {
      if (vehicleType !== 'Fixed-Wing' && motor.specs.max_current > esc.specs.max_amps) {
        alerts.push({
          type: "CRITICAL",
          msg: `ESC Lane Overload: Motor peak current draw (${motor.specs.max_current}A) exceeds ESC per-channel continuous rating (${esc.specs.max_amps}A).`
        });
      }
    }

    if (battery && motor) {
      if (battery.specs.cells < motor.specs.cell_min || battery.specs.cells > motor.specs.cell_max) {
        alerts.push({
          type: "WARN",
          msg: `Voltage Boundary Alert: Selected ${battery.specs.cells}S battery is outside the optimal limits (${motor.specs.cell_min}S - ${motor.specs.cell_max}S) designed for your motors.`
        });
      }
    }

    if (battery) {
      const maxSafeBatteryAmps = (battery.specs.capacity / 1000) * battery.specs.c_rating;
      if (maxCurrentDraw > maxSafeBatteryAmps) {
        alerts.push({
          type: "CRITICAL",
          msg: `Battery Thermal Risk: Simulated max system current draw (${maxCurrentDraw.toFixed(1)}A) exceeds safe continuous discharge threshold (${maxSafeBatteryAmps}A). Risk of voltage sag or thermal issues.`
        });
      }
    }

    if (vehicleType === 'Fixed-Wing' && totalServos > 0) {
      const integratedBecCapacity = esc ? esc.specs.bec_amps : 0;
      if (servoAmpLoad > integratedBecCapacity) {
        alerts.push({
          type: "CRITICAL",
          msg: `BEC Current Deficit: Servos draw up to ${servoAmpLoad.toFixed(1)}A. Your ESC integrated BEC provides only ${integratedBecCapacity}A. Risk of receiver power loss.`
        });
      }
    }

    if (camera && vtx && camera.specs.video_system !== vtx.specs.video_system) {
      alerts.push({
        type: "CRITICAL",
        msg: `Video Protocol Clash: Trying to patch an ${camera.specs.video_system.toUpperCase()} camera module into a digital ${vtx.specs.video_system.toUpperCase()} VTX transmitter.`
      });
    }

    return { totalPrice, totalWeight, maxCurrentDraw, totalUartsUsed, alerts };
  }, [selectedParts, vehicleType, servoCount]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <header className="border-b border-slate-800 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl tracking-wider">
            <Cpu className="animate-pulse w-6 h-6" />
            <span>SYS.AVIONICS // CONFIGURATOR</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-tight">Advanced UAV Architecture & Design Portal</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-slate-900 border border-slate-800 rounded p-1 flex gap-1 text-xs w-full md:w-auto">
            {['Quadcopter', 'Hexacopter', 'Fixed-Wing'].map((type) => (
              <button
                key={type}
                onClick={() => { setVehicleType(type); resetBuild(); }}
                className={`px-3 py-1.5 rounded transition uppercase font-semibold ${vehicleType === type ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {type}
              </button>
            ))}
          </div>
          <button onClick={resetBuild} className="bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:text-red-400 px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition">
            <RefreshCw className="w-3.5 h-3.5" /> RESET
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" /> Avionics Component Hardware Matrix
          </h2>

          {categories.map((category) => {
            const availableItems = COMPONENTS_DB.filter(item => item.category === category);
            const activeSelection = selectedParts[category];

            return (
              <div key={category} className="bg-slate-900/60 border border-slate-900 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">{category} Configuration Slot</h3>
                  {activeSelection && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase">
                      Assigned // {activeSelection.brand}
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="pb-2 font-medium">COMPONENT SPECIFICATION</th>
                        <th className="pb-2 font-medium">METRICS</th>
                        <th className="pb-2 font-medium text-right">COST (USD)</th>
                        <th className="pb-2 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {availableItems.map((part) => {
                        const isSelected = activeSelection?.id === part.id;
                        return (
                          <tr key={part.id} className={`transition-colors ${isSelected ? 'bg-emerald-500/5 text-slate-100' : 'hover:bg-slate-800/30 text-slate-300'}`}>
                            <td className="py-2.5 pr-2">
                              <div className="font-semibold text-slate-200">{part.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">OEM: {part.brand}</div>
                            </td>
                            <td className="py-2.5 text-[11px] font-mono text-slate-400">
                              {Object.entries(part.specs).map(([k, v]) => (
                                <div key={k} className="capitalize">{k.replace('_', ' ')}: <span className="text-slate-200 font-medium">{Array.isArray(v) ? v.join(', ') : v}</span></div>
                              ))}
                            </td>
                            <td className="py-2.5 font-mono text-right text-emerald-400 font-semibold">${part.price.toFixed(2)}</td>
                            <td className="py-2.5 text-right pl-2">
                              <button
                                onClick={() => selectPart(category, part)}
                                disabled={isSelected}
                                className={`px-2.5 py-1 rounded font-mono text-[11px] uppercase tracking-tighter transition-all ${
                                  isSelected 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                                    : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 border border-slate-700 hover:border-emerald-500 text-slate-300'
                                }`}
                              >
                                {isSelected ? 'Linked' : 'Deploy'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {vehicleType === 'Fixed-Wing' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">Actuation Control Line Config (Servos)</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Standard flight surface control loads (~0.8A dynamic load allocation per node).</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded">
                  <button onClick={() => setServoCount(Math.max(0, servoCount - 1))} className="text-slate-400 hover:text-red-400 font-bold font-mono text-sm">-</button>
                  <span className="font-mono text-xs w-6 text-center font-bold text-slate-200">{servoCount}</span>
                  <button onClick={() => setServoCount(Math.min(8, servoCount + 1))} className="text-slate-400 hover:text-emerald-400 font-bold font-mono text-sm">+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 self-start">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" /> Real-Time Architecture Diagnostics
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-5 font-mono">
              <div className="bg-slate-950 border border-slate-800/80 p-3 rounded">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Total Power Draw</span>
                <span className="text-lg font-bold text-emerald-400">{telemetryMetrics.maxCurrentDraw.toFixed(1)} <span className="text-xs text-slate-400">Amps</span></span>
              </div>
              <div class="bg-slate-950 border border-slate-800/80 p-3 rounded">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Dry Airframe Mass</span>
                <span className="text-lg font-bold text-emerald-400">{telemetryMetrics.totalWeight.toFixed(1)} <span className="text-xs text-slate-400">Grams</span></span>
              </div>
              <div class="bg-slate-950 border border-slate-800/80 p-3 rounded">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">UART Links Active</span>
                <span className="text-lg font-bold text-emerald-400">{telemetryMetrics.totalUartsUsed} <span class="text-xs text-slate-400">Channels</span></span>
              </div>
              <div class="bg-slate-950 border border-slate-800/80 p-3 rounded">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Project Valuation</span>
                <span className="text-lg font-bold text-emerald-400">${telemetryMetrics.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-2">Architectural Integrity Analysis:</span>
              {telemetryMetrics.alerts.length === 0 ? (
                <div className="flex items-center gap-2 text-xs bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 p-2.5 rounded">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Avionics architecture is structurally nominal. Ready for deployment.</span>
                </div>
              ) : (
                telemetryMetrics.alerts.map((alert, idx) => (
                  <div key={idx} className={`flex items-start gap-2.5 text-xs p-2.5 rounded border ${
                    alert.type === 'CRITICAL' 
                      ? 'bg-red-500/5 text-red-400 border-red-500/20' 
                      : 'bg-amber-500/5 text-amber-400 border-amber-500/20'
                  }`}>
                    <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="leading-relaxed"><strong className="font-bold">[{alert.type}]</strong> {alert.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-emerald-400" /> Active Hardware Manifest
            </h2>

            {Object.keys(selectedParts).length === 0 ? (
              <p className="text-xs font-mono text-slate-500 italic py-4 text-center">No hardware modules loaded into structural slots.</p>
            ) : (
              <div className="space-y-3 font-mono">
                {Object.entries(selectedParts).map(([cat, item]) => (
                  <div key={cat} className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded border border-slate-800/80">
                    <div className="max-w-[65%]">
                      <div className="text-[10px] text-emerald-400 uppercase tracking-tighter font-semibold mb-0.5">{cat}</div>
                      <div className="text-slate-200 truncate font-medium">{item.name}</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 border border-slate-800 rounded">
                        <button onClick={() => adjustQuantity(cat, -1)} className="text-slate-400 hover:text-slate-100 font-bold">-</button>
                        <span className="text-slate-200 text-[11px] min-w-[12px] text-center font-bold">{item.quantity}</span>
                        <button onClick={() => adjustQuantity(cat, 1)} className="text-slate-400 hover:text-slate-100 font-bold">+</button>
                      </div>
                      
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 p-1 transition">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      
                      <button onClick={() => removePart(cat)} className="text-slate-500 hover:text-red-400 p-1 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => {
                    Object.values(selectedParts).forEach(p => window.open(p.url, '_blank'));
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded uppercase tracking-wider text-xs transition flex items-center justify-center gap-2 mt-4"
                >
                  <ExternalLink className="w-4 h-4" /> Open Selected Nodes on Newegg
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
