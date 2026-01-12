
const financialData = [
    {
        id: 1,
        icon: <img src="/assets/revenue.svg" alt="icon" style={{ width: "26px", height: "26px" }} />,
        percentage: "+10%",
        direction: "up",
        label: "Revenue",
        amount: "0.00",
        description: "Current Financial Year",
        iconColor: "#73CB3C",
    },
    {
        id: 2,
        icon: <img src="/assets/withd.svg" alt="icon" style={{ width: "26px", height: "26px" }} />,
        percentage: "-20%",
        direction: "down",
        label: "Withdrawals",
        amount: "0.00",
        description: "Current Financial Year",
        iconColor: "red",
    },
    {
        id: 3,
        icon: <img src="/assets/balance.svg" alt="icon" style={{ width: "26px", height: "26px" }} />,
        percentage: "",
        direction: "",
        label: "Balance",
        amount: "0.00",
        description: "Current Financial Year",
        iconColor: "orange",
    }
];

export default financialData;
