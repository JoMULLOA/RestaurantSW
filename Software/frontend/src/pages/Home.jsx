import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getPedidosHistory } from "@services/pedidoHistory.service.js";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';
import '@styles/home.css';

// Registrar los elementos de Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Title);

const Home = () => {
  const user = JSON.parse(sessionStorage.getItem('usuario')) || ''; // Obtén el usuario desde sessionStorage
  const userRole = user?.rol; // Obtén el rol del usuario
  const [revenue, setRevenue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [monthlyData, setMonthlyData] = useState([]); // Datos para el segundo gráfico

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidosHistory();

        // Cálculo de la recaudación diaria
        const total = data.data
          .filter(pedido => pedido.fecha.startsWith(selectedDate))
          .reduce((acc, pedido) => acc + pedido.total, 0);
        setRevenue(total);

        // Cálculo de las ganancias diarias en el mes
        const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
        const dailyTotals = {};
        data.data.forEach(pedido => {
          if (pedido.fecha.startsWith(currentMonth)) {
            const day = pedido.fecha.slice(0, 10); // "YYYY-MM-DD"
            dailyTotals[day] = (dailyTotals[day] || 0) + pedido.total;
          }
        });
        const dailyData = Object.entries(dailyTotals).map(([day, total]) => ({
          day,
          total,
        }));
        setMonthlyData(dailyData);
      } catch (error) {
        console.error("Error fetching pedidos:", error);
      }
    };

    fetchPedidos();
  }, [selectedDate]);

  const chartData = {
    labels: ["Recaudado"],
    datasets: [
      {
        label: `Total (${selectedDate})`,
        data: [revenue],
        backgroundColor: ["rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyData.map(data => data.day), // Fechas del mes
    datasets: [
      {
        label: "Ganancias diarias (Mes actual)",
        data: monthlyData.map(data => data.total), // Ganancias diarias
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
<h1 className="title" style={{ marginBottom: "50px", marginLeft: "-20px" }}>
  🛎️ Software cocinería 🍽️
</h1>

      {userRole === "administrador" ? ( // Verifica si el rol del usuario es administrador
        <>
          {/* Selector de Fecha */}
          <div style={{ margin: "20px auto", textAlign: "center" }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: "100px" }}
            />
          </div>

          {/* Gráfico diario */}
          <div className="chart-container" style={{ width: "50%", margin: "20px auto" }}>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          {/* Gráfico mensual */}
          <div className="chart-container" style={{ width: "50%", margin: "20px auto" }}>
            <Bar data={monthlyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>
          <img src="https://dgce.ubiobio.cl/img/descargas/escudo/d/escudo-color-gradiente.png" alt="Descripción de la imagen" className="home-image" />
        </p>
      )}
    </div>
  );
};

export default Home;
