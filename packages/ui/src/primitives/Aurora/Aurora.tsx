import styles from "./Aurora.module.css";

/**
 * The canonical page backdrop: blurred color orbs behind glass surfaces.
 * Mount once, first child of <body> (or the app root). Orbs pick up the active
 * theme's accent, so the atmosphere re-tints with `data-theme`.
 */
export function Aurora() {
  return (
    <div className={styles.aurora} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orbAccent}`} />
      <div className={`${styles.orb} ${styles.orbInfo}`} />
      <div className={`${styles.orb} ${styles.orbWarm}`} />
    </div>
  );
}
