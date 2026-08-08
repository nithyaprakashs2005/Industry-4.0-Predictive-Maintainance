import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import StatusBadge from '../common/StatusBadge';

// Helper component that renders both solid metallic material AND glowing wireframe overlay (CAD Blueprint Style)
function HoloPart({
  geometry,
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#0284c7',
  wireColor = '#38bdf8',
  wireOpacity = 0.5,
  metalness = 0.85,
  roughness = 0.25,
  opacity = 0.82,
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {geometry ? (
        <>
          <mesh geometry={geometry}>
            <meshStandardMaterial
              color={color}
              metalness={metalness}
              roughness={roughness}
              transparent
              opacity={opacity}
            />
          </mesh>
          <mesh geometry={geometry}>
            <meshBasicMaterial
              color={wireColor}
              wireframe
              transparent
              opacity={wireOpacity}
            />
          </mesh>
        </>
      ) : (
        children
      )}
    </group>
  );
}

function Rotor({ rpm, status }) {
  const ref = useRef();
  const speed = rpm > 0 ? (rpm / 60) * 0.05 : 0;

  useFrame((_, delta) => {
    if (ref.current && rpm > 0) {
      ref.current.rotation.z += speed * delta * 60;
    }
  });

  const rotorColor = status === 'critical' ? '#dc2626' : status === 'warning' ? '#d97706' : '#0ea5e9';
  const wireColor = status === 'critical' ? '#f87171' : status === 'warning' ? '#fbbf24' : '#38bdf8';

  return (
    <group ref={ref}>
      {/* Central Rotor Cylinder */}
      <mesh>
        <cylinderGeometry args={[0.52, 0.52, 1.4, 32]} />
        <meshStandardMaterial color={rotorColor} metalness={0.9} roughness={0.2} transparent opacity={0.8} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.52, 0.52, 1.4, 32]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.6} />
      </mesh>

      {/* Internal Induction Slots */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh key={i} rotation={[0, 0, (Math.PI / 4) * i]}>
          <boxGeometry args={[0.06, 0.95, 1.35]} />
          <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function FanBlades({ speed, status, position = [0, 0, -1.35] }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current && speed > 0) {
      ref.current.rotation.z += speed * 0.1 * delta * 60;
    }
  });

  const color = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#38bdf8';

  return (
    <group ref={ref} position={position}>
      {/* Fan Hub */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Fan Blades */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <group key={i} rotation={[0, 0, (Math.PI / 4) * i]}>
          <mesh position={[0, 0.22, 0]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.03, 0.32, 0.06]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.22, 0]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.03, 0.32, 0.06]} />
            <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function MotorModel({ rpm, status, componentStatus }) {
  const isCrit = status === 'critical';
  const isWarn = status === 'warning';

  const mainColor = isCrit ? '#8b1a1a' : isWarn ? '#8b6914' : '#0369a1';
  const mainWire = isCrit ? '#fca5a5' : isWarn ? '#fde047' : '#38bdf8';
  const metalAccent = isCrit ? '#991b1b' : isWarn ? '#92400e' : '#0284c7';

  const fanSpeed = rpm > 0 ? rpm / 60 : 0;

  return (
    <group>
      {/* MAIN STATOR BODY CYLINDER */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 1.85, 32]} />
        <meshStandardMaterial color={mainColor} metalness={0.85} roughness={0.25} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 1.85, 32]} />
        <meshBasicMaterial color={mainWire} wireframe transparent opacity={0.45} />
      </mesh>

      {/* LONGITUDINAL RADIAL COOLING FINS (Blueprint CAD Style along length) */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (Math.PI / 12) * i;
        const x = Math.sin(angle) * 0.89;
        const y = Math.cos(angle) * 0.89;
        return (
          <group key={i} position={[x, y, 0]} rotation={[0, 0, -angle]}>
            <mesh>
              <boxGeometry args={[0.035, 0.16, 1.82]} />
              <meshStandardMaterial color={metalAccent} metalness={0.9} roughness={0.2} transparent opacity={0.9} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.035, 0.16, 1.82]} />
              <meshBasicMaterial color={mainWire} wireframe transparent opacity={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* FRONT END SHIELD (BEARING FLANGE) */}
      <mesh position={[0, 0, 0.98]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.88, 0.84, 0.22, 32]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.98]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.88, 0.84, 0.22, 32]} />
        <meshBasicMaterial color={mainWire} wireframe transparent opacity={0.55} />
      </mesh>

      {/* Concentric rings on Front End Shield */}
      {[1.08, 1.11, 1.14].map((z, idx) => (
        <group key={idx}>
          <mesh position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.7 - idx * 0.12, 0.7 - idx * 0.12, 0.02, 32]} />
            <meshStandardMaterial color="#0369a1" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.7 - idx * 0.12, 0.7 - idx * 0.12, 0.02, 32]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Bearing Housing Hub */}
      <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.16, 24]} />
        <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.16, 24]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.7} />
      </mesh>

      {/* End Shield Bolts */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0.68 * Math.cos((Math.PI / 3) * i), 0.68 * Math.sin((Math.PI / 3) * i), 1.12]}>
          <cylinderGeometry args={[0.045, 0.045, 0.05, 8]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* REAR END SHIELD & FAN COVER HOUSING */}
      <mesh position={[0, 0, -1.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
        <meshStandardMaterial color="#0284c7" metalness={0.88} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -1.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
        <meshBasicMaterial color={mainWire} wireframe transparent opacity={0.5} />
      </mesh>

      {/* Domed Rear Fan Shroud Shroud */}
      <mesh position={[0, 0, -1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.92, 0.94, 0.35, 32]} />
        <meshStandardMaterial color="#0369a1" metalness={0.85} roughness={0.3} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0, -1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.92, 0.94, 0.35, 32]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.7} />
      </mesh>

      {/* ROTOR & FAN */}
      <Rotor rpm={rpm} status={status} />
      <FanBlades speed={fanSpeed} status={componentStatus.cooling} position={[0, 0, -1.32]} />

      {/* OUTPUT SHAFT (Front along Z-axis) */}
      <mesh position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 1.2, 24]} />
        <meshStandardMaterial color="#e0f2fe" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 1.2, 24]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Shaft Lock Collar / Keyway Ring */}
      <mesh position={[0, 0, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.15, 6]} />
        <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.15, 6]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.8} />
      </mesh>

      {/* Shaft Keyway Notch */}
      <mesh position={[0.12, 0, 1.55]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.03, 0.06, 0.4]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* TOP JUNCTION / TERMINAL BOX (CAD Blueprint Style) */}
      <mesh position={[0, 1.15, 0.1]}>
        <boxGeometry args={[0.55, 0.38, 0.65]} />
        <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.25} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 1.15, 0.1]}>
        <boxGeometry args={[0.55, 0.38, 0.65]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.65} />
      </mesh>

      {/* Terminal Box Cover Lid */}
      <mesh position={[0, 1.36, 0.1]}>
        <boxGeometry args={[0.59, 0.07, 0.69]} />
        <meshStandardMaterial color="#0369a1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.36, 0.1]}>
        <boxGeometry args={[0.59, 0.07, 0.69]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Terminal Lid Corner Bolts */}
      {[
        [-0.24, 1.4, -0.2],
        [0.24, 1.4, -0.2],
        [-0.24, 1.4, 0.4],
        [0.24, 1.4, 0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 6]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* Side Cable Gland Conduit Connectors */}
      <mesh position={[-0.32, 1.15, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.16, 12]} />
        <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[-0.32, 1.15, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.16, 12]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.7} />
      </mesh>

      {/* DUAL CAST MOUNTING FEET (BASE PADS ON GRID FLOOR) */}
      {[-0.68, 0.68].map((x, idx) => (
        <group key={idx} position={[x, -0.92, 0]}>
          {/* Main Foot Block */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.26, 0.18, 1.45]} />
            <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.26, 0.18, 1.45]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.6} />
          </mesh>

          {/* Mounting Bolt Holes */}
          {[-0.55, 0.55].map((z, j) => (
            <group key={j} position={[0, -0.1, z]}>
              <mesh>
                <cylinderGeometry args={[0.07, 0.07, 0.22, 16]} />
                <meshStandardMaterial color="#082f49" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.03, 16]} />
                <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* CALLOUT LABELS IN 3D SPACE WITH LEADER LINES */}
      <Callout position={[1.7, 0.6, 0.5]} label="Bearing" status={componentStatus.bearing} />
      <Callout position={[1.7, -0.5, 0.4]} label="Rotor" status={componentStatus.rotor} />
      <Callout position={[-1.7, 0.5, 0.2]} label="Housing" status={componentStatus.housing} />
      <Callout position={[-1.7, -0.7, 0.5]} label="Cooling" status={componentStatus.cooling} />
      <Callout position={[0.4, 1.7, 0.3]} label="Temperature" status={componentStatus.temperature} />
      <Callout position={[0.4, -1.6, 0.5]} label="Vibration" status={componentStatus.vibration} />
    </group>
  );
}

function Callout({ position, label, status }) {
  const dotColor = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981';

  return (
    <group position={position}>
      {/* Blueprint leader line stem */}
      <mesh>
        <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      {/* Glowing anchor sphere */}
      <mesh position={[0, -0.08, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={dotColor} />
      </mesh>

      <Html position={[0, 0.09, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl shadow-cyan-950/50">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: dotColor }} />
          <span className="text-[10px] text-cyan-100 font-semibold tracking-wide">{label}</span>
          <StatusBadge status={status === 'healthy' ? 'normal' : status} size="sm" />
        </div>
      </Html>
    </group>
  );
}

function getComponentStatus(sensorData, scenario) {
  const { status, temperature, vibration, rpm } = sensorData;

  if (rpm === 0 && temperature === 0 && vibration === 0) {
    return {
      bearing: 'healthy',
      rotor: 'healthy',
      housing: 'healthy',
      cooling: 'healthy',
      temperature: 'healthy',
      vibration: 'healthy',
    };
  }

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
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-industrial-300 flex items-center gap-2">
            <span>Motor Condition</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 uppercase tracking-wider">
              3D CAD Wireframe
            </span>
          </h3>
          <p className="text-[10px] text-industrial-500">{motorId} • {motorName}</p>
        </div>
      </div>

      {/* Blueprint Dark Tech Viewport Background */}
      <div className="flex-1 min-h-[300px] rounded-lg bg-gradient-to-b from-[#060c1a] to-[#0a1128] border border-cyan-900/40 shadow-inner overflow-hidden relative">
        <Suspense fallback={
          <div className="h-full flex items-center justify-center text-cyan-400 text-xs">
            Loading 3D CAD Blueprint...
          </div>
        }>
          <Canvas camera={{ position: [3.4, 2.2, 3.4], fov: 38 }}>
            {/* Tech Blueprint Ambient Lighting & Cyan Glow Highlights */}
            <ambientLight intensity={0.7} color="#38bdf8" />
            <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
            <directionalLight position={[-5, 3, -5]} intensity={1.2} color="#06b6d4" />
            <pointLight position={[0, 4, 0]} intensity={1.5} color="#00f0ff" />

            {/* Ground Tech Grid Plane (CAD Floor) */}
            <gridHelper args={[16, 32, '#0ea5e9', '#1e293b']} position={[0, -1.35, 0]} />

            <MotorModel
              rpm={sensorData.rpm}
              status={sensorData.status}
              componentStatus={componentStatus}
            />
            <OrbitControls enablePan={false} minDistance={2} maxDistance={7} />
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
