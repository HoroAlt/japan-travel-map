import React from 'react';
import type { Prefecture } from '../types';
import { getPrefectureStatus } from '../types';
import { regionNames } from '../data';
import type { Region } from '../types';

interface StatsProps {
  prefectures: Prefecture[];
}

const Stats: React.FC<StatsProps> = ({ prefectures }) => {
  const totalPrefectures = prefectures.length;
  
  const stats = {
    completed: prefectures.filter(p => getPrefectureStatus(p) === 'completed').length,
    partial: prefectures.filter(p => getPrefectureStatus(p) === 'partial').length,
  };

  const visitedLocations = prefectures.reduce(
    (sum, p) => sum + p.districts.reduce(
      (dSum, d) => dSum + d.locations.filter(l => l.visited).length, 0
    ), 0
  );

  const completionRate = totalPrefectures > 0 
    ? Math.round((stats.completed / totalPrefectures) * 100) 
    : 0;

  const regionStats = (Object.keys(regionNames) as Region[]).map(region => {
    const regionPrefectures = prefectures.filter(p => p.region === region);
    const completed = regionPrefectures.filter(p => getPrefectureStatus(p) === 'completed').length;
    return {
      region,
      name: regionNames[region],
      total: regionPrefectures.length,
      completed,
      progress: regionPrefectures.length > 0 ? Math.round((completed / regionPrefectures.length) * 100) : 0
    };
  });

  // Calculate visited districts across all prefectures
  const visitedDistricts = prefectures.reduce(
    (sum, p) => sum + p.districts.filter(d => d.locations.some(l => l.visited)).length,
    0
  );
  const totalDistricts = prefectures.reduce(
    (sum, p) => sum + p.districts.length,
    0
  );

  return (
    <>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Префектур посещено</h3>
          <div className="value">{stats.completed}/{totalPrefectures}</div>
          <div className="subtext">{completionRate}% завершено</div>
        </div>
        <div className="stat-card">
          <h3>Частично посещено</h3>
          <div className="value" style={{ color: '#ffd93d' }}>{stats.partial}</div>
          <div className="subtext">префектур</div>
        </div>
        <div className="stat-card">
          <h3>Районов посещено</h3>
          <div className="value" style={{ color: '#4a90e2' }}>{visitedDistricts}/{totalDistricts}</div>
          <div className="subtext">всего районов</div>
        </div>
        <div className="stat-card">
          <h3>Мест посещено</h3>
          <div className="value" style={{ color: '#6bcb77' }}>{visitedLocations}</div>
          <div className="subtext">всего мест</div>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-header">
          <h3>Общий прогресс по Японии</h3>
          <span>{completionRate}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="progress-container">
        <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Прогресс по регионам</h3>
        {regionStats.map(stat => (
          <div key={stat.region} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 500 }}>
                {stat.name.nameJp} ({stat.name.name})
              </span>
              <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                {stat.completed}/{stat.total}
              </span>
            </div>
            <div className="progress-bar" style={{ height: '8px' }}>
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${stat.progress}%`,
                  background: stat.progress === 100 
                    ? '#6bcb77' 
                    : stat.progress > 0 
                      ? '#ffd93d' 
                      : '#e9ecef'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Stats;
