import type { ToppingId, LilinId } from "@/types/cake";

interface ToppingIconProps {
  topping: ToppingId;
  cx: number;
  cy: number;
  seed: number;
}

export function ToppingIcon({ topping, cx, cy, seed }: ToppingIconProps) {
  if (topping === "freshFruit") {
    return (
      <g style={{ transition: "all .4s" }}>
        <path
          d={`M ${cx - 7} ${cy - 3} q 7 -12 14 0 q -2 12 -7 14 q -5 -2 -7 -14 z`}
          fill="#E0435A"
        />
        <path
          d={`M ${cx - 3} ${cy - 5} l -1 -4 M ${cx} ${cy - 6} l 0 -5 M ${cx + 3} ${cy - 5} l 1 -4`}
          stroke="#3F7A3F"
          strokeWidth={1.3}
          fill="none"
        />
      </g>
    );
  }

  if (topping === "sprinkles") {
    const hues = ["#E85D75", "#5BA3F5", "#F3CE5B", "#8FD16B"];
    return (
      <g style={{ transition: "all .4s" }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + seed;
          const x = cx + Math.cos(angle) * 10;
          const y = cy + Math.sin(angle) * 4;
          return (
            <rect
              key={i}
              x={x - 1.2}
              y={y - 3}
              width={2.4}
              height={6}
              rx={1.2}
              fill={hues[i % hues.length]}
              transform={`rotate(${(angle * 180) / Math.PI} ${x} ${y})`}
            />
          );
        })}
      </g>
    );
  }

  // "random" -> gerombolan titik warna-warni, netral untuk semua tema
  return (
    <g style={{ transition: "all .4s" }}>
      <circle cx={cx} cy={cy} r={4} fill="#E8A0B4" />
      <circle cx={cx + 6} cy={cy + 2} r={3} fill="#F3CE5B" />
      <circle cx={cx - 6} cy={cy + 2} r={3} fill="#8FD16B" />
    </g>
  );
}

interface CandleIconProps {
  lilin: LilinId;
  cx: number;
  cy: number;
  index: number;
  catatan?: string;
}

const GOLD = "#D9A441";
const SILVER = "#B9BEC7";
const RANDOM_COLORS = ["#5BA3F5", "#E85D75", "#8FD16B", "#F3CE5B"];

function charAt(text: string | undefined, index: number, fallback: string) {
  const clean = (text ?? "").trim();
  if (!clean) return fallback;
  return clean[index % clean.length].toUpperCase();
}

export function CandleIcon({ lilin, cx, cy, index, catatan }: CandleIconProps) {
  const flame = (topY: number) => (
    <path d={`M ${cx} ${topY - 6} q 4 5 0 9 q -4 -4 0 -9 z`} fill="#F5A623" />
  );

  // Lilin angka: bentuk digit, warna gold/silver
  if (lilin === "angkaGold" || lilin === "angkaSilver") {
    const color = lilin === "angkaGold" ? GOLD : SILVER;
    const digit = charAt(catatan, index, "1");
    return (
      <g style={{ transition: "all .4s" }}>
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          fontSize={24}
          fontWeight={800}
          fill={color}
          fontFamily="sans-serif"
        >
          {digit}
        </text>
        {flame(cy - 24)}
      </g>
    );
  }

  // Lilin huruf: bentuk huruf, warna gold/silver
  if (lilin === "hurufGold" || lilin === "hurufSilver") {
    const color = lilin === "hurufGold" ? GOLD : SILVER;
    const letter = charAt(catatan, index, "A");
    return (
      <g style={{ transition: "all .4s" }}>
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          fontSize={22}
          fontWeight={800}
          fill={color}
          fontFamily="serif"
        >
          {letter}
        </text>
        {flame(cy - 22)}
      </g>
    );
  }

  // Lilin spiral: bentuk melingkar
  if (lilin === "spiral5") {
    const path = `
      M ${cx} ${cy}
      q 6 -3 0 -6
      q -6 -3 0 -6
      q 6 -3 0 -6
      q -6 -3 0 -6
      q 6 -3 0 -6
    `;
    return (
      <g style={{ transition: "all .4s" }}>
        <path
          d={path}
          stroke={GOLD}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        {flame(cy - 30)}
      </g>
    );
  }

  // "random" -> lilin klasik warna-warni (default lama)
  const color = RANDOM_COLORS[index % RANDOM_COLORS.length];
  return (
    <g style={{ transition: "all .4s" }}>
      <rect x={cx - 2} y={cy - 20} width={4} height={20} rx={2} fill={color} />
      {flame(cy - 20)}
    </g>
  );
}

interface TopperBadgeProps {
  nama: string;
  cx: number;
  cy: number;
}

export function TopperBadge({ nama, cx, cy }: TopperBadgeProps) {
  const label = nama.length > 10 ? `${nama.slice(0, 10)}…` : nama;
  return (
    <g style={{ transition: "all .4s" }}>
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy + 16}
        stroke="#8A7669"
        strokeWidth={1.5}
      />
      <rect
        x={cx - 26}
        y={cy - 14}
        width={52}
        height={18}
        rx={4}
        fill="#5C3A2E"
      />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={9} fill="#FFF7EF">
        {label}
      </text>
    </g>
  );
}

export default { ToppingIcon, CandleIcon, TopperBadge };
