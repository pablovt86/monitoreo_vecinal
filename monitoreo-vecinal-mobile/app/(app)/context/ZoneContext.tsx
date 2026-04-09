import { createContext, useContext, useState, ReactNode } from "react";

// =============================
// TIPOS
// =============================

type ZoneType = {
  id: number;
  municipality: string;
  latitude: number;   // ✅ NUEVO
  longitude: number;  // ✅ NUEVO
};


type ZoneContextType = {
  zone: ZoneType | null;
  setZone: React.Dispatch<React.SetStateAction<ZoneType | null>>;
};

// =============================
// CONTEXTO
// =============================

const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

// =============================
// PROVIDER
// =============================

export const ZoneProvider = ({ children }: { children: ReactNode }) => {
  const [zone, setZone] = useState<ZoneType | null>(null);

  return (
    <ZoneContext.Provider value={{ zone, setZone }}>
      {children}
    </ZoneContext.Provider>
  );
};

// =============================
// HOOK
// =============================

export const useZone = () => {
  const context = useContext(ZoneContext);

  if (!context) {
    throw new Error("useZone debe usarse dentro de ZoneProvider");
  }

  return context;
};