import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Prefecture } from '../types';
import { getPrefectureStatus } from '../types';

interface RealisticJapanMapProps {
  prefectures: Prefecture[];
  onPrefectureClick: (prefecture: Prefecture) => void;
  zoomScale?: number;
}

const statusColors = {
  unvisited: '#e9ecef',
  partial: '#ffd93d',
  completed: '#6bcb77'
};

// Map GeoJSON prefecture names to our IDs
const prefectureNameToId: Record<string, string> = {
  'Hokkai Do': 'hokkaido',
  'Aomori Ken': 'aomori',
  'Iwate Ken': 'iwate',
  'Miyagi Ken': 'miyagi',
  'Akita Ken': 'akita',
  'Yamagata Ken': 'yamagata',
  'Fukushima Ken': 'fukushima',
  'Ibaraki Ken': 'ibaraki',
  'Tochigi Ken': 'tochigi',
  'Gunma Ken': 'gunma',
  'Saitama Ken': 'saitama',
  'Chiba Ken': 'chiba',
  'Tokyo To': 'tokyo',
  'Kanagawa Ken': 'kanagawa',
  'Niigata Ken': 'niigata',
  'Toyama Ken': 'toyama',
  'Ishikawa Ken': 'ishikawa',
  'Fukui Ken': 'fukui',
  'Yamanashi Ken': 'yamanashi',
  'Nagano Ken': 'nagano',
  'Gifu Ken': 'gifu',
  'Shizuoka Ken': 'shizuoka',
  'Aichi Ken': 'aichi',
  'Mie Ken': 'mie',
  'Shiga Ken': 'shiga',
  'Kyoto Fu': 'kyoto',
  'Osaka Fu': 'osaka',
  'Hyogo Ken': 'hyogo',
  'Nara Ken': 'nara',
  'Wakayama Ken': 'wakayama',
  'Tottori Ken': 'tottori',
  'Shimane Ken': 'shimane',
  'Okayama Ken': 'okayama',
  'Hiroshima Ken': 'hiroshima',
  'Yamaguchi Ken': 'yamaguchi',
  'Tokushima Ken': 'tokushima',
  'Kagawa Ken': 'kagawa',
  'Ehime Ken': 'ehime',
  'Kochi Ken': 'kochi',
  'Fukuoka Ken': 'fukuoka',
  'Saga Ken': 'saga',
  'Nagasaki Ken': 'nagasaki',
  'Kumamoto Ken': 'kumamoto',
  'Oita Ken': 'oita',
  'Miyazaki Ken': 'miyazaki',
  'Kagoshima Ken': 'kagoshima',
  'Okinawa Ken': 'okinawa'
};

// Major cities with their coordinates
const cities = [
  { name: 'Sapporo', lat: 43.0618, lng: 141.3545 },
  { name: 'Sendai', lat: 38.2682, lng: 140.8694 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Yokohama', lat: 35.4437, lng: 139.6380 },
  { name: 'Nagoya', lat: 35.1815, lng: 136.9066 },
  { name: 'Kyoto', lat: 35.0116, lng: 135.7681 },
  { name: 'Osaka', lat: 34.6937, lng: 135.5023 },
  { name: 'Kobe', lat: 34.6901, lng: 135.1955 },
  { name: 'Hiroshima', lat: 34.3853, lng: 132.4553 },
  { name: 'Fukuoka', lat: 33.5902, lng: 130.4017 },
  { name: 'Kagoshima', lat: 31.5966, lng: 130.5571 },
  { name: 'Naha', lat: 26.2123, lng: 127.6792 }
];

const RealisticJapanMap: React.FC<RealisticJapanMapProps> = ({ 
  prefectures, 
  onPrefectureClick,
  zoomScale = 1 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<any>(null);

  // Load GeoJSON data
  useEffect(() => {
    fetch('/japan.geojson')
      .then(res => res.json())
      .then(data => {
        setGeoData(data);
      })
      .catch(err => {
        console.error('Error loading GeoJSON:', err);
      });
  }, []);

  // Render map
  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1000;
    const height = 800;
    
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Create projection
    const projection = d3.geoMercator()
      .fitSize([width, height], geoData);

    const pathGenerator = d3.geoPath().projection(projection);

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'map-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('fontSize', '14px')
      .style('pointerEvents', 'none')
      .style('zIndex', '1000');

    // Draw prefectures
    const paths = svg.selectAll('path.prefecture')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('class', 'prefecture')
      .attr('d', pathGenerator as any)
      .attr('fill', (d: any) => {
        const name = d.properties.nam;
        const prefId = prefectureNameToId[name];
        const prefecture = prefectures.find(p => p.id === prefId);
        if (prefecture) {
          return statusColors[getPrefectureStatus(prefecture)];
        }
        return '#e9ecef';
      })
      .style('cursor', 'pointer');

    // Add event listeners
    paths.on('mouseenter', function(_event: MouseEvent, d: any) {
      const pathElement = d3.select(this);
      const name = d.properties.nam;
      const namJa = d.properties.nam_ja;
      const prefId = prefectureNameToId[name];
      const prefecture = prefectures.find(p => p.id === prefId);
      
      pathElement
        .attr('stroke', '#c41e3a')
        .attr('stroke-width', 3)
        .style('filter', 'drop-shadow(0 0 8px rgba(196, 30, 58, 0.6)) brightness(1.05)');
      
      if (prefecture) {
        const status = getPrefectureStatus(prefecture);
        const statusText = status === 'completed' ? '✓ Посещено' : 
                          status === 'partial' ? '◐ Частично' : '○ Не посещено';
        
        tooltip
          .style('visibility', 'visible')
          .html(`
            <strong>${prefecture.name}</strong><br/>
            <span style="font-size: 12px; opacity: 0.9">${prefecture.nameJp}</span><br/>
            <span style="font-size: 11px; margin-top: 4px; display: block">${statusText}</span>
          `);
      } else {
        tooltip
          .style('visibility', 'visible')
          .html(`
            <strong>${name}</strong><br/>
            <span style="font-size: 12px; opacity: 0.9">${namJa}</span>
          `);
      }
    })
    .on('mousemove', function(event: MouseEvent) {
      tooltip
        .style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseleave', function() {
      const pathElement = d3.select(this);
      pathElement
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .style('filter', 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))');
      tooltip.style('visibility', 'hidden');
    })
    .on('click', function(_event: MouseEvent, d: any) {
      const name = d.properties.nam;
      const prefId = prefectureNameToId[name];
      const prefecture = prefectures.find(p => p.id === prefId);
      if (prefecture) {
        onPrefectureClick(prefecture);
      }
    });

    // Add cities - all cities visible, scale with zoom
    const cityGroup = svg.append('g').attr('class', 'cities');
    
    // Scale city markers inversely to zoom to keep them readable
    const scaleFactor = Math.max(0.3, 0.8 / Math.sqrt(zoomScale));
    const cityRadius = 3 * scaleFactor;
    const fontSize = 9 * scaleFactor;
    
    cities.forEach(city => {
      const coords = projection([city.lng, city.lat]);
      if (coords) {
        // City dot
        cityGroup.append('circle')
          .attr('cx', coords[0])
          .attr('cy', coords[1])
          .attr('r', cityRadius)
          .attr('fill', '#c41e3a')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1 * scaleFactor)
          .style('pointer-events', 'none');
        
        // City label with background
        cityGroup.append('text')
          .attr('x', coords[0])
          .attr('y', coords[1] - 6 * scaleFactor)
          .attr('text-anchor', 'middle')
          .attr('font-size', `${fontSize}px`)
          .attr('font-weight', '600')
          .attr('fill', '#333')
          .style('pointer-events', 'none')
          .style('text-shadow', '1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white')
          .text(city.name);
      }
    });

    return () => {
      tooltip.remove();
    };
  }, [geoData, prefectures, onPrefectureClick, zoomScale]);

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <svg
        ref={svgRef}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
    </div>
  );
};

export default RealisticJapanMap;
