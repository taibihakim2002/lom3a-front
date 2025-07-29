export default function generateParams(params = {}) {
  const now = new Date();
  const finalParams = { ...params };

  // معالجة period إذا كانت موجودة
  if (params.period) {
    let startDate, endDate;

    if (params.period === "today") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
    } else if (params.period === "thisWeek") {
      const day = now.getDay(); // 0 = Sunday
      const diffToMonday = day === 0 ? -6 : 1 - day;

      startDate = new Date(now);
      startDate.setDate(now.getDate() + diffToMonday);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (params.period === "thisMonth") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    } else if (params.period === "all") {
      // لا نضع أي فلاتر تاريخية
      delete finalParams.period;
      return finalParams;
    }

    finalParams.createdAt = {
      gte: startDate.toISOString(),
      lte: endDate.toISOString(),
    };

    // إزالة period من البارامز لأنها فقط داخليّة
    delete finalParams.period;
  }

  return finalParams;
}
