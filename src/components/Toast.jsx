import React, { useEffect } from 'react';

const Toast = ({ t, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(t.id);
        }, 4000);
        return () => clearTimeout(timer);
    }, [t.id, onRemove]);

    const colors = {
        success: 'border-medium bg-medium/10 text-medium',
        error: 'border-high bg-high/10 text-high',
        info: 'border-primary bg-primary/10 text-primary'
    };

    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'notifications'
    };

    const colorClass = colors[t.type] || colors.info;
    const iconName = icons[t.type] || icons.info;

    return (
        <div className={`flex items-center gap-3 p-3 md:p-4 bg-white border-l-4 rounded-lg shadow-lg animate-in slide-in-from-right duration-300 ${colorClass}`}>
            <span className="material-icons text-xl">{iconName}</span>
            <span className="text-sm font-bold text-slate-800">{t.message}</span>
            <button
                onClick={() => onRemove(t.id)}
                className="ml-auto text-slate-400 hover:text-slate-600"
            >
                <span className="material-icons text-sm">close</span>
            </button>
        </div>
    );
};

export default Toast;
