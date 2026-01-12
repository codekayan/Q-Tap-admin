import { color, useTheme } from '@mui/system';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: '0px 5px', fontSize: '10px', borderRadius: '5px' }}>
        <p>{`${payload[0].payload.name}: ${payload[0].value / 1000}k`}</p>
      </div>
    );
  }
  return null;
};

const Cart2 = ({ Total_Orders }) => {
  const [allOrders, setAllOrders] = React.useState([]);
  const [displayedOrders, setDisplayedOrders] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const theme = useTheme()
  React.useEffect(() => {
    let isMounted = true; // Flag to prevent setting state if component is unmounted
    const fetchOrders = async () => {
      if (isMounted && Total_Orders) {
        const orderArray = Object.values(Total_Orders);
        setAllOrders(orderArray);
        // Initially show first 6 orders
        setDisplayedOrders(orderArray.slice(0, 6));
      } else if (isMounted) {
        setAllOrders([]);
        setDisplayedOrders([]);
      }
    };
    fetchOrders();
    return () => {
      isMounted = false; // Cleanup to prevent setting state after unmount
    };
  }, [Total_Orders]);

  const handleTogglePage = () => {
    const newPage = page === 0 ? 1 : 0;
    setPage(newPage);
    const startIndex = newPage * 6;
    const endIndex = startIndex + 6;
    setDisplayedOrders(allOrders.slice(startIndex, endIndex));
  };

  const hasMoreOrders = allOrders.length > 6;
  
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ direction: 'ltr' , marginLeft:"-30px"}}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={displayedOrders}
            layout="vertical"
            margin={{ top: 5, end: 10, start: -30, bottom: -10 }}
          >
            <XAxis
              type="number"
              tickFormatter={(tick) => `${tick / 1000}k`}
              tick={{ fontSize: 9, fill: theme.palette.text.gray }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              dataKey="month_name"
              type="category"
              tick={{ fontSize: 10, fill: theme.palette.text.gray }}
              interval={0}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{ fontSize: '10px' }}
              content={<div></div>}
              cursor={{ fill: 'transparent' }}
            />

            <Bar
              dataKey="total_order"
              fill="#000000"
              background={{
                fill: ' #d3d3d3',
                radius: [10, 10, 10, 10]
              }}
              barSize={6.5}
              radius={[10, 10, 10, 10]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {hasMoreOrders && (
        <button
          onClick={handleTogglePage}
          style={{
            position: 'absolute',
            insetInlineEnd: 0,
            top: 0,
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            fontSize: '22px',
            marginTop: "-14px",
            marginRight: "10px",
            border: 'none',
            background: 'transparent',
            color: theme.palette.orangePrimary.main
          }}
          onMouseEnter={(e) => e.target.style.color = theme.palette.chart.orangeLight}
          onMouseLeave={(e) => e.target.style.color = theme.palette.orangePrimary.main}
        >
          {page === 0 ? '>' : '<'}
        </button>
      )}
    </div>
  );
};

export default Cart2;