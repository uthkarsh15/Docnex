import React from 'react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  setEmail: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSent: boolean;
}

/**
 * Password recovery interface for forgotten credentials.
 */
const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  email,
  setEmail,
  onSubmit,
  isSent
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in transition-all duration-300" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-black/50 w-full max-w-md p-10 relative border border-transparent dark:border-slate-800 animate-in zoom-in-75 duration-300" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
          aria-label="Close recovery window"
        >
          <span className="material-symbols-outlined font-black">close</span>
        </button>

        {isSent ? (
          <div className="text-center py-8 animate-in zoom-in-50">
            <div className="size-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-pill">
              <span className="material-symbols-outlined text-3xl font-black">mark_email_read</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight italic">Link Transmitted</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 line-clamp-2">
              Check your inbox at <strong className="text-blue-500">{email}</strong> for password reset instructions.
            </p>
            <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-black">Link expires in 60 minutes</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-2xl font-bold">lock_reset</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none italic">Security Recovery</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Reset your portal password</p>
              </div>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Registered ID / Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <span className="material-symbols-outlined text-xl">alternate_email</span>
                  </div>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 transition-all shadow-inner"
                    placeholder="Enter your professional email ID"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:from-blue-600 hover:to-violet-700 transition-all text-xs uppercase tracking-widest transform active:scale-95"
              >
                Transmit Reset Link
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
