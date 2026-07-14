import { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrderStore, type PenilaianDetail } from "@/app/store/useOrderStore";

interface PenilaianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  productTitle: string;
  existing?: PenilaianDetail;
}

const PenilaianModal = ({
  open,
  onOpenChange,
  orderId,
  productTitle,
  existing,
}: PenilaianModalProps) => {
  const submitPenilaian = useOrderStore((s) => s.submitPenilaian);
  const isReadOnly = !!existing;

  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(existing?.review ?? "");

  const handleSubmit = () => {
    if (rating === 0) return;
    submitPenilaian(orderId, { rating, review });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isReadOnly ? "Penilaian Kamu" : "Beri Penilaian"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <p className="text-sm text-gray-500 truncate">{productTitle}</p>

          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={isReadOnly}
                onClick={() => setRating(star)}
                onMouseEnter={() => !isReadOnly && setHoverRating(star)}
                onMouseLeave={() => !isReadOnly && setHoverRating(0)}
                className={isReadOnly ? "cursor-default" : "cursor-pointer"}
              >
                <Star
                  size={32}
                  className={
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Ceritain pengalaman kamu sama produk ini..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            readOnly={isReadOnly}
            className="min-h-24 resize-none"
          />
        </div>

        {!isReadOnly && (
          <DialogFooter>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-primary text-white cursor-pointer"
              disabled={rating === 0}
              onClick={handleSubmit}
            >
              Kirim Penilaian
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PenilaianModal;
