import React from 'react';

interface WordCloudProps {
    data: { text: string; value: number }[];
}

const WordCloud: React.FC<WordCloudProps> = ({ data }) => {
    // Find min and max values to normalize font sizes and colors
    const values = data.map(item => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const getStyle = (value: number) => {
        // Normalize value from 0 to 1
        const normalizedValue = (value - minValue) / (maxValue - minValue);

        // Font size from 12px to 36px
        const fontSize = 12 + normalizedValue * 24;
        
        // Color from gray to a strong blue
        const blueIntensity = 100 + Math.floor(normalizedValue * 155);
        const color = `rgb(0, 0, ${blueIntensity})`;
        
        // Opacity from 0.5 to 1.0
        const opacity = 0.6 + normalizedValue * 0.4;

        return {
            fontSize: `${fontSize}px`,
            color: color,
            opacity: opacity,
            fontWeight: 500 + Math.round(normalizedValue * 4) * 100, // from 500 to 900
        };
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 p-4">
            {data.map(word => (
                <span
                    key={word.text}
                    style={getStyle(word.value)}
                    className="transition-all duration-300"
                >
                    {word.text}
                </span>
            ))}
        </div>
    );
};

export default WordCloud;