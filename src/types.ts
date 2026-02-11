export interface District {
  id: string;
  name: string;
  nameJp: string;
  visited: boolean;
  locations: Location[];
}

export interface Location {
  id: string;
  name: string;
  visited: boolean;
}

export interface Prefecture {
  id: string;
  name: string;
  nameJp: string;
  region: Region;
  districts: District[];
  svgPath: string;
}

export type Region = 'hokkaido' | 'tohoku' | 'kanto' | 'chubu' | 'kinki' | 'chugoku' | 'shikoku' | 'kyushu';

export type RegionType = Region;

export type VisitStatus = 'unvisited' | 'partial' | 'completed';

// Helper to check if district has any visited locations
const hasDistrictVisitedLocations = (district: District): boolean => {
  return district.locations.some(loc => loc.visited);
};

// Helper to check if district is fully visited (all locations)
const isDistrictFullyVisited = (district: District): boolean => {
  if (district.locations.length === 0) return false;
  return district.locations.every(loc => loc.visited);
};

export const getPrefectureStatus = (prefecture: Prefecture): VisitStatus => {
  const totalDistricts = prefecture.districts.length;
  const visitedDistricts = prefecture.districts.filter(d => hasDistrictVisitedLocations(d)).length;
  const fullyVisitedDistricts = prefecture.districts.filter(d => isDistrictFullyVisited(d)).length;
  
  if (visitedDistricts === 0) return 'unvisited';
  if (fullyVisitedDistricts === totalDistricts) return 'completed';
  return 'partial';
};

export const getPrefectureProgress = (prefecture: Prefecture): number => {
  const totalDistricts = prefecture.districts.length;
  if (totalDistricts === 0) return 0;
  
  // Count districts that have at least one visited location
  const visitedDistricts = prefecture.districts.filter(d => hasDistrictVisitedLocations(d)).length;
  
  return (visitedDistricts / totalDistricts) * 100;
};

// Progress based on locations (for display purposes)
export const getPrefectureLocationProgress = (prefecture: Prefecture): { visited: number; total: number } => {
  const totalLocations = prefecture.districts.reduce(
    (sum, district) => sum + district.locations.length,
    0
  );
  const visitedLocations = prefecture.districts.reduce(
    (sum, district) => sum + district.locations.filter(loc => loc.visited).length,
    0
  );
  
  return { visited: visitedLocations, total: totalLocations };
};
