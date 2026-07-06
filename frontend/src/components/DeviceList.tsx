import type { Device } from "../types/device";
import DeviceCard from "./DeviceCard";

interface DeviceListProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
}

export default function DeviceList({ devices, onDeviceClick }: DeviceListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device, index) => (
        <DeviceCard
          key={device.id || index}
          device={device}
          onClick={() => onDeviceClick(device)}
        />
      ))}
    </div>
  );
}
