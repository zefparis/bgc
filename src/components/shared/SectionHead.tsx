interface SectionHeadProps {
  kicker: string;
  title: string;
  description?: string;
  /** e.g. "margin-bottom:26px" — inline style string is converted to style prop */
  style?: React.CSSProperties;
  /** Whether the block animates in on scroll (default: true) */
  reveal?: boolean;
}

export function SectionHead({ kicker, title, description, style, reveal = true }: SectionHeadProps) {
  return (
    <div className={`section-head${reveal ? ' reveal' : ''}`} style={style}>
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
