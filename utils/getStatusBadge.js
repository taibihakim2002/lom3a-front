import { Badge } from "@/components/ui/badge";

export default function getStatusBadge(status) {
  switch (status) {
    case "in-repair":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 border-yellow-300"
        >
          قيد الإصلاح
        </Badge>
      );
    case "repaired":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-300"
        >
          جاهز للتسليم
        </Badge>
      );
    case "delivered":
      return <Badge variant="secondary">تم التسليم</Badge>;
    case "received":
    default:
      return <Badge>تم الاستلام</Badge>;
  }
}
