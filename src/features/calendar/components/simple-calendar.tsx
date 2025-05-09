"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  getDay,
  addDays,
} from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Schedule } from "@/types/schedule";

interface SimpleCalendarProps {
  schedules?: Schedule[];
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export const SimpleCalendar = ({
  schedules = [],
  onDateSelect,
  className,
}: SimpleCalendarProps) => {
  const [date, setDate] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<"day" | "week" | "month">("month");

  const handleDateSelect = (newDate: Date) => {
    setDate(newDate);
    onDateSelect?.(newDate);
  };

  const renderDayView = () => {
    return (
      <Card className="p-4 h-full">
        <div className="text-lg font-semibold mb-4">
          {format(date, "EEEE, MMMM d, yyyy")}
        </div>
        <div className="space-y-2">
          {schedules
            .filter((schedule) =>
              schedule.dailySchedules.some((daily) =>
                isSameDay(new Date(daily.start), date)
              )
            )
            .map((schedule) => (
              <div key={schedule.id} className="p-2 bg-primary/10 rounded-md">
                {schedule.dailySchedules
                  .filter((daily) => isSameDay(new Date(daily.start), date))
                  .map((daily) => (
                    <div key={daily.day} className="text-sm">
                      {format(new Date(daily.start), "h:mm a")} -{" "}
                      {format(new Date(daily.end), "h:mm a")}
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </Card>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <Card className="p-4 h-full">
        <div className="text-lg font-semibold mb-4">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </div>
        <div className="grid grid-cols-7 gap-2 h-[calc(100%-4rem)]">
          {days.map((day) => (
            <div
              key={day.toString()}
              className={`p-2 border rounded-md ${
                isSameDay(day, date) ? "bg-primary/10" : ""
              }`}
            >
              <div className="font-medium mb-2">{format(day, "EEE")}</div>
              <div className="text-sm space-y-1">
                {schedules
                  .filter((schedule) =>
                    schedule.dailySchedules.some((daily) =>
                      isSameDay(new Date(daily.start), day)
                    )
                  )
                  .map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-1 bg-primary/5 rounded text-xs"
                    >
                      {schedule.dailySchedules
                        .filter((daily) =>
                          isSameDay(new Date(daily.start), day)
                        )
                        .map((daily) => (
                          <div key={daily.day}>
                            {format(new Date(daily.start), "h:mm a")}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <Card className="p-4 h-full w-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDate(subMonths(date, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold">
            {format(date, "MMMM yyyy")}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDate(addMonths(date, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 flex-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {days.map((day) => {
            const isCurrentMonth = day.getMonth() === date.getMonth();
            const hasSchedule = schedules.some((schedule) =>
              schedule.dailySchedules.some((daily) =>
                isSameDay(new Date(daily.start), day)
              )
            );

            return (
              <div
                key={day.toString()}
                onClick={() => handleDateSelect(day)}
                className={`
                  p-2 border rounded-md min-h-[100px] cursor-pointer
                  ${!isCurrentMonth ? "opacity-50" : ""}
                  ${isSameDay(day, date) ? "bg-primary/10" : ""}
                  ${hasSchedule ? "bg-primary/5" : ""}
                  hover:bg-accent/50 transition-colors
                `}
              >
                <div className="font-medium mb-1">{format(day, "d")}</div>
                <div className="text-xs space-y-1">
                  {schedules
                    .filter((schedule) =>
                      schedule.dailySchedules.some((daily) =>
                        isSameDay(new Date(daily.start), day)
                      )
                    )
                    .map((schedule) => (
                      <div
                        key={schedule.id}
                        className="p-1 bg-primary/10 rounded truncate"
                      >
                        {schedule.dailySchedules
                          .filter((daily) =>
                            isSameDay(new Date(daily.start), day)
                          )
                          .map((daily) => (
                            <div key={daily.day} className="truncate">
                              {format(new Date(daily.start), "h:mm a")}
                            </div>
                          ))}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className={`flex flex-col h-full w-full ${className}`}>
      <Tabs
        defaultValue="month"
        onValueChange={(value) => setView(value as any)}
        className="flex flex-col h-full"
      >
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
        <TabsContent value="day" className="flex-1 mt-4">
          {renderDayView()}
        </TabsContent>
        <TabsContent value="week" className="flex-1 mt-4">
          {renderWeekView()}
        </TabsContent>
        <TabsContent value="month" className="flex-1 mt-4">
          {renderMonthView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
