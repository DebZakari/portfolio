import * as THREE from "three";

// Pre-allocated objects — reused every frame to avoid GC pressure
const _raycaster = new THREE.Raycaster();
const _ndc = new THREE.Vector2();
const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y=0 galaxy plane
const _target = new THREE.Vector3();

export function cursorToWorld(
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number,
  camera: THREE.Camera,
): THREE.Vector3 | null {
  _ndc.set(
    (x / containerWidth) * 2 - 1,
    -(y / containerHeight) * 2 + 1,
  );
  _raycaster.setFromCamera(_ndc, camera);
  return _raycaster.ray.intersectPlane(_plane, _target);
}
