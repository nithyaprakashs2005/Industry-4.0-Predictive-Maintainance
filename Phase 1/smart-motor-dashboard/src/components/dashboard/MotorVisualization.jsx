import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import StatusBadge from '../common/StatusBadge';

function Rotor({ rpm, status }) {
  const ref = useRef();
  const speed = (rpm / 60) * 0.05;

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += speed * delta * 60;
    }
  });

  const rotorColor = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#64748b';

  return (
    <group ref={ref}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 0.3, 32]} />
        <meshStandardMaterial color={rotorColor} metalness={0.8} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (Math.PI / 2) * i]} position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 1.0, 0.25]} />
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function MotorModel({ rpm, status, componentStatus }) {
  const bodyColor = status === 'critical' ? '#dc2626' : status === 'warning' ? '#d97706' : '#2563eb';
  const fanSpeed = rpm / 60;

  return (
    <group>
      {/* Housing */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 1.6, 32]} />
        <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.4} transparent opacity={0.85} />
      </mesh>

      {/* End bell - front */}
      <mesh position={[0, 0, 0.85]}>
        <cylinderGeometry args={[0.92, 0.92, 0.15, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* End bell - rear */}
      <mesh position={[0, 0, -0.85]}>
        <cylinderGeometry args={[0.92, 0.92, 0.15, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rotor */}
      <Rotor rpm={rpm} status={status} />

      {/* Shaft */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.2, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Cooling fan */}
      <FanBlades speed={fanSpeed} status={componentStatus.cooling} />

      {/* Callout labels */}
      <Callout position={[1.3, 0.6, 0.5]} label="Bearing" status={componentStatus.bearing} />
      <Callout position={[1.3, -0.4, 0]} label="Rotor" status={componentStatus.rotor} />
      <Callout position={[-1.3, 0.5, 0]} label="Housing" status={componentStatus.housing} />
      <Callout position={[-1.3, -0.5, 0.3]} label="Cooling" status={componentStatus.cooling} />
      <Callout position={[0, 1.2, 0.5]} label="Temperature" status={componentStatus.temperature} />
      <Callout position={[0, -1.2, 0.5]} label="Vibration" status={componentStatus.vibration} />
    </group>
  );
}

function FanBlades({ speed, status }) {
  const ref = useRef();
  const color = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#475569';

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += speed * 0.1 * delta * 60;
    }
  });

  return (
    <group ref={ref} position={[0, 0, -0.95]}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} rotation={[0, 0, (Math.PI / 3) * i]}>
          <boxGeometry args={[0.04, 0.5, 0.06]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Callout({ position, label, status }) {
  const dotColor = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981';

  return (
    <Html position={position} center style={{ pointerEvents: 'none' }}>
      <div className="flex items-center gap-1.5 bg-white/95 border border-industrial-700 rounded px-2 py-1 whitespace-nowrap shadow-sm">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
        <span className="text-[10px] text-industrial-300 font-medium">{label}</span>
        <StatusBadge status={status === 'healthy' ? 'normal' : status} size="sm" />
      </div>
    </Html>
  );
}

function getComponentStatus(sensorData, scenario) {
  const { status, temperature, vibration } = sensorData;

  if (scenario === 'bearing_failure') {
    return {
      bearing: 'critical', rotor: 'critical', housing: 'warning',
      cooling: 'warning', temperature: 'critical', vibration: 'critical',
    };
  }
  if (scenario === 'overheating') {
    return {
      bearing: 'warning', rotor: 'normal', housing: 'warning',
      cooling: 'critical', temperature: 'critical', vibration: 'normal',
    };
  }
  if (scenario === 'excessive_vibration') {
    return {
      bearing: 'warning', rotor: 'warning', housing: 'normal',
      cooling: 'normal', temperature: 'normal', vibration: 'critical',
    };
  }
  if (scenario === 'overspeed') {
    return {
      bearing: 'warning', rotor: 'critical', housing: 'warning',
      cooling: 'warning', temperature: 'warning', vibration: 'warning',
    };
  }

  const tempStatus = temperature > 80 ? 'critical' : temperature > 70 ? 'warning' : 'healthy';
  const vibStatus = vibration > 0.08 ? 'critical' : vibration > 0.04 ? 'warning' : 'healthy';

  return {
    bearing: status === 'critical' ? 'critical' : status === 'warning' ? 'warning' : 'healthy',
    rotor: 'healthy',
    housing: 'healthy',
    cooling: tempStatus === 'critical' ? 'warning' : 'healthy',
    temperature: tempStatus,
    vibration: vibStatus,
  };
}

export default function MotorVisualization({ sensorData, scenario, motorId = 'MTR-001', motorName = 'Main Production Motor' }) {
  const componentStatus = getComponentStatus(sensorData, scenario);

  return (
    <div className="card-industrial p-4 h-full flex flex-col">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-industrial-300">Motor Condition</h3>
        <p className="text-[10px] text-industrial-500">{motorId} • {motorName}</p>
      </div>
      <div className="flex-1 min-h-[280px] rounded bg-slate-50 border border-industrial-700 overflow-hidden">
        <Suspense fallback={
          <div className="h-full flex items-center justify-center text-industrial-500 text-xs">
            Loading 3D model...
          </div>
        }>
          <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-3, 2, -3]} intensity={0.4} />
            <MotorModel
              rpm={sensorData.rpm}
              status={sensorData.status}
              componentStatus={componentStatus}
            />
            <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
          </Canvas>
        </Suspense>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {Object.entries(componentStatus).slice(0, 3).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between text-[10px] px-2 py-1.5 bg-industrial-800 rounded border border-industrial-700">
            <span className="text-industrial-500 capitalize">{key}</span>
            <StatusBadge status={val === 'healthy' ? 'normal' : val} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
