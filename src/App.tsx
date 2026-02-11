import { useState, useRef } from 'react';
import './App.css';
import type { Prefecture } from './types';
import { initialPrefectures } from './data';
import { useLocalStorage } from './hooks/useLocalStorage';
import RealisticJapanMap from './components/RealisticJapanMap';
import PrefectureModal from './components/PrefectureModal';
import Stats from './components/Stats';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

function App() {
  const [prefectures, setPrefectures] = useLocalStorage<Prefecture[]>('japan-travel-prefectures', initialPrefectures);
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const transformRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrefectureClick = (prefecture: Prefecture) => {
    setSelectedPrefecture(prefecture);
  };

  const handleUpdatePrefecture = (updatedPrefecture: Prefecture) => {
    const updatedPrefectures = prefectures.map(p => 
      p.id === updatedPrefecture.id ? updatedPrefecture : p
    );
    setPrefectures(updatedPrefectures);
    setSelectedPrefecture(updatedPrefecture);
  };

  const resetData = () => {
    if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
      setPrefectures(initialPrefectures);
    }
  };

  const exportData = () => {
    // Generate report
    const report = [];
    report.push('=== ОТЧЕТ О ПУТЕШЕСТВИЯХ ПО ЯПОНИИ ===\n');
    report.push(`Дата генерации: ${new Date().toLocaleDateString('ru-RU')}\n`);
    report.push('=' .repeat(50) + '\n\n');

    // Group by region for better organization
    const regions: Record<string, Prefecture[]> = {};
    prefectures.forEach(pref => {
      if (!regions[pref.region]) {
        regions[pref.region] = [];
      }
      regions[pref.region].push(pref);
    });

    Object.entries(regions).forEach(([region, regionPrefectures]) => {
      report.push(`\n${region.toUpperCase()}`);
      report.push('-'.repeat(40));

      regionPrefectures.forEach(pref => {
        const visitedDistricts = pref.districts.filter(d => d.locations.some(l => l.visited)).length;
        const totalDistricts = pref.districts.length;
        const visitedLocations = pref.districts.reduce((sum, d) => sum + d.locations.filter(l => l.visited).length, 0);
        const totalLocations = pref.districts.reduce((sum, d) => sum + d.locations.length, 0);
        
        if (totalLocations === 0 && visitedDistricts === 0) {
          // Skip unvisited prefectures
          return;
        } else if (visitedDistricts === totalDistricts) {
          report.push(`\n  ✓ ${pref.name} (${pref.nameJp}) - Полностью посещено`);
          report.push(`    Районов: ${visitedDistricts}/${totalDistricts}, Мест: ${visitedLocations}`);
        } else if (visitedDistricts > 0) {
          report.push(`\n  ◐ ${pref.name} (${pref.nameJp}) - Частично`);
          report.push(`    Районов: ${visitedDistricts}/${totalDistricts}, Мест: ${visitedLocations}/${totalLocations}`);
          
          // List visited districts and places
          pref.districts.forEach(district => {
            const visited = district.locations.filter(l => l.visited);
            if (visited.length > 0) {
              report.push(`\n    ${district.name} (${district.nameJp}):`);
              visited.forEach(loc => {
                report.push(`      • ${loc.name}`);
              });
            }
          });
        }
      });
      
      report.push('\n');
    });

    report.push('\n' + '='.repeat(50));
    report.push('\nКонец отчета');

    // Create and download file
    const blob = new Blob([report.join('')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `japan-travel-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      summary: {
        totalPrefectures: prefectures.length,
        visitedPrefectures: prefectures.filter(p => {
          const totalDistricts = p.districts.length;
          const visitedDistricts = p.districts.filter(d => d.locations.some(l => l.visited)).length;
          return totalDistricts > 0 && visitedDistricts === totalDistricts;
        }).length,
        partialPrefectures: prefectures.filter(p => {
          const totalDistricts = p.districts.length;
          const visitedDistricts = p.districts.filter(d => d.locations.some(l => l.visited)).length;
          return totalDistricts > 0 && visitedDistricts > 0 && visitedDistricts < totalDistricts;
        }).length
      },
      prefectures: prefectures.map(pref => ({
        id: pref.id,
        name: pref.name,
        nameJp: pref.nameJp,
        region: pref.region,
        districts: pref.districts.map(d => ({
          id: d.id,
          name: d.name,
          nameJp: d.nameJp,
          locations: d.locations.map(l => ({
            id: l.id,
            name: l.name,
            visited: l.visited
          }))
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `japan-travel-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.prefectures || !Array.isArray(data.prefectures)) {
          alert('Неверный формат файла. Пожалуйста, выберите корректный JSON файл.');
          return;
        }

        // Merge imported data with initial prefectures structure
        const mergedPrefectures = initialPrefectures.map(initPref => {
          const importedPref = data.prefectures.find((p: Prefecture) => p.id === initPref.id);
          if (importedPref) {
            return {
              ...initPref,
              districts: initPref.districts.map((initDistrict, index) => {
                const importedDistrict = importedPref.districts?.find((d: any) => d.id === initDistrict.id) || 
                                         importedPref.districts?.[index];
                if (importedDistrict && importedDistrict.locations) {
                  return {
                    ...initDistrict,
                    locations: importedDistrict.locations.map((l: any, locIndex: number) => ({
                      id: l.id || `${initDistrict.id}-loc-${locIndex}`,
                      name: l.name || 'Unknown',
                      visited: !!l.visited
                    }))
                  };
                }
                return initDistrict;
              })
            };
          }
          return initPref;
        });

        setPrefectures(mergedPrefectures);
        alert('Данные успешно загружены!');
      } catch (error) {
        console.error('Import error:', error);
        alert('Ошибка при загрузке файла. Проверьте формат JSON.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="app">
      <header>
        <h1>
          Japan Travel Map
          <span className="jp">日本旅行マップ</span>
        </h1>
        <p>Отслеживайте свои путешествия по Японии</p>
      </header>

      <Stats prefectures={prefectures} />

      <div className="map-container">
        <div className="map-header">
          <h2>Карта Японии</h2>
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color unvisited"></div>
              <span>Не посещено</span>
            </div>
            <div className="legend-item">
              <div className="legend-color partial"></div>
              <span>Частично</span>
            </div>
            <div className="legend-item">
              <div className="legend-color completed"></div>
              <span>Посещено</span>
            </div>
          </div>
        </div>

        <div className="zoom-controls">
          <button 
            onClick={() => transformRef.current?.zoomIn()}
            className="zoom-btn"
            title="Увеличить"
          >
            +
          </button>
          <button 
            onClick={() => transformRef.current?.zoomOut()}
            className="zoom-btn"
            title="Уменьшить"
          >
            −
          </button>
          <button 
            onClick={() => transformRef.current?.resetTransform()}
            className="zoom-btn reset"
            title="Сбросить масштаб"
          >
            ⟲
          </button>
        </div>

        <div className="map-wrapper">
          <TransformWrapper
            ref={transformRef}
            initialScale={1}
            minScale={0.5}
            maxScale={6}
            centerOnInit={true}
            wheel={{ 
              disabled: false,
              step: 0.08,
              smoothStep: 0.005
            }}
            pinch={{ 
              disabled: false,
              step: 0.1
            }}
            doubleClick={{ 
              disabled: false,
              step: 0.8,
              mode: 'zoomIn'
            }}
            zoomAnimation={{ 
              disabled: false,
              size: 0.2,
              animationTime: 200
            }}
            alignmentAnimation={{ 
              disabled: false,
              sizeX: 0.1,
              sizeY: 0.1,
              animationTime: 200
            }}
            onZoom={(ref) => setZoomScale(ref.state.scale)}
          >
            <TransformComponent
              wrapperClass="transform-wrapper"
              contentClass="transform-content"
            >
              <RealisticJapanMap
                prefectures={prefectures}
                onPrefectureClick={handlePrefectureClick}
                zoomScale={zoomScale}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>

        <div className="map-hint">
          <p>🗺️ <strong>Навигация:</strong> Используйте колесико мыши для плавного масштабирования или кнопки +/-. Перетаскивайте карту для перемещения.</p>
          <p>📍 <strong>Отметка мест:</strong> Нажмите на префектуру, чтобы открыть детали. Добавляйте свои любимые места в каждом районе — это могут быть памятные локации, вкусные рестораны, храмы или просто специальные места, которые запомнились в путешествии.</p>
        </div>
      </div>

      <div className="export-section">
        <h3>Экспорт и импорт данных</h3>
        <div className="export-buttons">
          <button 
            onClick={exportData}
            className="export-btn"
          >
            📄 Скачать отчет (TXT)
          </button>
          <button 
            onClick={exportJSON}
            className="export-btn json"
          >
            💾 Скачать JSON
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="export-btn import"
          >
            📁 Загрузить JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importData}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
        <button 
          onClick={resetData}
          style={{
            padding: '10px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Сбросить все данные
        </button>
      </div>

      {selectedPrefecture && (
        <PrefectureModal
          prefecture={selectedPrefecture}
          onClose={() => setSelectedPrefecture(null)}
          onUpdatePrefecture={handleUpdatePrefecture}
        />
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-text">
            Сделано с ❤️ к Японии и любовью к путешествиям
          </p>
          <p className="footer-author">
            Разработчик: <a href="https://t.me/Horonyak" target="_blank" rel="noopener noreferrer" className="footer-link">Михаил "HoroAlt"</a> · 2026
          </p>
          <p className="footer-links">
            <a href="https://www.ru.emb-japan.go.jp/" target="_blank" rel="noopener noreferrer" className="footer-link embassy-link">
              🇯🇵 Посольство Японии в России
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
