
import React from 'react';

interface InfoTooltipProps {
    text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
    return (
        <div className="group relative inline-block ml-2 cursor-help">
            <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full font-bold text-sm">
                ⓘ
            </div>
            <div
                className="absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 w-80 invisible group-hover:visible bg-gray-800 text-white text-sm rounded-md shadow-lg p-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
                <div dangerouslySetInnerHTML={{ __html: text }} />
                <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                </svg>
            </div>
        </div>
    );
};

export default InfoTooltip;
