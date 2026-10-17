import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Zap, 
  Crown, 
  Lock, 
  Clock, 
  Video, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../utils/audioFX';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  userEmail
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [stripeLinkInput, setStripeLinkInput] = useState<string>(() => {
    return localStorage.getItem('pastself_stripe_link') || '';
  });
  const [showConfig, setShowConfig] = useState(false);
  const [linkSaved, setLinkSaved] = useState(false);

  const handleSaveStripeLink = (val: string) => {
    setStripeLinkInput(val);
    localStorage.setItem('pastself_stripe_link', val.trim());
    setLinkSaved(true);
    setTimeout(() => setLinkSaved(false), 2000);
  };

  const handleSubscribe = () => {
    setIsProcessing(true);
    sfx.unlockChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsProcessing(false);
      const activeLink = stripeLinkInput.trim();
      if (activeLink.startsWith('http')) {
        // Direct navigation to live Stripe checkout
        window.location.href = activeLink;
      } else {
        setSuccessMessage(`Account (${userEmail}) successfully upgraded to PastSelf Chrono Pass Pro!`);
        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 2500);
      }
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto overflow-hidden">
        
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-neutral-900 p-6 sm:p-8 border-b border-neutral-800 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center mx-auto mb-3 shadow-xl shadow-rose-500/25">
            <Crown className="w-7 h-7 text-white" />
          </div>

          <h3 className="text-2xl font-display font-black text-white tracking-tight">
            PastSelf <span className="text-rose-400">Chrono Pass Pro</span>
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-md mx-auto">
            Unlock 10-year ultra-vault locks, 4K 60fps duet export, and remove watermarks.
          </p>

          {/* Billing Switcher */}
          <div className="mt-5 inline-flex items-center gap-1 bg-neutral-950/80 p-1 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                billingCycle === 'monthly' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              $4.99 / month
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-rose-500 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>$39.99 / year</span>
              <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full font-bold text-amber-300">
                Save 35%
              </span>
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="p-6 space-y-4">
          <div className="space-y-2.5">
            {[
              { title: '10 & 20-Year Vault Locks', desc: 'Lock messages into 2036 and 2046 with guaranteed permanent hosting' },
              { title: '4K Ultra-HD Duet Compositing', desc: 'Render split-screen videos at 60fps with studio audio fidelity' },
              { title: 'Custom Creator Watermarks', desc: 'Replace or remove the watermark with your personal brand @handle' },
              { title: 'All Retro Aesthetic Filters', desc: 'Exclusive access to 1990s VHS Glitch, Y2K Digicam, and Liquid Chrome' },
              { title: 'Unlimited Team & Friends Time Bombs', desc: 'Host group prediction capsules with up to 50 participants' }
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800/80">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{f.title}</h4>
                  <p className="text-[11px] text-neutral-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* In-modal Success notification */}
          {successMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-medium animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Checkout CTA */}
          <div className="pt-2">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-display font-bold text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {isProcessing 
                  ? 'Connecting to Checkout...' 
                  : stripeLinkInput.trim()
                    ? `Proceed to Checkout via Stripe (${billingCycle === 'yearly' ? '$39.99/yr' : '$4.99/mo'})`
                    : `Upgrade Now (${billingCycle === 'yearly' ? '$39.99/yr' : '$4.99/mo'})`}
              </span>
            </button>
            <p className="text-[10px] text-center text-neutral-500 mt-2 font-mono-code">
              Linked Account: {userEmail} • Cancel anytime • 100% money-back guarantee
            </p>
          </div>

          {/* Developer / Owner Stripe Connect Toggle */}
          <div className="pt-2 border-t border-neutral-800 text-center">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-[11px] font-mono-code text-neutral-400 hover:text-rose-400 underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>⚙️</span>
              <span>{showConfig ? 'Hide Stripe Payment Link Settings' : 'Connect Your Live Stripe Payment Link'}</span>
              {stripeLinkInput.trim() && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                  Connected
                </span>
              )}
            </button>

            {showConfig && (
              <div className="mt-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono-code uppercase font-bold text-amber-400 block">
                    Your Stripe Payment Link
                  </label>
                  {linkSaved && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono-code">
                      <Check className="w-3 h-3" /> Saved!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  To receive payments directly into your linked bank account:
                  <br />
                  1. Go to your <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline inline-flex items-center gap-0.5">Stripe Dashboard &gt; Payment Links <ExternalLink className="w-2.5 h-2.5" /></a>.
                  <br />
                  2. Create a link (e.g. $4.99/month or $39.99/year).
                  <br />
                  3. Paste the URL below. It automatically saves and routes all upgrades to your account!
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={stripeLinkInput}
                    onChange={(e) => handleSaveStripeLink(e.target.value)}
                    placeholder="https://buy.stripe.com/..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500"
                  />
                  {stripeLinkInput.trim() && (
                    <a
                      href={stripeLinkInput.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl flex items-center gap-1 shrink-0 font-medium transition-colors"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
