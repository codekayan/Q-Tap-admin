import React from 'react'
import { ResponsiveLine } from '@nivo/line';
import { data } from './LineChartData';
import { Box } from '@mui/system';

export const LineChart = () => {
    return (
        <Box sx={{ height: "200px" }}> 

    <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 110, bottom: 60, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 12,
            tickPadding: 9,
            tickRotation: 0,
            legend: '',
            legendOffset: 60,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 16,
            tickPadding: 5,
            tickRotation: -2,
            legend: ' ',
            legendOffset: -47,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        enableGridY={false}
        colors={{scheme: 'nivo' }}
        pointSize={4}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={8}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        areaBaselineValue={20}
        areaOpacity={0.1}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
            {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 121,
                translateY: 1,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 26,
                itemOpacity: 0.75,
                symbolSize: 19,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
        </Box>
    )
}



