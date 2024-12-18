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
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 7)); // Fecha inicial (mes actual)
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 7)); // Fecha final (mes actual)
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados para el segundo gráfico

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidosHistory();

        // Cálculo de la recaudación diaria para la fecha seleccionada
        const total = data.data
          .filter(pedido => pedido.fecha.startsWith(selectedDate))
          .reduce((acc, pedido) => acc + pedido.total, 0);
        setRevenue(total);

        // Filtrar datos por rango de tiempo
        const filtered = data.data.filter(pedido => {
          const pedidoMonth = pedido.fecha.slice(0, 7); // Obtener "YYYY-MM"
          return pedidoMonth >= startDate && pedidoMonth <= endDate;
        });

        const dailyTotals = {};
        filtered.forEach(pedido => {
          const day = pedido.fecha.slice(0, 10); // "YYYY-MM-DD"
          dailyTotals[day] = (dailyTotals[day] || 0) + pedido.total;
        });

        const dailyData = Object.entries(dailyTotals).map(([day, total]) => ({
          day,
          total,
        }));
        setFilteredData(dailyData);
      } catch (error) {
        console.error("Error fetching pedidos:", error);
      }
    };

    fetchPedidos();
  }, [selectedDate, startDate, endDate]);

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

  const intervalChartData = {
    labels: filteredData.map(data => data.day), // Fechas dentro del intervalo
    datasets: [
      {
        label: `Ganancias diarias (${startDate} a ${endDate})`,
        data: filteredData.map(data => data.total), // Totales diarios
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1 className="title" style={{ marginTop: "90px", marginLeft: "-20px" }}>
        🛎️ Software cocinería 🍽️
      </h1>


      {userRole === "administrador" ? (
        
        <>
          <h2  style={{ marginLeft: "300px" }}>
            Panel del administrador
          </h2>
          {/* Selector de Fecha */}
          <div style={{ margin: "20px auto", textAlign: "center" }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: "150px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
          />
        </div>

          {/* Gráfico diario */}
          <div className="chart-container" style={{ width: "50%", margin: "20px auto" }}>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          {/* Selector de Intervalo */}
          <div style={{ margin: "20px auto", textAlign: "center" }}>
            <label>
              Inicio: 
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: "150px",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginRight: "20px",
                  marginLeft: "20px"
                }}
              />
            </label>
            <label>
              Fin: 
              <input
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: "150px",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginLeft: "20px"
                }}
              />
            </label>
          </div>

          {/* Gráfico por intervalo */}
          <div className="chart-container" style={{ width: "50%", margin: "20px auto" }}>
            <Bar data={intervalChartData} options={{ responsive: true, maintainAspectRatio: false }} />
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
