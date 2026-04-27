export const GRAVITY_CONFIG = {
  GRAVITY_RADIUS: 3.0,       // world units — ~30% of galaxy width
  GRAVITY_STRENGTH: 0.4,     // pull speed toward cursor
  RETURN_STRENGTH: 0.06,     // spring-back speed to base position
  MAX_DISPLACEMENT: 1.2,     // max world units a particle can be pulled
  DEAD_ZONE_RADIUS: 1.0,     // world units around origin — protects text center
} as const;
