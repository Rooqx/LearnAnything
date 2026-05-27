'use client';

import { Modal, Button, Card } from '@/components/ui';
import { useUIStore } from '@/store/useUIStore';
import { LumiAnimated } from '@/components/ux';
import { MessageCircle, Send } from 'lucide-react';

export function CommunityModal() {
  const { isCommunityModalOpen, closeCommunityModal } = useUIStore();

  const socialX = process.env.NEXT_PUBLIC_SOCIAL_X || 'https://x.com/learnanything';
  const socialWhatsapp = process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || 'https://chat.whatsapp.com/invitecode';
  const socialTelegram = process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM || 'https://t.me/learnanything';

  return (
    <Modal isOpen={isCommunityModalOpen} onClose={closeCommunityModal} title="Join Our Community" size="sm">
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <LumiAnimated size={80} state="excited" />
        
        <div>
          <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] text-sm mb-4">
            Get the latest updates, connect with other learners, and share your progress!
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button
            className="w-full justify-start pl-6"
            onClick={() => window.open(socialWhatsapp, '_blank')}
            leftIcon={<MessageCircle size={18} />}
          >
            Join on WhatsApp
          </Button>
          
          <Button
            variant="secondary"
            className="w-full justify-start pl-6"
            onClick={() => window.open(socialTelegram, '_blank')}
            leftIcon={<Send size={18} />}
          >
            Join on Telegram
          </Button>
          
          <Button
            variant="secondary"
            className="w-full justify-start pl-6"
            onClick={() => window.open(socialX, '_blank')}
            leftIcon={
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            }
          >
            Follow on X
          </Button>
        </div>
      </div>
    </Modal>
  );
}
