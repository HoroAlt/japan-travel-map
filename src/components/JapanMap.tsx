import React from 'react';
import type { Prefecture } from '../types';
import { getPrefectureStatus } from '../types';

interface JapanMapProps {
  prefectures: Prefecture[];
  onPrefectureClick: (prefecture: Prefecture) => void;
}

const getPrefectureColor = (prefecture: Prefecture): string => {
  const status = getPrefectureStatus(prefecture);
  
  switch (status) {
    case 'completed':
      return '#6bcb77';
    case 'partial':
      return '#ffd93d';
    default:
      return '#e9ecef';
  }
};

const JapanMap: React.FC<JapanMapProps> = ({ prefectures, onPrefectureClick }) => {
  // Create a more detailed SVG path for Japan map
  const getDetailedPath = (id: string): string => {
    const paths: Record<string, string> = {
      // Hokkaido
      hokkaido: 'M380,10 L420,15 L435,40 L430,70 L415,80 L395,75 L375,55 L365,30 Z',
      // Tohoku
      aomori: 'M360,75 L385,75 L385,105 L375,120 L360,115 L350,95 Z',
      iwate: 'M365,115 L375,120 L375,155 L365,170 L355,165 L355,130 Z',
      miyagi: 'M350,145 L365,150 L365,175 L355,180 L345,170 Z',
      akita: 'M325,115 L360,115 L355,150 L325,145 Z',
      yamagata: 'M325,145 L355,150 L350,175 L330,175 Z',
      fukushima: 'M330,170 L360,175 L355,200 L330,195 Z',
      // Kanto
      ibaraki: 'M355,195 L375,195 L370,225 L355,220 Z',
      tochigi: 'M330,180 L355,180 L355,205 L330,200 Z',
      gunma: 'M310,175 L330,180 L330,205 L310,200 Z',
      saitama: 'M315,195 L335,195 L335,215 L320,215 Z',
      chiba: 'M355,220 L370,225 L365,250 L355,245 Z',
      tokyo: 'M320,210 L335,210 L340,230 L325,230 Z',
      kanagawa: 'M305,215 L320,215 L318,230 L305,225 Z',
      // Chubu
      niigata: 'M280,145 L330,145 L325,180 L285,175 Z',
      toyama: 'M250,155 L285,155 L285,180 L250,175 Z',
      ishikawa: 'M220,140 L255,145 L255,175 L225,170 L215,155 Z',
      fukui: 'M225,170 L255,175 L250,195 L220,190 Z',
      yamanashi: 'M300,195 L320,195 L315,220 L295,215 Z',
      nagano: 'M270,170 L315,175 L315,210 L275,205 L265,190 Z',
      gifu: 'M245,185 L280,190 L275,220 L240,215 Z',
      shizuoka: 'M290,220 L320,220 L315,250 L285,245 Z',
      aichi: 'M260,215 L295,215 L290,245 L260,240 Z',
      // Kinki
      mie: 'M285,250 L310,250 L305,280 L280,275 Z',
      shiga: 'M260,195 L290,195 L285,220 L255,215 Z',
      kyoto: 'M225,185 L265,190 L260,220 L220,215 Z',
      osaka: 'M220,210 L255,215 L250,240 L215,235 Z',
      hyogo: 'M180,195 L225,195 L220,230 L185,235 L175,215 Z',
      nara: 'M240,235 L265,235 L260,265 L240,260 Z',
      wakayama: 'M215,235 L245,240 L245,280 L220,290 L210,265 Z',
      // Chugoku
      tottori: 'M155,190 L190,195 L185,230 L150,225 Z',
      shimane: 'M115,185 L160,190 L155,225 L110,220 Z',
      okayama: 'M180,225 L220,225 L215,260 L180,255 Z',
      hiroshima: 'M135,225 L185,230 L180,270 L135,265 Z',
      yamaguchi: 'M95,215 L140,220 L140,270 L100,270 L90,245 Z',
      // Shikoku
      kagawa: 'M195,270 L230,270 L230,295 L200,295 Z',
      tokushima: 'M225,285 L260,280 L255,315 L230,320 Z',
      ehime: 'M155,265 L200,270 L195,315 L160,310 Z',
      kochi: 'M160,310 L195,315 L190,350 L170,355 L155,330 Z',
      // Kyushu
      fukuoka: 'M75,260 L110,255 L105,290 L70,285 Z',
      saga: 'M55,265 L80,265 L75,290 L50,285 Z',
      nagasaki: 'M25,260 L60,265 L50,295 L25,290 Z',
      kumamoto: 'M70,285 L110,285 L105,335 L75,330 L70,305 Z',
      oita: 'M105,285 L145,275 L140,330 L105,335 Z',
      miyazaki: 'M115,330 L160,325 L165,380 L130,385 L120,355 Z',
      kagoshima: 'M70,330 L115,330 L110,380 L85,390 L65,370 Z',
      okinawa: 'M45,380 L90,385 L85,405 L50,400 Z'
    };
    return paths[id] || '';
  };

  const getPrefectureCenter = (id: string): { x: number; y: number } => {
    const centers: Record<string, { x: number; y: number }> = {
      hokkaido: { x: 400, y: 45 },
      aomori: { x: 370, y: 95 },
      iwate: { x: 365, y: 140 },
      miyagi: { x: 355, y: 160 },
      akita: { x: 340, y: 130 },
      yamagata: { x: 340, y: 160 },
      fukushima: { x: 345, y: 185 },
      ibaraki: { x: 365, y: 210 },
      tochigi: { x: 342, y: 192 },
      gunma: { x: 320, y: 190 },
      saitama: { x: 325, y: 205 },
      chiba: { x: 362, y: 235 },
      tokyo: { x: 330, y: 220 },
      kanagawa: { x: 312, y: 222 },
      niigata: { x: 305, y: 162 },
      toyama: { x: 267, y: 167 },
      ishikawa: { x: 235, y: 158 },
      fukui: { x: 237, y: 182 },
      yamanashi: { x: 307, y: 207 },
      nagano: { x: 290, y: 190 },
      gifu: { x: 260, y: 200 },
      shizuoka: { x: 302, y: 235 },
      aichi: { x: 275, y: 230 },
      mie: { x: 295, y: 265 },
      shiga: { x: 272, y: 207 },
      kyoto: { x: 242, y: 202 },
      osaka: { x: 235, y: 225 },
      hyogo: { x: 202, y: 215 },
      nara: { x: 252, y: 250 },
      wakayama: { x: 230, y: 260 },
      tottori: { x: 172, y: 208 },
      shimane: { x: 135, y: 203 },
      okayama: { x: 200, y: 242 },
      hiroshima: { x: 157, y: 247 },
      yamaguchi: { x: 115, y: 243 },
      kagawa: { x: 212, y: 282 },
      tokushima: { x: 242, y: 302 },
      ehime: { x: 177, y: 290 },
      kochi: { x: 175, y: 332 },
      fukuoka: { x: 92, y: 275 },
      saga: { x: 67, y: 277 },
      nagasaki: { x: 42, y: 277 },
      kumamoto: { x: 90, y: 310 },
      oita: { x: 122, y: 307 },
      miyazaki: { x: 140, y: 357 },
      kagoshima: { x: 92, y: 360 },
      okinawa: { x: 67, y: 392 }
    };
    return centers[id] || { x: 0, y: 0 };
  };

  return (
    <svg 
      viewBox="0 0 450 420" 
      className="japan-map"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {prefectures.map((prefecture) => {
        const color = getPrefectureColor(prefecture);
        const center = getPrefectureCenter(prefecture.id);
        
        return (
          <g key={prefecture.id}>
            <path
              d={getDetailedPath(prefecture.id)}
              fill={color}
              stroke="#fff"
              strokeWidth="1.5"
              className="prefecture"
              onClick={() => onPrefectureClick(prefecture)}
              filter="url(#shadow)"
            />
            <text
              x={center.x}
              y={center.y}
              className="prefecture-label"
              fontSize={prefecture.id === 'hokkaido' ? 12 : 9}
              fill="#333"
              fontWeight="500"
            >
              {prefecture.nameJp}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default JapanMap;
