import React, { useRef, useEffect, useCallback } from "react";
import {
  LOG_SHEET,
  DUTY_STATUS,
  DUTY_STATUS_COLORS,
} from "../../../utils/constant";
import type { TimelineEvent } from "../../../types";

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

    // Set canvas to high DPI for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const hourWidth = width / LOG_SHEET.HOURS_PER_DAY;
    const statusHeight = height / LOG_SHEET.STATUS_ROWS;

    // Background
    ctx.fillStyle = "#f9fafb";
    ctx.fillRect(0, 0, width, height);

    // Draw vertical grid lines (hours)
    for (let i = 0; i <= LOG_SHEET.HOURS_PER_DAY; i++) {
      const x = i * hourWidth;

      // Lighter lines for each hour
      ctx.strokeStyle = i % 6 === 0 ? "#d1d5db" : "#e5e7eb";
      ctx.lineWidth = i % 6 === 0 ? 1.5 : 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height - 30);
      ctx.stroke();

      // Hour labels at the bottom
      if (i < LOG_SHEET.HOURS_PER_DAY) {
        ctx.fillStyle = i % 6 === 0 ? "#374151" : "#6b7280";
        ctx.font =
          i % 6 === 0
            ? "bold 11px Inter, sans-serif"
            : "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          i.toString().padStart(2, "0") + ":00",
          x + hourWidth / 2,
          height - 10
        );
      }
    }

    // Draw horizontal grid lines and labels
    const statusLabels = ["OFF DUTY", "SLEEPER", "DRIVING", "ON DUTY"];

    for (let i = 0; i <= LOG_SHEET.STATUS_ROWS; i++) {
      const y = i * statusHeight;

      // Horizontal lines
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Status labels with background
      if (i < LOG_SHEET.STATUS_ROWS) {
        const labelY = y + statusHeight / 2;

        // Label background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(5, labelY - 10, 90, 20);

        // Label text
        ctx.fillStyle = "#1f2937";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(statusLabels[i], 10, labelY);
      }
    }

    // Sort events by start time to ensure proper rendering order
    const sortedEvents = [...events].sort((a, b) => {
      const timeA = new Date(a.start_time).getTime();
      const timeB = new Date(b.start_time).getTime();
      return timeA - timeB;
    });

    // Draw status blocks with clean separation
    sortedEvents.forEach((event, index) => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(
        eventStart.getTime() + event.duration * 3600000
      );

      const startHour = eventStart.getHours() + eventStart.getMinutes() / 60;
      const endHour = Math.min(
        LOG_SHEET.HOURS_PER_DAY,
        eventEnd.getHours() + eventEnd.getMinutes() / 60
      );

      // Calculate exact pixel positions to prevent overlaps
      const x = Math.round(startHour * hourWidth);
      const blockWidth = Math.round((endHour - startHour) * hourWidth);

      let statusRow = 0;
      let color = DUTY_STATUS_COLORS[DUTY_STATUS.OFF_DUTY].canvas;
      let borderColor = "#6b7280";

      if (event.status === DUTY_STATUS.SLEEPER_BERTH) {
        statusRow = 1;
        color = DUTY_STATUS_COLORS[DUTY_STATUS.SLEEPER_BERTH].canvas;
        borderColor = "#2563eb";
      } else if (event.status === DUTY_STATUS.DRIVING) {
        statusRow = 2;
        color = DUTY_STATUS_COLORS[DUTY_STATUS.DRIVING].canvas;
        borderColor = "#059669";
      } else if (event.status === DUTY_STATUS.ON_DUTY) {
        statusRow = 3;
        color = DUTY_STATUS_COLORS[DUTY_STATUS.ON_DUTY].canvas;
        borderColor = "#d97706";
      }

      const y = statusRow * statusHeight + 4;
      const blockHeight = statusHeight - 8;

      // Draw shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(x + 2, y + 2, blockWidth, blockHeight);

      // Draw main block with gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + blockHeight);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + "dd");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, blockWidth, blockHeight);

      // Draw border
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, blockWidth, blockHeight);

      // Draw duration text if block is wide enough
      if (blockWidth > 40) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Add text shadow for better readability
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillText(
          `${event.duration}h`,
          x + blockWidth / 2,
          y + blockHeight / 2
        );

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // Draw start time marker
      if (index === 0 || sortedEvents[index - 1].status !== event.status) {
        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.arc(x, y + blockHeight / 2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Start time label
        ctx.fillStyle = "#1f2937";
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          eventStart.getHours().toString().padStart(2, "0") +
            ":" +
            eventStart.getMinutes().toString().padStart(2, "0"),
          x,
          y - 8
        );
      }
    });

    // Draw legend box
    const legendX = width - 160;
    const legendY = 10;
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.fillRect(legendX, legendY, 150, 90);
    ctx.strokeRect(legendX, legendY, 150, 90);

    // Legend title
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Legend", legendX + 10, legendY + 15);

    // Legend items
    const legendItems = [
      {
        label: "Off Duty",
        color: DUTY_STATUS_COLORS[DUTY_STATUS.OFF_DUTY].canvas,
      },
      {
        label: "Sleeper",
        color: DUTY_STATUS_COLORS[DUTY_STATUS.SLEEPER_BERTH].canvas,
      },
      {
        label: "Driving",
        color: DUTY_STATUS_COLORS[DUTY_STATUS.DRIVING].canvas,
      },
      {
        label: "On Duty",
        color: DUTY_STATUS_COLORS[DUTY_STATUS.ON_DUTY].canvas,
      },
    ];

    legendItems.forEach((item, i) => {
      const itemY = legendY + 30 + i * 15;
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX + 10, itemY - 5, 15, 10);
      ctx.strokeStyle = "#9ca3af";
      ctx.strokeRect(legendX + 10, itemY - 5, 15, 10);

      ctx.fillStyle = "#4b5563";
      ctx.font = "10px Inter, sans-serif";
      ctx.fillText(item.label, legendX + 30, itemY + 2);
    });
  }, [events]);

  useEffect(() => {
    if (canvasRef.current && events.length > 0) {
      drawLogSheet();
    }
  }, [events, date, drawLogSheet]);

  return (
    <div className="border-4 border-indigo-100 rounded-xl overflow-hidden bg-white shadow-lg mb-6">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "auto" }}
        className="block"
      />
    </div>
  );
};

export default LogCanvas;
