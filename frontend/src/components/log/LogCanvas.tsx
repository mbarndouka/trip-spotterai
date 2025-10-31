import React, { useRef, useEffect, useCallback } from "react";
import {
  LOG_SHEET,
  DUTY_STATUS,
  DUTY_STATUS_COLORS,
} from "../../../utils/constant";
import type { TimelineEvent, DutyStatus } from "../../../types";

interface LogCanvasProps {
  events: TimelineEvent[];
  date: Date;
}

const LogCanvas: React.FC<LogCanvasProps> = ({ events, date }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawLogSheet = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = LOG_SHEET.CANVAS_WIDTH;
    const height = LOG_SHEET.CANVAS_HEIGHT;

    ctx.clearRect(0, 0, width, height);

    const hourWidth = width / LOG_SHEET.HOURS_PER_DAY;
    const statusHeight = height / LOG_SHEET.STATUS_ROWS;

    // Draw vertical grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= LOG_SHEET.HOURS_PER_DAY; i++) {
      const x = i * hourWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      if (i < LOG_SHEET.HOURS_PER_DAY) {
        ctx.fillStyle = "#6b7280";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          i.toString().padStart(2, "0"),
          x + hourWidth / 2,
          height - 5
        );
      }
    }

    // Draw horizontal grid lines
    const statuses: DutyStatus[] = [
      DUTY_STATUS.OFF_DUTY,
      DUTY_STATUS.SLEEPER_BERTH,
      DUTY_STATUS.DRIVING,
      DUTY_STATUS.ON_DUTY,
    ];

    ctx.strokeStyle = "#e5e7eb";
    for (let i = 0; i <= LOG_SHEET.STATUS_ROWS; i++) {
      const y = i * statusHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      if (i < LOG_SHEET.STATUS_ROWS) {
        ctx.fillStyle = "#374151";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(statuses[i], 5, y + statusHeight / 2 + 4);
      }
    }

    // Draw status blocks
    events.forEach((event) => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(
        eventStart.getTime() + event.duration * 3600000
      );

      const startHour = eventStart.getHours() + eventStart.getMinutes() / 60;
      const endHour = Math.min(
        LOG_SHEET.HOURS_PER_DAY,
        eventEnd.getHours() + eventEnd.getMinutes() / 60
      );

      const x = startHour * hourWidth;
      const blockWidth = (endHour - startHour) * hourWidth;

      let statusRow = 0;
      let color = DUTY_STATUS_COLORS[DUTY_STATUS.OFF_DUTY].canvas;

      if (event.status === DUTY_STATUS.SLEEPER_BERTH) {
        statusRow = 1;
        color = DUTY_STATUS_COLORS[DUTY_STATUS.SLEEPER_BERTH].canvas;
      } else if (event.status === DUTY_STATUS.DRIVING) {
        statusRow = 2;
        color = DUTY_STATUS_COLORS[DUTY_STATUS.DRIVING].canvas;
      } else if (event.status === DUTY_STATUS.ON_DUTY) {
        statusRow = 3;
        color = DUTY_STATUS_COLORS[DUTY_STATUS.ON_DUTY].canvas;
      }

      const y = statusRow * statusHeight + 2;
      const blockHeight = statusHeight - 4;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, blockWidth, blockHeight);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, blockWidth, blockHeight);
    });
  }, [events]);

  useEffect(() => {
    if (canvasRef.current && events.length > 0) {
      drawLogSheet();
    }
  }, [events, date, drawLogSheet]);

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        width={LOG_SHEET.CANVAS_WIDTH}
        height={LOG_SHEET.CANVAS_HEIGHT}
        className="w-full"
      />
    </div>
  );
};

export default LogCanvas;
