import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";

export const CamCard = ({
  title,
  count,
  color,
  description,
  onReset,
}: {
  title: string;
  count: number;
  color: string;
  description: string;
  onReset?: () => void;
}) => {
  return (
    <Card className="bg-[#113a5c] border-[#80d4ff] text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-[#80d4ff]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-y-2 py-6 items-center justify-center rounded-xl border-2 border-[#80d4ff] bg-[#0a2a43]">
          <CircleCheck className="h-8 w-8 text-[#80d4ff]" />
          <p className="text-[#80d4ff]">Camera Feed</p>
        </div>

        <div className="rounded-xl bg-[#0a2a43] p-3 text-center">
          <div className="mb-1 text-3xl font-bold" style={{ color }}>
            {count}
          </div>
          <div className="text-sm text-[#b0d8ff] mb-2">{description}</div>

          {onReset && (
            <Button onClick={onReset} className="w-full mb-2" variant={"main"}>
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
