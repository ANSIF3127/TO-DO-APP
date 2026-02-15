import React, { useEffect } from 'react';

const Toast = ({ t, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(t.id);
        }, 4000);
        return () => clearTimeout(timer);
    }, [t.id, onRemove]);

    const colors = {
        success: 'border-green-500 bg-green-500/10 text-green-500',
        error: 'border-red-500 bg-red-500/10 text-red-500',
        warning: 'border-amber-500 bg-amber-500/10 text-amber-500',
        info: 'border-primary bg-primary/10 text-primary'
    };

    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'notifications'
    };

    const colorClass = colors[t.type] || colors.info;
    const iconName = icons[t.type] || icons.info;

    const handleAction = () => {
        if (t.action) {
            t.action();
        }
        onRemove(t.id);
    };

    return (
        <div className={`flex items-center gap-3 p-3 md:p-4 bg-[#2C3E50] border-l-4 rounded-lg shadow-lg animate-in slide-in-from-right duration-300 ${colorClass}`}>
            <span className="material-icons text-xl">{iconName}</span>
            <span className="text-sm font-bold text-[#E0E0E0] flex-1">{t.message}</span>
            {t.actionLabel ? (
                <button
                    onClick={handleAction}
                    className="px-2 py-1 text-xs font-bold rounded bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                >
                    {t.actionLabel}
                </button>
            ) : (
                <button
                    onClick={() => onRemove(t.id)}
                    className="ml-auto text-[#94A3B8] hover:text-[#E0E0E0]"
                >
                    <span className="material-icons text-sm">close</span>
                </button>
            )}
        </div>
    );
};

export default Toast;