import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useReportAnalysis } from '../hooks/use-report-analysis';

/**
 * AI Report Analysis Page — Enhanced with Key Findings + AIIMS India Doctors.
 * Section A: Patient Summary Card
 * Section B: Key Findings Panel
 * Section C: Recommended Doctors at AIIMS
 */
const ReportAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const {
    file,
    isLoading,
    analysis,
    suggestedDocs,
    isDefaultDocs,
    error,
    dragActive,
    fileInputRef,
    handleFileSelect,
    handleAnalyze,
    handleReset,
    setDragActive,
  } = useReportAnalysis();

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(event.type === 'dragenter' || event.type === 'dragover');
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const severityColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'severe': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  const urgencyColor = (u: string) => {
    switch (u?.toLowerCase()) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 font-display">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Sidebar role="PATIENT" />

        <div className="lg:col-span-9 space-y-10">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-primary dark:text-white">AI Report Analysis</h1>
            <p className="text-slate-500 dark:text-slate-400">Upload your PDF medical report for AI-powered diagnosis insights and specialist matching across AIIMS India.</p>
          </div>

          {/* Upload Area */}
          {!analysis && !isLoading && (
            <div
              className={`relative rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer ${
                dragActive
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="size-20 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-red-500">picture_as_pdf</span>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-bold text-lg">{file.name}</p>
                    <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">Change File</button>
                    <button onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">Analyze with AI</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5">
                  <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-bold text-lg">Drop your medical report here</p>
                    <p className="text-slate-500 text-sm">or <span className="text-primary font-bold">browse files</span></p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center flex flex-col items-center gap-4">
              <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Analyzing Report...</h3>
                <p className="text-slate-500">Processing medical text via Groq AI Cloud</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600">
                <span className="material-symbols-outlined">error</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={handleAnalyze} className="text-xs font-bold text-red-600 hover:underline">Retry</button>
                <button onClick={handleReset} className="text-xs font-bold text-slate-500 hover:underline">Reset</button>
              </div>
            </div>
          )}

          {/* ═══════════════ ANALYSIS RESULTS ═══════════════ */}
          {analysis && (
            <div className="space-y-8 animate-in pb-12">

              {/* ── SECTION A: Patient Summary Card ── */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-primary dark:text-white uppercase tracking-wider">Patient Summary</h2>
                  <button onClick={handleReset} className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">NEW ANALYSIS</button>
                </div>
                <div className="p-8 space-y-6">
                  {/* Patient Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div><span className="text-slate-400 font-bold uppercase text-[10px]">Patient</span><p className="font-bold dark:text-white mt-0.5">{analysis.patientName}</p></div>
                    <div><span className="text-slate-400 font-bold uppercase text-[10px]">Age</span><p className="font-bold dark:text-white mt-0.5">{analysis.age}</p></div>
                    <div><span className="text-slate-400 font-bold uppercase text-[10px]">Gender</span><p className="font-bold dark:text-white mt-0.5">{analysis.gender}</p></div>
                    <div><span className="text-slate-400 font-bold uppercase text-[10px]">Blood Group</span><p className="font-bold dark:text-white mt-0.5">{analysis.bloodGroup}</p></div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${severityColor(analysis.severity)}`}>
                      {analysis.severity === 'severe' ? '🔴' : analysis.severity === 'moderate' ? '🟡' : '🟢'} Severity: {analysis.severity}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${urgencyColor(analysis.urgency)}`}>
                      {analysis.urgency === 'emergency' ? '🔴' : analysis.urgency === 'urgent' ? '🟠' : '🔵'} Urgency: {analysis.urgency}
                    </span>
                    {analysis.followUpRequired && (
                      <span className="px-4 py-1.5 bg-purple-500/10 text-purple-600 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">event_repeat</span> Follow-up Required
                      </span>
                    )}
                  </div>

                  {/* Specialist Recommendation */}
                  {analysis.recommendedSpecialistType && (
                    <div className="flex items-center gap-3 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10">
                      <span className="material-symbols-outlined text-primary">stethoscope</span>
                      <div className="text-sm">
                        <span className="text-slate-400 font-bold uppercase text-[10px]">Recommended Specialist</span>
                        <p className="font-bold text-primary">{analysis.recommendedSpecialistType}{analysis.recommendedDepartment ? ` — ${analysis.recommendedDepartment}` : ''}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── SECTION B: Key Findings Panel ── */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-primary dark:text-white uppercase tracking-wider">Key Findings from Your Report</h2>
                </div>
                <div className="p-8 space-y-6">

                  {/* Key Findings */}
                  {analysis.keyFindings.length > 0 && (
                    <div className="space-y-3">
                      {analysis.keyFindings.map((finding, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                          <span className="text-amber-500 mt-0.5 shrink-0">⚠️</span>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{finding}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Abnormal Findings */}
                  {analysis.abnormalFindings.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Abnormal Findings</h3>
                      <div className="space-y-2">
                        {analysis.abnormalFindings.map((finding, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-red-500 mt-0.5 shrink-0">🔴</span>
                            <span className="text-slate-700 dark:text-slate-300">{finding}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Critical Values */}
                  {analysis.criticalValues.length > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="animate-pulse text-red-500">🚨</span>
                        <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest">Critical Values Detected</h3>
                      </div>
                      {analysis.criticalValues.map((val, i) => (
                        <p key={i} className="text-sm text-red-700 dark:text-red-400 font-medium ml-7">{val}</p>
                      ))}
                    </div>
                  )}

                  {/* Diagnosed Conditions */}
                  {analysis.diagnosedConditions.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Diagnosed Conditions</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.diagnosedConditions.map((c, i) => (
                          <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full text-xs font-bold">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Symptoms */}
                  {analysis.symptoms.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Symptoms</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.symptoms.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medications */}
                  {analysis.medications.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Medications</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.medications.map((m, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">medication</span>{m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Summary */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-xs font-bold text-primary dark:text-blue-400 uppercase tracking-widest mb-2">AI Diagnostic Summary</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.summary}</p>
                  </div>
                </div>
              </div>

              {/* ── SECTION C: Recommended Doctors at AIIMS ── */}
              {suggestedDocs.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-primary dark:text-white uppercase tracking-wider">
                      Recommended Specialists at AIIMS — Based on Your Report
                    </h2>
                    {isDefaultDocs && (
                      <p className="text-sm text-amber-500 mt-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">info</span>
                        No exact specialist found. Showing nearest available AIIMS doctors.
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {suggestedDocs.map((doc) => (
                      <div key={doc.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all flex flex-col">
                        <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">{doc.designation}</p>
                        <p className="text-xs text-slate-500 mt-1">{doc.department}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{doc.hospital}</p>

                        <div className="mt-3 space-y-2 text-xs text-slate-500">
                          <div className="flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-sm text-red-400 mt-0.5 shrink-0">📍</span>
                            <span>{doc.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-emerald-500">schedule</span>
                            <span>{doc.availability}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-blue-500">location_on</span>
                            <span>{doc.opd}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-purple-500">call</span>
                            <span>{doc.contact}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate('/patient/book')}
                          className="w-full bg-primary text-white py-2.5 rounded-lg text-xs font-bold mt-auto pt-4 hover:bg-primary/90 transition-colors"
                        >
                          Book Appointment
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ReportAnalysis;
