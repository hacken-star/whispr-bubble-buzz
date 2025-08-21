import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const UniversityMap = ({ onSelectUniversity }: UniversityMapProps) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching universities:', error);
          return;
        }

        const formattedData = data?.map(uni => ({
          ...uni,
          shortName: uni.short_name
        })) || [];
        setUniversities(formattedData);
      } catch (error) {
        console.error('Error fetching universities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-map p-4 flex items-center justify-center">
        <div className="text-xl text-foreground">Loading campus map...</div>
      </div>
    );
  }

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
          
          {/* Dotted connection lines between universities */}
          {universities.map((uni, index) => {
            const nextUni = universities[index + 1];
            if (!nextUni) return null;
            
            return (
              <line
                key={`line-${uni.id}-${nextUni.id}`}
                x1={uni.x}
                y1={uni.y}
                x2={nextUni.x}
                y2={nextUni.y}
                stroke="hsl(var(--whispr-teal))"
                strokeWidth="0.3"
                strokeDasharray="1,1"
                opacity="0.4"
              />
            );
          })}
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
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm max-w-[200px] text-center">
                {uni.name}
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