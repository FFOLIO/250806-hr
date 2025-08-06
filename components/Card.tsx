
import React from 'react';
import InfoTooltip from './InfoTooltip';

interface CardProps {
    title: string;
    tooltipText: string;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, tooltipText, children, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                {title}
                <InfoTooltip text={tooltipText} />
            </h3>
            {children}
        </div>
    );
};

export default Card;
