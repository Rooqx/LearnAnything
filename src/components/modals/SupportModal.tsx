'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { Modal, Button, Card } from '@/components/ui';
import { useUIStore } from '@/store/useUIStore';
import { LumiAnimated } from '@/components/ux';

export function SupportModal() {
  const { isSupportModalOpen, closeSupportModal } = useUIStore();
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@learnanything.xyz';
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '+1234567890';
  const telegram = process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM || 'learnanything_support';

  const handleSend = (method: 'email' | 'whatsapp' | 'telegram') => {
    if (!message.trim()) return;

    let url = '';
    const encodedMessage = encodeURIComponent(message);

    switch (method) {
      case 'whatsapp':
        url = `https://wa.me/${whatsapp}?text=${encodedMessage}`;
        break;
      case 'telegram':
        url = `https://t.me/${telegram}?text=${encodedMessage}`;
        break;
      case 'email':
      default:
        url = `mailto:${email}?subject=App Feedback/Support&body=${encodedMessage}`;
        break;
    }

    window.open(url, '_blank');
    setIsSubmitted(true);
  };

  const handleClose = () => {
    closeSupportModal();
    // Reset after animation completes
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
    }, 300);
  };

  return (
    <Modal isOpen={isSupportModalOpen} onClose={handleClose} title={isSubmitted ? "" : "Support & Feedback"} size="md">
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <LumiAnimated size={80} state="celebrating" />
          <div>
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)]">
              Thank you!
            </h3>
            <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] mt-1">
              Your feedback helps us improve the app.
            </p>
          </div>
          <Button onClick={handleClose} className="mt-4">
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)]">
            Have a suggestion, found a bug, or just want to say hi? We'd love to hear from you.
          </p>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-32 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors resize-none"
          />

          <div className="space-y-3 pt-2">
            <Button
              className="w-full"
              disabled={!message.trim()}
              onClick={() => handleSend('email')}
              leftIcon={<Mail size={18} />}
            >
              Send via Email (Default)
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                disabled={!message.trim()}
                onClick={() => handleSend('whatsapp')}
                leftIcon={<MessageCircle size={18} />}
              >
                WhatsApp
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                disabled={!message.trim()}
                onClick={() => handleSend('telegram')}
                leftIcon={<Send size={18} />}
              >
                Telegram
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
