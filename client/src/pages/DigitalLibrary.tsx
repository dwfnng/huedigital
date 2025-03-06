import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  FileText, Search, History, Map,
  Landmark, Mountain, Hammer, Music
} from "lucide-react";
import { ResourceDialog } from "@/components/ResourceDialog";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different categories
const markerIcons = {
  historical_sites: new L.Icon({
    iconUrl: '/markers/historical.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  landscapes: new L.Icon({
    iconUrl: '/markers/landscape.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  craft_villages: new L.Icon({
    iconUrl: '/markers/craft.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  temples: new L.Icon({
    iconUrl: '/markers/temple.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
};

interface FilterState {
  type?: string;
  category?: string;
  searchQuery: string;
}

const categories = [
  {
    id: "historical_sites",
    label: "Di tích lịch sử",
    icon: <Landmark />,
    description: "Hoàng thành, đền đài, chùa chiền và lăng tẩm"
  },
  {
    id: "landscapes",
    label: "Danh thắng",
    icon: <Mountain />,
    description: "Sông Hương, núi Ngự Bình và các thắng cảnh"
  },
  {
    id: "craft_villages", 
    label: "Làng nghề truyền thống",
    icon: <Hammer />,
    description: "Làng nghề thủ công mỹ nghệ truyền thống"
  },
  {
    id: "intangible_heritage",
    label: "Di sản phi vật thể",
    icon: <Music />,
    description: "Ca Huế, ẩm thực, trang phục truyền thống"
  }
];

export default function DigitalLibrary() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: ""
  });

  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<"list" | "map">("map");

  const { data: resources = [] } = useQuery({
    queryKey: ["/api/digital-library"],
  });

  const filteredResources = resources.filter(resource => {
    if (filters.category && resource.category !== filters.category) return false;
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description?.toLowerCase().includes(searchLower) ||
        resource.keywords?.some(k => k.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const handleResourceClick = (resource: any) => {
    setSelectedResource(resource);
    setDialogOpen(true);
  };

  // Helper function to get icon based on category
  const getMarkerIcon = (category: string) => {
    return markerIcons[category as keyof typeof markerIcons] || L.Icon.Default;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kho học liệu số</h1>
          <p className="text-muted-foreground mt-1">
            Khám phá kho tàng di sản văn hóa Huế qua tư liệu số
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              className="pl-10"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>
          <div className="flex border rounded-lg">
            <button
              className={`px-3 py-2 ${view === 'list' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setView('list')}
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              className={`px-3 py-2 ${view === 'map' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setView('map')}
            >
              <Map className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`p-4 hover:bg-accent transition-colors cursor-pointer ${
              filters.category === category.id ? 'bg-accent' : ''
            }`}
            onClick={() => setFilters(prev => ({
              ...prev,
              category: prev.category === category.id ? undefined : category.id
            }))}
          >
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {category.icon}
              </div>
              <div>
                <h3 className="font-semibold">{category.label}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {category.description}
                </p>
                <p className="text-sm mt-2 text-muted-foreground">
                  {filteredResources.filter(r => r.category === category.id).length} tài liệu
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => handleResourceClick(resource)}
              >
                <div className="aspect-video relative">
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2">{resource.title}</h3>
                  {resource.description && (
                    <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                      {resource.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {resource.keywords?.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {categories.find(c => c.id === resource.category)?.label || resource.category}
                    </div>
                    {resource.period && (
                      <div className="flex items-center gap-1">
                        <History className="h-3 w-3" />
                        {resource.period}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {filteredResources.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">Không tìm thấy tài liệu</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[700px] rounded-lg overflow-hidden border">
          <MapContainer
            center={[16.4637, 107.5909]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredResources
              .filter(resource => resource.latitude && resource.longitude)
              .map(resource => (
                <Marker
                  key={resource.id}
                  position={[parseFloat(resource.latitude), parseFloat(resource.longitude)]}
                  icon={getMarkerIcon(resource.category)}
                >
                  <Popup>
                    <div className="text-center p-2">
                      <h3 className="font-semibold text-sm">{resource.title}</h3>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      )}

      <ResourceDialog
        resource={selectedResource}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}