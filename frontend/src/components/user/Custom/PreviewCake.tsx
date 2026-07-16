import { forwardRef } from "react";
import { WARNA_CREAM_OPTIONS } from "@/data/cake/cakeOption";
import { getScatterPositions, getTierGeometry } from "@/data/cake/geometryCake";
import type { CakeCustomizationState } from "@/types/cake";
import { CandleIcon, TopperBadge, ToppingIcon } from "./ToppingIcons";

interface PreviewCakeProps {
  state: CakeCustomizationState;
}

const DEFAULT_COLOR = { base: "#F3A6C0", drip: "#F9D3E1" };

const PreviewCake = forwardRef<HTMLDivElement, PreviewCakeProps>(
  ({ state }, ref) => {
    const { layer, warnaCream, dekorasi, referensi, previewSummary } = state;

    const layerCount = layer ?? 1;
    const color =
      WARNA_CREAM_OPTIONS.find((c) => c.id === warnaCream) ?? DEFAULT_COLOR;

    const tiers = getTierGeometry(layerCount);
    const topTier = tiers[tiers.length - 1];

    const toppingPositions = getScatterPositions(3, topTier.width, topTier.y);
    const candleCount = Math.min(dekorasi.lilinJumlah || 1, 7);
    const candlePositions = getScatterPositions(
      candleCount,
      topTier.width * 0.7,
      topTier.y - 4,
    );

    return (
      // ref WAJIB ditaruh di sini, di div yang membungkus <svg>
      <div ref={ref} className="rounded-2xl bg-white shadow-sm border p-4">
        <h3 className="font-medium text-sm mb-3">Preview Cake</h3>

        <svg viewBox="0 0 300 280" className="w-full h-56">
          <ellipse cx={150} cy={256} rx={105} ry={12} fill="#EFE4D6" />
          <ellipse
            cx={150}
            cy={252}
            rx={105}
            ry={12}
            fill="#FDFBF7"
            stroke="#F0E4D3"
            strokeWidth={1}
          />

          {tiers.map((t, i) => (
            <g key={i}>
              <rect
                x={150 - t.width / 2}
                y={t.y}
                width={t.width}
                height={t.height}
                rx={10}
                fill={color.base}
                style={{ transition: "all .45s cubic-bezier(.4,0,.2,1)" }}
              />
              <path
                d={`M ${150 - t.width / 2} ${t.y + 10}
                    q ${t.width * 0.12} 14 ${t.width * 0.25} 0
                    q ${t.width * 0.12} 14 ${t.width * 0.25} 0
                    q ${t.width * 0.12} 14 ${t.width * 0.25} 0
                    q ${t.width * 0.12} 14 ${t.width * 0.25} 0
                    L ${150 + t.width / 2} ${t.y}
                    L ${150 - t.width / 2} ${t.y} Z`}
                fill={color.drip}
                style={{ transition: "all .45s cubic-bezier(.4,0,.2,1)" }}
              />
            </g>
          ))}

          {toppingPositions.map((p, i) => (
            <ToppingIcon
              key={i}
              topping={dekorasi.topping}
              cx={p.x}
              cy={p.y}
              seed={i}
            />
          ))}

          {candlePositions.map((p, i) => (
            <CandleIcon
              key={i}
              lilin={dekorasi.lilin}
              cx={p.x}
              cy={p.y}
              index={i}
              catatan={dekorasi.lilinCatatan}
            />
          ))}

          {dekorasi.topperAktif && dekorasi.topperNama && (
            <TopperBadge
              nama={dekorasi.topperNama}
              cx={150}
              cy={topTier.y - 26}
            />
          )}
        </svg>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs px-3 py-1 rounded-full border">
            {previewSummary.layerLabel}
          </span>
          <span className="text-xs px-3 py-1 rounded-full border">
            {previewSummary.baseCakeLabel}
          </span>
          <span className="text-xs px-3 py-1 rounded-full border">
            {previewSummary.tipeCreamLabel}
          </span>
          <span className="text-xs px-3 py-1 rounded-full border bg-primary text-white">
            {previewSummary.warnaCreamLabel}
          </span>
        </div>

        {referensi.url && (
          <div className="mt-3 rounded-xl overflow-hidden border relative">
            <span className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-1 rounded-full">
              Referensi Cake
            </span>
            <img
              src={referensi.url}
              alt="Referensi cake"
              className="w-full h-40 object-cover"
            />
          </div>
        )}
      </div>
    );
  },
);

PreviewCake.displayName = "PreviewCake";

export default PreviewCake;
