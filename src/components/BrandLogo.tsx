import livraLogo from "@/assets/livra-logo.png";
import livraSymbol from "@/assets/livra-symbol.png";

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
  eager?: boolean;
}

const BrandLogo = ({ compact = false, className = "", eager = false }: BrandLogoProps) => (
  <img
    src={compact ? livraSymbol : livraLogo}
    alt="LIVRA"
    className={`block object-contain ${className}`}
    loading={eager ? "eager" : "lazy"}
    width={compact ? 305 : 1192}
    height={compact ? 305 : 316}
  />
);

export default BrandLogo;