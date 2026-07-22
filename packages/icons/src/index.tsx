import type { SVGAttributes } from "react";
import { ICON_PATHS, ICON_NAMES, type IconName } from "./generated/icons";

export { ICON_NAMES };
export type { IconName };

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: IconName;
  /** Rendered square size in px. Defaults to 16 (dense operational UI). */
  size?: number;
  /** Accessible label. Omit for purely decorative icons (aria-hidden). */
  label?: string;
}

/**
 * Shamrock line icon. 24×24 grid, currentColor, 1.5px stroke.
 * Color comes from the surrounding text color — never set fills directly.
 */
export function Icon({ name, size = 16, label, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
      {...rest}
    />
  );
}
