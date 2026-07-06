import type { Device } from "../types/device";
import DeviceCard from "./DeviceCard";

interface DeviceListProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
  isFavorite: (ns: string) => boolean;
  onToggleFavorite: (ns: string) => void;
}

export default function DeviceList({
  devices,
  onDeviceClick,
  isFavorite,
  onToggleFavorite,
}: DeviceListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device, index) => (
        <DeviceCard
          key={device.ns || index}
          device={device}
          onClick={() => onDeviceClick(device)}
          isFavorite={isFavorite(device.ns)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
