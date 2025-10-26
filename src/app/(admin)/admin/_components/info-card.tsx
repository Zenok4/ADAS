import { IconType } from "react-icons";

interface InfoCardProps {
  icon: IconType;
  label: string;
  value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-2">
    <Icon className="text-gray-600 text-lg" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default InfoCard;
