interface MBMeterProps {
  minutesBack: number;
}

export default function MBMeter({ minutesBack }: MBMeterProps) {
  const hours = Math.floor(minutesBack / 60);
  const minutes = minutesBack % 60;

  return (
    <div className="mb-meter text-center">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        今日の Minutes-Back
      </h3>
      <div className="text-3xl font-bold text-green-700">
        {hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`}
      </div>
      <p className="text-sm text-green-600 mt-1">
        取り戻した時間
      </p>
    </div>
  );
}
