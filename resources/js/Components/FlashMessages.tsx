import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashMessage {
    type: 'success' | 'error';
    text: string;
    id: number;
}

export default function FlashMessages() {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [messages, setMessages] = useState<FlashMessage[]>([]);

    useEffect(() => {
        const newMessages: FlashMessage[] = [];
        if (flash?.success) newMessages.push({ type: 'success', text: flash.success, id: Date.now() });
        if (flash?.error) newMessages.push({ type: 'error', text: flash.error, id: Date.now() + 1 });
        if (newMessages.length) setMessages(prev => [...prev, ...newMessages]);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (messages.length === 0) return;
        const timer = setTimeout(() => {
            setMessages(prev => prev.slice(1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [messages]);

    const dismiss = (id: number) => setMessages(prev => prev.filter(m => m.id !== id));

    if (messages.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            {messages.map(msg => (
                <div
                    key={msg.id}
                    className={cn(
                        'flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg animate-in slide-in-from-top-2',
                        msg.type === 'success' && 'border-green-200 bg-green-50 text-green-800',
                        msg.type === 'error' && 'border-red-200 bg-red-50 text-red-800',
                    )}
                >
                    {msg.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
                    <span className="flex-1">{msg.text}</span>
                    <button onClick={() => dismiss(msg.id)} className="shrink-0 opacity-60 hover:opacity-100">
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
