import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {EChartsOption} from "echarts";

type BaseChartProps ={
    options: EChartsOption
};

const Charts: React.FC<BaseChartProps> = ({ options }) => {

    const chartRef = useRef<HTMLInputElement>(null);
    const [chart, setChart] = useState<echarts.ECharts>();

    const handleResize = () => {
        chart?.resize();
    };

    const initChart = () => {
        if (chart) {
            window.removeEventListener("resize", handleResize);
            chart?.dispose();
        }

        const newChart = echarts?.init(chartRef?.current as HTMLElement);
        newChart.setOption(options, true);
        window.addEventListener("resize", handleResize);
        setChart(newChart);
    };

    useEffect(() => {
        initChart();
    }, [options])

    return <div ref={chartRef} style={{ height: "500px", width: "100%" }} />
};

export default Charts;