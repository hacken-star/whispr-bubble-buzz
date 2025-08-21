import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface University {
  id: string;
  name: string;
  shortName: string;
  x: number;
  y: number;
  color: string;
  state: string;
}

interface UniversityMapProps {
  onSelectUniversity: (university: University) => void;
}

const universities: University[] = [
  { id: "karl-kumm", name: "Karl-Kumm University", shortName: "KKU", x: 45, y: 25, color: "whispr-purple", state: "Vom" },
  { id: "anan", name: "ANAN University", shortName: "ANAN", x: 60, y: 30, color: "whispr-teal", state: "Kwall" },
  { id: "plateau-poly", name: "Plateau State Polytechnic", shortName: "PLAPOLY", x: 55, y: 35, color: "whispr-pink", state: "Bukuru" },
  { id: "fed-poly-nyak", name: "Federal Polytechnic", shortName: "FEDPOLY", x: 50, y: 40, color: "whispr-blue", state: "Nyak Shendam" },
  { id: "animal-health", name: "Federal College of Animal Health", shortName: "FCAH", x: 40, y: 28, color: "whispr-green", state: "Vom" },
  { id: "forestry-jos", name: "Federal College of Forestry", shortName: "FCF", x: 52, y: 32, color: "whispr-yellow", state: "Jos" },
  { id: "land-resources", name: "Federal College of Land Resources Tech", shortName: "FCLRT", x: 58, y: 38, color: "whispr-orange", state: "Kuru" },
  { id: "agric-garkawa", name: "Plateau State College of Agriculture", shortName: "PSCA", x: 65, y: 45, color: "whispr-purple", state: "Garkawa" },
  { id: "oswald-shendam", name: "Oswald College of Education", shortName: "OCE", x: 48, y: 42, color: "whispr-teal", state: "Shendam" },
  { id: "uniabuja", name: "University of Abuja", shortName: "UniAbuja", x: 35, y: 50, color: "whispr-blue", state: "Abuja" },
  { id: "unn", name: "University of Nigeria", shortName: "UNN", x: 70, y: 60, color: "whispr-pink", state: "Nsukka" },
  { id: "unilag", name: "University of Lagos", shortName: "UNILAG", x: 25, y: 70, color: "whispr-green", state: "Lagos" },
  { id: "uniport", name: "University of Port Harcourt", shortName: "UNIPORT", x: 45, y: 80, color: "whispr-yellow", state: "Port Harcourt" },
  { id: "abu", name: "Ahmadu Bello University", shortName: "ABU", x: 30, y: 20, color: "whispr-orange", state: "Zaria" },
  { id: "atbu", name: "Abubakar Tafawa Balewa University", shortName: "ATBU", x: 55, y: 15, color: "whispr-purple", state: "Bauchi" },
  { id: "ui", name: "University of Ibadan", shortName: "UI", x: 20, y: 65, color: "whispr-teal", state: "Ibadan" },
  { id: "delsu", name: "Delta State University", shortName: "DELSU", x: 40, y: 75, color: "whispr-pink", state: "Abraka" },
  { id: "absu", name: "Abia State University", shortName: "ABSU", x: 60, y: 70, color: "whispr-blue", state: "Uturu" },
];

const UniversityMap = ({ onSelectUniversity }: UniversityMapProps) => {
  return (
    <div className="min-h-screen bg-gradient-map p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Campus Map</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search universities..." 
          className="pl-10 rounded-full bg-white/80 backdrop-blur-sm border-none shadow-sm"
        />
      </div>

      {/* Map Container */}
      <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-6 min-h-[500px] overflow-hidden">
        {/* Nigeria outline - simplified */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-30" 
          viewBox="0 0 100 100" 
          fill="none"
        >
          <path 
            d="M10 20 Q20 15 40 18 Q60 12 80 25 Q85 40 75 60 Q70 80 50 85 Q30 82 15 70 Q8 50 10 20 Z" 
            stroke="hsl(var(--whispr-teal))" 
            strokeWidth="0.5" 
            fill="hsl(var(--whispr-teal) / 0.1)"
          />
        </svg>

        {/* Universities */}
        {universities.map((uni) => (
          <div
            key={uni.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${uni.x}%`, top: `${uni.y}%` }}
            onClick={() => onSelectUniversity(uni)}
          >
            <div className={`relative`}>
              {/* University Pin */}
              <div 
                className={`w-12 h-12 rounded-full bg-${uni.color} shadow-bubble flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-bubble-glow animate-bubble-pop`}
                style={{ 
                  backgroundColor: `hsl(var(--whispr-${uni.color.split('-')[1]}))`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* University Name Tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                {uni.shortName}
              </div>

              {/* Connection Line (simplified) */}
              <div className="absolute top-6 left-6 w-px h-8 bg-whispr-teal/30 opacity-50"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Nearby Schools Button */}
      <Button 
        className="w-full h-14 bg-gradient-primary text-white font-semibold text-lg rounded-2xl shadow-bubble hover:shadow-bubble-glow transition-all duration-300"
        onClick={() => onSelectUniversity(universities[0])}
      >
        <MapPin className="mr-2 h-5 w-5" />
        Nearby Schools
      </Button>
    </div>
  );
};

export default UniversityMap;