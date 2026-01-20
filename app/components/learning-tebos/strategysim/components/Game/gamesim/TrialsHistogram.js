import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ReactEcharts from "echarts-for-react";

const MIN_SCORE = 0;
const MAX_SCORE = 12;
const MAX_TRIALS = 40;

const TrialsHistogram = ({ trialsLog }) => {
  // Build score frequency for scores 3–18
  const histogramData = useMemo(() => {
    // Initialize counts for each score
    const scoreCounts = Array(MAX_SCORE - MIN_SCORE + 1).fill(0);
    if (trialsLog && trialsLog.length > 0) {
      trialsLog.forEach((trial) => {
        const score = trial.score;
        if (
          score !== null &&
          score !== undefined &&
          score >= MIN_SCORE &&
          score <= MAX_SCORE
        ) {
          scoreCounts[score - MIN_SCORE]++;
        }
      });
    }
    // Cap counts at MAX_TRIALS for display
    const cappedCounts = scoreCounts.map((count) =>
      Math.min(count, MAX_TRIALS),
    );
    // X-axis labels: scores 3–18
    const scoreLabels = Array.from(
      { length: MAX_SCORE - MIN_SCORE + 1 },
      (_, i) => (MIN_SCORE + i).toString(),
    );
    return {
      buckets: scoreLabels,
      data: cappedCounts,
      originalData: scoreCounts,
      totalTrials: trialsLog ? trialsLog.length : 0,
    };
  }, [trialsLog]);

  // ECharts option configuration
  const option = useMemo(() => {
    const { buckets, data, originalData, totalTrials } = histogramData;
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params) {
          const param = params[0];
          const originalCount = originalData[param.dataIndex];
          const displayCount = param.value;
          const percentage =
            totalTrials > 0
              ? ((originalCount / totalTrials) * 100).toFixed(1)
              : "0";
          let tooltipText = `Score: ${param.axisValue}<br/>Trials: ${originalCount}`;
          if (originalCount > MAX_TRIALS) {
            tooltipText += ` (capped at ${displayCount})`;
          }
          tooltipText += ` (${percentage}%)`;
          return tooltipText;
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        bottom: "15%",
        top: "20%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: buckets,
        axisLabel: {
          fontSize: 9,
          rotate: 0,
          interval: 0,
        },
        name: "Score",
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: MAX_TRIALS,
        interval: 5,
        axisLabel: {
          fontSize: 9,
        },
        name: "Number of Trials",
        nameTextStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
      },
      series: [
        {
          name: "Trials",
          type: "bar",
          data: data,
          itemStyle: {
            color: "#007bff",
            borderColor: "#0056b3",
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              color: "#0056b3",
            },
          },
        },
      ],
    };
  }, [histogramData]);

  // Show placeholder if no data
  if (!trialsLog || trialsLog.length === 0) {
    return (
      <div
        style={{
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          fontStyle: "italic",
          fontSize: "12px",
        }}
      >
        Complete some trials to see the score histogram...
      </div>
    );
  }

  if (!option) {
    return (
      <div
        style={{
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          fontStyle: "italic",
          fontSize: "12px",
        }}
      >
        Loading histogram...
      </div>
    );
  }

  return (
    <div style={{ flex: "1", width: "100%", height: "100%" }}>
      <ReactEcharts
        option={option}
        style={{
          height: "100%",
          width: "100%",
        }}
        notMerge={true}
      />
    </div>
  );
};

TrialsHistogram.propTypes = {
  trialsLog: PropTypes.arrayOf(
    PropTypes.shape({
      trialNumber: PropTypes.number.isRequired,
      totalDuration: PropTypes.number.isRequired,
      events: PropTypes.array.isRequired,
      errorCount: PropTypes.number.isRequired,
      score: PropTypes.number, // Add score prop
    }),
  ).isRequired,
};

export default TrialsHistogram;
