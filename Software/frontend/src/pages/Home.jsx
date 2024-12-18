import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getPedidosHistory } from "@services/pedidoHistory.service.js";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';
import '@styles/home.css';

// Registrar los elementos de Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Title);

const Home = () => {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidosHistory();
        const today = new Date().toISOString().split("T")[0];
        const totalToday = data.data
          .filter(pedido => pedido.fecha.startsWith(today))
          .reduce((acc, pedido) => acc + pedido.total, 0);
        setRevenue(totalToday);
      } catch (error) {
        console.error("Error fetching pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

  const chartData = {
    labels: ["Hoy"],
    datasets: [
      {
        label: "Total Recaudado",
        data: [revenue],
        backgroundColor: ["rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <h1 className="title" style={{ marginLeft: "-20px" }}>
        🛎️ Software cocinería 🍽️
      </h1>
      {/* <img
        src="https://dgce.ubiobio.cl/img/descargas/escudo/d/escudo-color-gradiente.png"
        alt="Descripción de la imagen"
        className="home-image"
      /> */}
      <div style={{ width: "50%", margin: "20px auto" }}>
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </>
  );
};

export default Home;
