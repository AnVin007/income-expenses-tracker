import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  plugins,
} from "chart.js";
import { Doughnut } from "react-chartjs-2"; //! Doghnut like a pie chart to plot
import { listTransactionAPI } from "../../services/transactions/transactionService";
import { useQuery } from "@tanstack/react-query";

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionChart = () => {
  //* ==========> CONFIGURE QUERY (React Query)
  //* Fetching Transaction data!
  // Destructure useQuery to use some specific components:
  const {
    data: transactionsData,
    isLoading,
    isError,
    error,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: listTransactionAPI,
    queryKey: ["list-transaction"],
  });

  //! ==========> CALCULATE TOTAL INCOME AND EXPENSE
  //method to reduce array to a single value.
  //first argument is a callback function that calculate amount
  //second argument is an initializer that set initial values as 0
  const totals = transactionsData?.reduce(
    (accumulated, transaction) => {
      if (transaction?.type === "income") {
        accumulated.income += transaction?.amount;
      } else {
        accumulated.expense += transaction?.amount;
      }
      return accumulated;
    },
    { income: 0, expense: 0 }
  );

  console.log("Test");
  console.log(totals);

  //* ==========> CHART DATA STRUCTURE CONFIGURATION
  //! create data and options for the <Doughnut/> component
  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Transactions",
        data: [totals?.income, totals?.expense],
        backgroundColor: ["#36A2EB", "#FF6384"],
        borderColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 25,
          boxWidth: 12,
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Income vs Expense",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    cutout: "70%",
  };

  //* ==========> RETURN HTML COMPONENT
  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h1 className="text-2xl font-bold text-center mb-6">
        Transaction Overview
      </h1>
      <div style={{ height: "350px" }}>
        {/* from chart configuration above -> pass props */}
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default TransactionChart;
