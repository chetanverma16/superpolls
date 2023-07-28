import { Views, Vote } from "@prisma/client";
import { format } from "date-fns";

export default function generateChartData(views: Views[], votes: Vote[]) {
  const chartData = [];
  const today = new Date();
  const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);

  // Create a date range for the last 10 days
  const dateRange = [];
  let currentDate = new Date(tenDaysAgo);
  while (currentDate <= today) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Iterate through the date range and find views and votes for each date
  for (const date of dateRange) {
    const formattedDate = date.toISOString().slice(0, 10); // Get date in 'YYYY-MM-DD' format
    const viewsForDate = views.filter(
      (view: any) =>
        view.createdAt.toISOString().slice(0, 10) === formattedDate,
    ).length;
    const votesForDate = votes.filter(
      (vote: any) =>
        vote.createdAt.toISOString().slice(0, 10) === formattedDate,
    ).length;
    chartData.push({
      date: format(new Date(formattedDate), "MMM d"),
      views: viewsForDate,
      votes: votesForDate,
    });
  }

  return chartData;
}
