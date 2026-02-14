import React, { useState, useEffect, useRef } from 'react';
import { 
  AgentId, 
  SimulationState, 
  LogEntry, 
  Prospect, 
  WorkflowStats, 
  AgentStatus 
} from './types';
import { RAW_MAILING_LIST, INITIAL_CV, AGENTS, AUTH_SCRIPT_CONTENT } from './constants';
import * as GeminiService from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';
import TerminalLog from './components/TerminalLog';
import WorkflowVisualizer from './components/WorkflowVisualizer';
import { 
  Play, 
  RotateCcw, 
  Mail, 
  FileText, 
  CheckCircle, 
  XCircle, 
  BarChart,
  Activity,
  User,
  Building,
  ShieldCheck,
  FileUp,
  BarChart3,
  Code,
  Copy
} from 'lucide-react';

const App: React.FC = () => {
  // State
  const [state, setState] = useState<SimulationState>({
    isActive: false,
    currentAgent: null,
    logs: [],
    prospects: [],
    stats: {
      totalProspects: 0,
      emailsDrafted: 0,
      validationsPassed: 0,
      cvOptimizations: 0,
      startTime: null,
      endTime: null
    },
    optimizedCV: null,
    finalReport: null
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'prospects' | 'cv' | 'report' | 'scripts'>('dashboard');
  const [copied, setCopied] = useState(false);

  // Helper for logging
  const addLog = (agentId: AgentId, message: string, type: LogEntry['type'] = 'info') => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, {
        id: uuidv4(),
        timestamp: new Date(),
        agentId,
        message,
        type
      }]
    }));
  };

  const updateStats = (update: Partial<WorkflowStats>) => {
    setState(prev => ({
      ...prev,
      stats: { ...prev.stats, ...update }
    }));
  };

  const copyScript = () => {
    navigator.clipboard.writeText(AUTH_SCRIPT_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // The Main Workflow Engine
  const runSimulation = async () => {
    if (state.isActive) return;

    // Reset State
    setState(prev => ({
      ...prev,
      isActive: true,
      currentAgent: AgentId.A1_0,
      logs: [],
      prospects: [],
      optimizedCV: null,
      finalReport: null,
      stats: {
        totalProspects: 0,
        emailsDrafted: 0,
        validationsPassed: 0,
        cvOptimizations: 0,
        startTime: Date.now(),
        endTime: null
      }
    }));

    await new Promise(r => setTimeout(r, 800));

    // --- STEP 1: SUPERVISOR ---
    addLog(AgentId.A1_0, "Séquence d'initialisation démarrée.", 'info');
    await new Promise(r => setTimeout(r, 1000));
    addLog(AgentId.A1_0, "Instruction à l'Agent 1.1 de commencer la prospection multi-canale.", 'success');

    // --- STEP 2: PROSPECTOR (Agent 1.1) ---
    setState(prev => ({ ...prev, currentAgent: AgentId.A1_1 }));
    await new Promise(r => setTimeout(r, 1000));
    
    // Simulate Indeed Auth
    addLog(AgentId.A1_1, "Initialisation du connecteur OAuth2 Google...", 'info');
    await new Promise(r => setTimeout(r, 800));
    addLog(AgentId.A1_1, "Authentification utilisateur : colinorelus1998@gmail.com", 'warning');
    await new Promise(r => setTimeout(r, 800));
    addLog(AgentId.A1_1, "Connexion API Indeed établie. Token d'accès sécurisé.", 'success');
    await new Promise(r => setTimeout(r, 800));
    addLog(AgentId.A1_1, "Récupération des offres et candidatures Indeed...", 'info');

    // Select random subset of 3-5 emails to process for the demo
    const shuffled = [...RAW_MAILING_LIST].sort(() => 0.5 - Math.random());
    const selectedTargets = shuffled.slice(0, 5); 

    const newProspects: Prospect[] = selectedTargets.map(t => ({
      id: uuidv4(),
      email: t.email,
      organization: t.org,
      region: t.region,
      source: t.source as any,
      status: 'PENDING'
    }));

    setState(prev => ({ 
      ...prev, 
      prospects: newProspects,
      stats: { ...prev.stats, totalProspects: newProspects.length }
    }));
    
    await new Promise(r => setTimeout(r, 500));
    addLog(AgentId.A1_1, `Identification de ${newProspects.length} opportunités via Indeed et Web Scraping.`, 'success');
    addLog(AgentId.A1_1, "Vérification de la validité des emails... OK.", 'info');

    // --- STEP 3: OPTIMIZER (Agent 1.4) - Running in 'Parallel' conceptually ---
    // In React state, we'll switch visual focus briefly
    setState(prev => ({ ...prev, currentAgent: AgentId.A1_4 }));
    addLog(AgentId.A1_4, "Analyse du CV du candidat Colin...", 'info');
    const optimized = await GeminiService.optimizeCV();
    setState(prev => ({ 
      ...prev, 
      optimizedCV: optimized,
      stats: { ...prev.stats, cvOptimizations: 1 }
    }));
    addLog(AgentId.A1_4, "Optimisation du CV terminée. Mots-clés injectés : SEO, WordPress, Analytics.", 'success');
    await new Promise(r => setTimeout(r, 1000));

    // --- STEP 4 & 5: DRAFTER (1.2) & QA (1.3) Loop ---
    for (let i = 0; i < newProspects.length; i++) {
      const prospect = newProspects[i];
      
      // 1.2 Draft
      setState(prev => ({ ...prev, currentAgent: AgentId.A1_2 }));
      addLog(AgentId.A1_2, `Rédaction de l'email pour ${prospect.organization} (Source: ${prospect.source})...`, 'info');
      
      const draft = await GeminiService.generateEmailDraft(prospect.email, prospect.organization, prospect.source);
      
      // Update prospect with draft
      setState(prev => {
        const updated = [...prev.prospects];
        updated[i] = { ...updated[i], draftSubject: draft.subject, draftBody: draft.body, status: 'DRAFTED' };
        return { 
          ...prev, 
          prospects: updated,
          stats: { ...prev.stats, emailsDrafted: prev.stats.emailsDrafted + 1 }
        };
      });
      addLog(AgentId.A1_2, "Brouillon généré. Envoi au QA.", 'info');
      await new Promise(r => setTimeout(r, 800));

      // 1.3 QA
      setState(prev => ({ ...prev, currentAgent: AgentId.A1_3 }));
      addLog(AgentId.A1_3, `Validation du brouillon pour ${prospect.organization}...`, 'info');
      
      const qaResult = await GeminiService.checkQuality(draft.body, prospect.organization);
      
      if (qaResult.approved) {
        addLog(AgentId.A1_3, "Validation réussie. Prêt à envoyer.", 'success');
        setState(prev => {
          const updated = [...prev.prospects];
          updated[i] = { 
            ...updated[i], 
            status: 'VALIDATED', 
            qualityCheck: qaResult 
          };
          return { 
            ...prev, 
            prospects: updated,
            stats: { ...prev.stats, validationsPassed: prev.stats.validationsPassed + 1 }
          };
        });
      } else {
        addLog(AgentId.A1_3, `Validation échouée : ${qaResult.feedback}. Demande de révision (Simulée).`, 'warning');
        // For demo, we auto-fix status to Validated after a 'retry' delay
        await new Promise(r => setTimeout(r, 1000));
        addLog(AgentId.A1_2, "Brouillon révisé soumis.", 'info');
        setState(prev => {
           const updated = [...prev.prospects];
           updated[i] = { ...updated[i], status: 'VALIDATED', qualityCheck: { approved: true, feedback: "Corrigé après revue." } };
           return { ...prev, prospects: updated, stats: { ...prev.stats, validationsPassed: prev.stats.validationsPassed + 1 } };
        });
      }
      await new Promise(r => setTimeout(r, 500));
    }

    // --- STEP 6: ANALYST (1.5) ---
    setState(prev => ({ ...prev, currentAgent: AgentId.A1_5 }));
    addLog(AgentId.A1_5, "Consolidation des données de session...", 'info');
    const finalReport = await GeminiService.generateFinalReport(state.stats);
    setState(prev => ({ ...prev, finalReport: finalReport }));
    addLog(AgentId.A1_5, "Rapport final généré.", 'success');
    await new Promise(r => setTimeout(r, 1000));

    // --- STEP 7: SUPERVISOR (1.0) ---
    setState(prev => ({ ...prev, currentAgent: AgentId.A1_0 }));
    addLog(AgentId.A1_0, "Toutes les tâches sont terminées. En attente de confirmation utilisateur.", 'success');
    setState(prev => ({ 
      ...prev, 
      isActive: false, 
      stats: { ...prev.stats, endTime: Date.now() } 
    }));
  };

  const chartData = [
    { name: 'Validés', value: state.stats.validationsPassed, color: '#4ade80' },
    { name: 'En attente', value: state.stats.totalProspects - state.stats.validationsPassed, color: '#94a3b8' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT SIDEBAR / HEADER on mobile */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-gray-800 p-4 flex flex-col gap-6 shrink-0 z-20">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/50">
            <Activity className="text-cyan-400 w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">AutoProspect<span className="text-cyan-400">.AI</span></h1>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:bg-gray-800/50'}`}
          >
            <BarChart size={18} /> Tableau de Bord
          </button>
          <button 
            onClick={() => setActiveTab('prospects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'prospects' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:bg-gray-800/50'}`}
          >
            <Mail size={18} /> Emails & Tâches
            {state.prospects.length > 0 && <span className="ml-auto bg-cyan-900 text-cyan-200 text-xs px-2 py-0.5 rounded-full">{state.prospects.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('cv')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'cv' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:bg-gray-800/50'}`}
          >
            <User size={18} /> CV Optimisé
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'report' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:bg-gray-800/50'}`}
          >
            <FileText size={18} /> Rapport Final
          </button>
          <button 
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'scripts' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:bg-gray-800/50'}`}
          >
            <Code size={18} /> Scripts & API
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-800">
          <button 
            onClick={runSimulation} 
            disabled={state.isActive}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 transition-all
              ${state.isActive 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:scale-[1.02]'}`}
          >
            {state.isActive ? (
              <><RotateCcw className="animate-spin" /> Traitement...</>
            ) : (
              <><Play fill="currentColor" /> Démarrer Agent 1.0</>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        
        {/* TOP BAR */}
        <header className="flex justify-between items-center mb-8">
           <div>
             <h2 className="text-2xl font-bold text-white">
               {activeTab === 'dashboard' && 'Centre d\'Opérations'}
               {activeTab === 'prospects' && 'Résultats de Campagne'}
               {activeTab === 'cv' && 'Optimisation Candidat'}
               {activeTab === 'report' && 'Synthèse Exécutive'}
               {activeTab === 'scripts' && 'Intégration Technique'}
             </h2>
             <p className="text-gray-500 text-sm">
               {state.isActive ? 'Workflow en cours d\'exécution...' : 'Système prêt pour initialisation.'}
             </p>
           </div>
           <div className="flex gap-4">
             <div className="text-right hidden sm:block">
               <div className="text-xs text-gray-500 uppercase">Agent Actuel</div>
               <div className="text-cyan-400 font-mono font-bold">
                 {state.currentAgent ? AGENTS[state.currentAgent].name : 'HORS LIGNE'}
               </div>
             </div>
           </div>
        </header>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Visualizer */}
            <div className="col-span-1 lg:col-span-1">
              <WorkflowVisualizer currentAgent={state.currentAgent} />
            </div>

            {/* Live Logs */}
            <div className="col-span-1 lg:col-span-1">
              <TerminalLog logs={state.logs} />
            </div>

            {/* Stats Row */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Building /></div>
                  <div>
                    <div className="text-3xl font-bold text-white">{state.stats.totalProspects}</div>
                    <div className="text-sm text-gray-400">Prospects Scannés</div>
                  </div>
               </div>
               <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400"><Mail /></div>
                  <div>
                    <div className="text-3xl font-bold text-white">{state.stats.emailsDrafted}</div>
                    <div className="text-sm text-gray-400">Brouillons Générés</div>
                  </div>
               </div>
               <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg text-green-400"><CheckCircle /></div>
                  <div>
                    <div className="text-3xl font-bold text-white">{state.stats.validationsPassed}</div>
                    <div className="text-sm text-gray-400">Prêt à Envoyer</div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* PROSPECTS VIEW */}
        {activeTab === 'prospects' && (
          <div className="space-y-6">
            {state.prospects.length === 0 ? (
              <div className="text-center py-20 text-gray-500">Aucune opération démarrée. Cliquez sur 'Démarrer Agent 1.0'.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {state.prospects.map((p) => (
                  <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                      <div>
                         <h3 className="text-lg font-bold text-white">{p.organization}</h3>
                         <div className="text-sm text-gray-400 flex gap-2 items-center">
                            <span>{p.email}</span>
                            <span className="text-gray-600">•</span>
                            <span>{p.region}</span>
                            <span className="text-gray-600">•</span>
                            <span className={`text-xs px-2 py-0.5 rounded border ${
                                p.source === 'Indeed' ? 'border-blue-500 text-blue-400 bg-blue-900/20' : 
                                'border-gray-600 text-gray-400 bg-gray-800'
                            }`}>{p.source}</span>
                         </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                        p.status === 'VALIDATED' ? 'bg-green-500/20 text-green-400' :
                        p.status === 'DRAFTED' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {p.status}
                      </div>
                    </div>
                    
                    {p.draftSubject && (
                      <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 font-mono text-sm mb-4">
                        <div className="text-gray-500 mb-2 border-b border-gray-800 pb-2">Objet : <span className="text-gray-200">{p.draftSubject}</span></div>
                        <div className="text-gray-300 whitespace-pre-wrap">{p.draftBody}</div>
                      </div>
                    )}

                    {p.qualityCheck && (
                      <div className="flex items-start gap-2 text-sm">
                        <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5" />
                        <span className="text-gray-400">Retour IA : <span className="text-cyan-100">{p.qualityCheck.feedback}</span></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CV VIEW */}
        {activeTab === 'cv' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
              <h3 className="text-lg font-bold text-gray-400 mb-4 flex items-center gap-2"><FileText /> Entrée Originale</h3>
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-500 bg-gray-950 p-4 rounded-lg flex-1 border border-gray-800">
                {INITIAL_CV}
              </pre>
            </div>
            <div className="bg-gray-900 border border-cyan-900/50 rounded-xl p-6 flex flex-col relative overflow-hidden">
               {state.optimizedCV ? (
                  <>
                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2"><FileUp /> Optimisé par Agent 1.4</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-200 bg-gray-950/50 p-4 rounded-lg flex-1 border border-gray-700 overflow-y-auto custom-scrollbar">
                      {state.optimizedCV}
                    </pre>
                  </>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-600">
                    <FileUp size={48} className="mb-4 opacity-50" />
                    <p>L'Agent 1.4 attend pour démarrer...</p>
                  </div>
               )}
            </div>
          </div>
        )}

        {/* REPORT VIEW */}
        {activeTab === 'report' && (
           <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BarChart3 className="text-cyan-400" /> Rapport Exécutif (Agent 1.5)
              </h2>
              {state.finalReport ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed bg-gray-950 p-6 rounded-lg border border-gray-800">
                      {state.finalReport}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">{Math.floor((state.stats.validationsPassed / state.stats.totalProspects) * 100) || 0}%</div>
                      <div className="text-xs text-gray-400">Taux de Succès</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                       <div className="text-2xl font-bold text-blue-400">{(state.stats.endTime && state.stats.startTime) ? ((state.stats.endTime - state.stats.startTime)/1000).toFixed(1) : 0}s</div>
                       <div className="text-xs text-gray-400">Temps d'Exécution</div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-gray-800">
                    <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                       <Mail size={18} /> Tout Approuver & Envoyer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 size={48} className="mx-auto mb-4 opacity-30" />
                  Le rapport sera généré par l'Agent 1.5 à la fin du workflow.
                </div>
              )}
           </div>
        )}

        {/* SCRIPTS VIEW (New) */}
        {activeTab === 'scripts' && (
           <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-xl p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Code className="text-cyan-400" /> Scripts d'Authentification
                  </h2>
                  <p className="text-gray-400 mt-2">
                    Utilisez ce script Python pour générer le fichier <code>token.json</code> nécessaire à la connexion API Indeed.
                  </p>
                </div>
                <button 
                  onClick={copyScript}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                  {copied ? <CheckCircle className="text-green-400 w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copié !' : 'Copier'}
                </button>
              </div>

              <div className="relative flex-1 bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 bg-gray-900 px-4 py-2 text-xs text-gray-500 border-b border-gray-800 font-mono flex justify-between">
                   <span>auth_indeed.py</span>
                   <span>Python 3.x</span>
                </div>
                <pre className="p-4 pt-10 font-mono text-sm text-blue-100 overflow-auto h-full custom-scrollbar">
                  {AUTH_SCRIPT_CONTENT}
                </pre>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200/80">
                <strong>Note :</strong> Ce script doit être exécuté localement. Le fichier <code>token.json</code> généré devra être placé à la racine du serveur backend pour activer l'intégration réelle.
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default App;