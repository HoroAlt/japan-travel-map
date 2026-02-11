import React, { useState } from 'react';
import type { Prefecture, District, Location } from '../types';
import { getPrefectureProgress } from '../types';

interface PrefectureModalProps {
  prefecture: Prefecture;
  onClose: () => void;
  onUpdatePrefecture: (prefecture: Prefecture) => void;
}

const PrefectureModal: React.FC<PrefectureModalProps> = ({ 
  prefecture, 
  onClose, 
  onUpdatePrefecture 
}) => {
  const [newLocationName, setNewLocationName] = useState('');
  const [activeDistrictId, setActiveDistrictId] = useState<string | null>(null);

  const progress = getPrefectureProgress(prefecture);
  
  // District stats
  const totalDistricts = prefecture.districts.length;
  const visitedDistricts = prefecture.districts.filter(d => d.locations.some(l => l.visited)).length;
   
  // Location stats  
  const totalLocations = prefecture.districts.reduce(
    (sum, d) => sum + d.locations.length, 0
  );
  const visitedLocations = prefecture.districts.reduce(
    (sum, d) => sum + d.locations.filter(l => l.visited).length, 0
  );

  const toggleLocation = (districtId: string, locationId: string) => {
    const updatedDistricts = prefecture.districts.map(district => {
      if (district.id !== districtId) return district;
      
      return {
        ...district,
        locations: district.locations.map(location =>
          location.id === locationId
            ? { ...location, visited: !location.visited }
            : location
        )
      };
    });

    onUpdatePrefecture({
      ...prefecture,
      districts: updatedDistricts
    });
  };

  const addLocation = (districtId: string) => {
    if (!newLocationName.trim()) return;
    
    const newLocation: Location = {
      id: `${districtId}-loc-${Date.now()}`,
      name: newLocationName.trim(),
      visited: true
    };

    const updatedDistricts = prefecture.districts.map(district => {
      if (district.id !== districtId) return district;
      
      return {
        ...district,
        locations: [...district.locations, newLocation]
      };
    });

    onUpdatePrefecture({
      ...prefecture,
      districts: updatedDistricts
    });

    setNewLocationName('');
    setActiveDistrictId(null);
  };

  const getDistrictStatus = (district: District): 'completed' | 'partial' | 'unvisited' => {
    if (district.locations.length === 0) return 'unvisited';
    const visited = district.locations.filter(l => l.visited).length;
    if (visited === 0) return 'unvisited';
    if (visited === district.locations.length) return 'completed';
    return 'partial';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {prefecture.name}
            <span className="jp">{prefecture.nameJp}</span>
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="prefecture-stats">
            <div className="prefecture-stat">
              <div className="label">Районов</div>
              <div className="value">
                {visitedDistricts}/{totalDistricts}
              </div>
            </div>
            <div className="prefecture-stat">
              <div className="label">Мест</div>
              <div className="value">
                {visitedLocations}/{totalLocations}
              </div>
            </div>
            <div className="prefecture-stat">
              <div className="label">Прогресс</div>
              <div className="value" style={{ color: progress > 0 ? '#ffd93d' : '#6c757d' }}>
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          <div className="progress-container" style={{ marginBottom: '30px' }}>
            <div className="progress-header">
              <h3>Прогресс по районам ({visitedDistricts} из {totalDistricts})</h3>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>
            Районы ({prefecture.districts.length})
          </h3>

          <div className="districts-grid">
            {prefecture.districts.map(district => {
              const districtStatus = getDistrictStatus(district);
              
              return (
                <div
                  key={district.id}
                  className={`district-card ${districtStatus === 'completed' ? 'completed' : ''}`}
                >
                  <div className="district-header">
                    <div>
                      <h4>{district.name}</h4>
                      <span className="jp">{district.nameJp}</span>
                    </div>
                    {districtStatus === 'completed' && (
                      <span style={{ fontSize: '1.5rem' }}>✓</span>
                    )}
                  </div>

                  <div className="district-progress">
                    {district.locations.length > 0 ? (
                      <>Посещено: {district.locations.filter(l => l.visited).length} / {district.locations.length}</>
                    ) : (
                      'Нет отмеченных мест'
                    )}
                  </div>

                  {district.locations.length > 0 && (
                    <div className="locations-list">
                      {district.locations.map(location => (
                        <label 
                          key={location.id} 
                          className={`location-item ${location.visited ? 'completed' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={location.visited}
                            onChange={() => toggleLocation(district.id, location.id)}
                          />
                          <span>{location.name}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="add-location">
                    {activeDistrictId === district.id ? (
                      <>
                        <input
                          type="text"
                          placeholder="Название места..."
                          value={newLocationName}
                          onChange={(e) => setNewLocationName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addLocation(district.id)}
                          autoFocus
                        />
                        <button 
                          className="add-btn"
                          onClick={() => addLocation(district.id)}
                        >
                          Добавить
                        </button>
                        <button 
                          className="add-btn"
                          style={{ background: '#6c757d' }}
                          onClick={() => {
                            setActiveDistrictId(null);
                            setNewLocationName('');
                          }}
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <button 
                        className="add-btn"
                        style={{ width: '100%' }}
                        onClick={() => setActiveDistrictId(district.id)}
                      >
                        + Добавить место
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrefectureModal;
