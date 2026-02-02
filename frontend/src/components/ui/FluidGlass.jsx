/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import { useRef, useState, useEffect, memo } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import {
  useFBO,
  useGLTF,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text
} from "@react-three/drei";
import { easing } from "maath";

/* =========================================================
   ROOT
========================================================= */

export default function FluidGlass({
  mode = "lens",
  lensProps = {},
  barProps = {},
  cubeProps = {}
}) {
  const Wrapper = mode === "bar" ? Bar : mode === "cube" ? Cube : Lens;
  const rawOverrides =
    mode === "bar" ? barProps : mode === "cube" ? cubeProps : lensProps;

  const {
    navItems = [
      { label: "Home", link: "/" },
      { label: "About", link: "#" },
      { label: "Contact", link: "#" }
    ],
    ...modeProps
  } = rawOverrides;

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ScrollControls damping={0.2} pages={3} distance={0.4}>
        {mode === "bar" && <NavItems items={navItems} />}
        <Wrapper modeProps={modeProps}>
          <Scroll>
            <Typography />
            <Images />
          </Scroll>
          <Scroll html />
          <Preload />
        </Wrapper>
      </ScrollControls>
    </Canvas>
  );
}

/* =========================================================
   CORE WRAPPER (HARDENED)
========================================================= */

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {}
}) {
  const ref = useRef();
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport, camera, gl, pointer } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  /* 🔍 ONE-TIME DIAGNOSTIC (SAFE TO REMOVE LATER) */
  useEffect(() => {
    console.log("Loaded GLB nodes:", Object.keys(nodes));
  }, [nodes]);

  /* ✅ SAFE GEOMETRY RESOLUTION (CRITICAL FIX) */
  const geometry =
    nodes[geometryKey]?.geometry ??
    Object.values(nodes).find(n => n?.geometry)?.geometry;

  useEffect(() => {
    if (!geometry) {
      console.warn("FluidGlass: No geometry found in GLB:", glb);
      return;
    }
    geometry.computeBoundingBox();
    geoWidthRef.current =
      geometry.boundingBox.max.x - geometry.boundingBox.min.x || 1;
  }, [geometry, glb]);

  useFrame((_, delta) => {
    if (!ref.current || !geometry) return;

    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom
      ? -v.height / 2 + 0.2
      : followPointer
      ? (pointer.y * v.height) / 2
      : 0;

    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (modeProps.scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x5227ff, 1);
  });

  const {
    scale,
    ior,
    thickness,
    anisotropy,
    chromaticAberration,
    ...rest
  } = modeProps;

  if (!geometry) return null;

  return (
    <>
      {createPortal(children, scene)}

      {/* Background buffer */}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>

      {/* Glass geometry */}
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={geometry}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...rest}
        />
      </mesh>
    </>
  );
});

/* =========================================================
   MODES
========================================================= */

function Lens({ modeProps }) {
  return (
    <ModeWrapper
      glb="/assets/3d/lens.glb"
      geometryKey="Cylinder"
      followPointer
      modeProps={modeProps}
    />
  );
}

function Cube({ modeProps }) {
  return (
    <ModeWrapper
      glb="/assets/3d/cube.glb"
      geometryKey="Cube"
      followPointer
      modeProps={modeProps}
    />
  );
}

function Bar({ modeProps }) {
  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{
        transmission: 1,
        roughness: 0,
        thickness: 10,
        ior: 1.15,
        ...modeProps
      }}
    />
  );
}

/* =========================================================
   UI ELEMENTS
========================================================= */

function NavItems({ items }) {
  const group = useRef();
  const { viewport, camera } = useThree();

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);
  });

  return (
    <group ref={group}>
      {items.map(({ label, link }, i) => (
        <Text
          key={label}
          position={[i * 0.3 - 0.3, 0, 0]}
          fontSize={0.045}
          color="white"
          onClick={() => link && (window.location.href = link)}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function Images() {
  const group = useRef();
  const data = useScroll();
  const { height } = useThree(s => s.viewport);

  useFrame(() => {
    group.current?.children.forEach(img => {
      img.material.zoom = 1 + data.offset / 3;
    });
  });

  return (
    <group ref={group}>
      <Image
        position={[-2, 0, 0]}
        scale={[3, height / 1.1, 1]}
        url="/assets/demo/cs1.webp"
      />
      <Image position={[2, 0, 3]} scale={3} url="/assets/demo/cs2.webp" />
    </group>
  );
}

function Typography() {
  return (
    <Text
      position={[0, 0, 12]}
      fontSize={0.6}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      React Bits
    </Text>
  );
}
