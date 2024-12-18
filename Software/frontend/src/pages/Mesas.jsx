import { useState, useEffect } from "react";
import "@styles/mesas.css";
import { obtenerMesas, liberarMesa, agregarMesa, eliminarMesa } from "@services/mesa.service.js";
import { reservarMesa, obtenerReservas, cancelarReserva } from "@services/reserva.service.js";
import { getGarzonesService } from "@services/user.service.js";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Mesas() {
  // ---------------------- ESTADOS -------------------------------------------
  const [mesas, setMesas] = useState([]);
  const [garzones, setGarzones] = useState([]);
  const [reservas, setReservas] = useState([]);

  const [filtroReservas, setFiltroReservas] = useState("");
  const [filtroMesas, setFiltroMesas] = useState("Todas");
  const [mensaje, setMensaje] = useState("");
  const [mensajeError, setMensajeError] = useState(false);
  const [garzonSeleccionado, setGarzonSeleccionado] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [showReservasList, setShowReservasList] = useState(false);
  const [mesaEliminar, setMesaEliminar] = useState(null);
  const [mesaReservar, setMesaReservar] = useState(null);
  const [horaActual, setHoraActual] = useState("");
  const [reservaDetalles, setReservaDetalles] = useState({
    fechaInicio: "",
    fechaTermino: "",
    nombreReservante: "",
  });

  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [showCancelarModal, setShowCancelarModal] = useState(false);
  const [showChart, setShowChart] = useState(false); // Para mostrar/ocultar el gráfico

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const reservasPorPagina = 5;

  // Filtros adicionales
  const [filtroReservante, setFiltroReservante] = useState("");
  const [filtroGarzonId, setFiltroGarzonId] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  // --------------------- EFECTOS -------------------------------------------
  useEffect(() => {
    fetchMesas();
    fetchGarzones();
    fetchReservas();
    actualizarHora();
  
    const intervaloHora = setInterval(actualizarHora, 1000);
    const intervaloMesas = setInterval(fetchMesas, 10000);
  
    return () => {
      clearInterval(intervaloHora);
      clearInterval(intervaloMesas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------- FUNCIONES DE CARGA DE DATOS -----------------------
  const actualizarHora = () => {
    const opciones = { timeZone: "America/Santiago", hour12: false };
    const formatoHora = new Intl.DateTimeFormat("es-CL", {
      ...opciones,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setHoraActual(formatoHora.format(new Date()));
  };

  const fetchMesas = async () => {
    try {
      const data = await obtenerMesas();
      setMesas(data);
    } catch (error) {
      manejarError("Error al obtener las mesas", error);
    }
  };

  const fetchGarzones = async () => {
    try {
      const data = await getGarzonesService();
      setGarzones(data);
    } catch (error) {
      manejarError("Error al obtener los garzones", error);
    }
  };

  const fetchReservas = async () => {
    try {
      const data = await obtenerReservas();
      setReservas(data);
    } catch (error) {
      manejarError("Error al obtener las reservas", error);
    }
  };

  // ---------------------- FILTRO AVANZADO DE RESERVAS -----------------------
  const filtrarReservasAvanzado = () => {
    let filtradas = [...reservas];

    if (filtroReservas) {
      filtradas = filtradas.filter((reserva) => reserva.estado === filtroReservas);
    }

    if (filtroReservante.trim() !== "") {
      const texto = filtroReservante.toLowerCase();
      filtradas = filtradas.filter((reserva) =>
        reserva.nombreReservante.toLowerCase().includes(texto)
      );
    }

    if (filtroGarzonId !== "") {
      filtradas = filtradas.filter((reserva) => {
        if (filtroGarzonId === "N/A") {
          return !reserva.garzonAsignado;
        } else {
          return reserva.garzonAsignado && (reserva.garzonAsignado.id == filtroGarzonId);
        }
      });
    }

    if (filtroFechaInicio || filtroFechaFin) {
      filtradas = filtradas.filter((reserva) => {
        if (!reserva.fechaInicioReserva) return false;
        const fechaReserva = new Date(reserva.fechaInicioReserva).getTime();

        let cumpleInicio = true;
        let cumpleFin = true;

        if (filtroFechaInicio) {
          const fechaInicioFiltro = new Date(filtroFechaInicio).getTime();
          if (isNaN(fechaInicioFiltro)) return false;
          cumpleInicio = fechaReserva >= fechaInicioFiltro;
        }

        if (filtroFechaFin) {
          const fechaFinFiltro = new Date(filtroFechaFin).getTime();
          if (isNaN(fechaFinFiltro)) return false;
          cumpleFin = fechaReserva <= fechaFinFiltro;
        }

        return cumpleInicio && cumpleFin;
      });
    }

    return filtradas;
  };

  const reservasFiltradas = filtrarReservasAvanzado();

  const totalReservas = reservasFiltradas.length;
  const totalPaginas = Math.ceil(totalReservas / reservasPorPagina);
  const mostrarPaginaActual = totalPaginas > 0 ? paginaActual : 1;
  const mostrarTotalPaginas = totalPaginas > 0 ? totalPaginas : 1;
  const indiceInicial = (paginaActual - 1) * reservasPorPagina;
  const reservasPaginadas = reservasFiltradas.slice(indiceInicial, indiceInicial + reservasPorPagina);

  const paginaSiguiente = () => {
    if (totalPaginas > 0 && paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (totalPaginas > 0 && paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const mesasFiltradas = filtroMesas === "Todas"
    ? mesas.sort((a, b) => a.numeroMesa - b.numeroMesa)
    : mesas.filter((mesa) => mesa.estado === filtroMesas).sort((a, b) => a.numeroMesa - b.numeroMesa);

  // ---------------------- HANDLERS DE MESAS ---------------------------------
  const handleLiberarMesa = async (numeroMesa) => {
    try {
      await cancelarReservaAsociada(numeroMesa);
      await liberarMesa(numeroMesa);
      fetchMesas();
      mostrarMensaje(`Mesa ${numeroMesa} liberada y reserva cancelada correctamente.`, false);
    } catch (error) {
      manejarError("Error al liberar la mesa", error);
    }
  };

  const cancelarReservaAsociada = async (numeroMesa) => {
    const reservaAsociada = reservas.find((reserva) =>
      reserva.mesa.numeroMesa === numeroMesa &&
      (reserva.estado === "Pendiente" || reserva.estado === "Confirmada")
    );
    if (reservaAsociada) {
      await cancelarReserva(reservaAsociada.id);
    }
  };

  const handleReservarMesa = async () => {
    const { fechaInicio, fechaTermino, nombreReservante } = reservaDetalles;
  
    const datosReserva = {
      numeroMesa: mesaReservar,
      garzonAsignado: garzonSeleccionado[mesaReservar] || null,
      fechaInicioReserva: fechaInicio,
      fechaFinReserva: fechaTermino,
      nombreReservante,
    };
  
    try {
      await reservarMesa(datosReserva); // Llama al servicio con Axios
  
      fetchMesas();
      fetchReservas();
      mostrarMensaje(`La mesa ${mesaReservar} ha sido reservada correctamente.`, false);
      closeReservaModal();
    } catch (error) {
      mostrarMensaje(error.message, true); // Muestra los errores al usuario
    }
  };
  

  const handleGarzonChange = (numeroMesa, garzonId) => {
    setGarzonSeleccionado((prev) => ({
      ...prev,
      [numeroMesa]: garzonId,
    }));
  };

  const handleAgregarMesa = async () => {
    try {
      await agregarMesa();
      fetchMesas();
      mostrarMensaje("Mesa agregada correctamente.", false);
    } catch (error) {
      manejarError("Error al agregar la mesa", error);
    }
  };

  const handleEliminarMesa = async () => {
    if (!mesaEliminar) return;
    try {
      await eliminarMesa(mesaEliminar);
      fetchMesas();
      mostrarMensaje(`Mesa ${mesaEliminar} eliminada correctamente.`, false);
      closeModal();
    } catch (error) {
      manejarError("Error al eliminar la mesa", error);
    }
  };

  // ---------------------- HANDLERS DE RESERVAS (CANCELAR) ----------
  const openCancelarModal = (reserva) => {
    setReservaSeleccionada(reserva);
    setShowCancelarModal(true);
  };

  const closeCancelarModal = () => {
    setShowCancelarModal(false);
    setReservaSeleccionada(null);
  };

  const handleCancelarReserva = async () => {
    if (!reservaSeleccionada) return;
    try {
      await cancelarReserva(reservaSeleccionada.id);
      mostrarMensaje(
        `Reserva cancelada correctamente.`,
        false
      );
      closeCancelarModal();
      fetchReservas();
    } catch (error) {
      manejarError("Error al cancelar la reserva", error);
    }
  };

  // ---------------------- MODALS --------------------------------------------
  const openModal = (numeroMesa) => {
    setMesaEliminar(numeroMesa);
    setShowModal(true);
  };

  const openReservaModal = (numeroMesa) => {
    setMesaReservar(numeroMesa);
    setShowReservaModal(true);
  };

  const openReservasList = () => {
    setPaginaActual(1);
    setShowReservasList(true);
  };

  const closeReservasList = () => setShowReservasList(false);

  const closeModal = () => {
    setShowModal(false);
    setMesaEliminar(null);
  };

  const closeReservaModal = () => {
    setShowReservaModal(false);
    setMesaReservar(null);
    setReservaDetalles({ fechaInicio: "", fechaTermino: "", nombreReservante: "" });
  };

  const mostrarMensaje = (texto, esError) => {
    setMensaje(texto);
    setMensajeError(esError);
    setTimeout(() => setMensaje(""), 5000);
  };

  const manejarError = (mensajeBase, error) => {
    console.error(`${mensajeBase}:`, error);
    mostrarMensaje(mensajeBase, true);
  };

  // ---------------------- DATOS DEL GRÁFICO -----------------------
  const estadosMap = {};
  reservasFiltradas.forEach((r) => {
    estadosMap[r.estado] = (estadosMap[r.estado] || 0) + 1;
  });
  const labels = Object.keys(estadosMap);
  const dataValues = Object.values(estadosMap);

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Distribución de Reservas Filtradas',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="mesas-page">
      {mensaje && (
        <div className={`mensaje-toast ${mensajeError ? "error" : "success"}`}>
          {mensaje}
        </div>
      )}

      <div className="mesas-container">
        <h2 className="titulo-principal">Gestión de Mesas</h2>
        <div className="hora-actual">Hora actual: {horaActual}</div>

        <div className="acciones">
          <button className="agregar-button" onClick={handleAgregarMesa}>
            Agregar Mesa
          </button>
          <button className="reservas-button" onClick={openReservasList}>
            Ver Reservas
          </button>
        </div>

        <div className="filtros">
          <label>Filtrar Mesas: </label>
          <button onClick={() => setFiltroMesas("Todas")}>Todas</button>
          <button onClick={() => setFiltroMesas("Disponible")}>Disponibles</button>
          <button onClick={() => setFiltroMesas("Ocupada")}>Ocupadas</button>
        </div>

        <table className="mesas-table">
          <thead>
            <tr>
              <th>Número de Mesa</th>
              <th>Estado</th>
              <th>Garzón Asignado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mesasFiltradas.map((mesa) => {
              const garzonId = garzonSeleccionado[mesa.numeroMesa] || mesa.garzonAsignado?.id || "";
              return (
                <tr key={mesa.id}>
                  <td>{mesa.numeroMesa}</td>
                  <td>{mesa.estado}</td>
                  <td>
                    <select
                      className="custom-select"
                      value={garzonId}
                      onChange={(e) => handleGarzonChange(mesa.numeroMesa, e.target.value)}
                      disabled={mesa.estado === "Ocupada"}
                    >
                      <option value="">N/A</option>
                      {garzones.map((garzon) => (
                        <option key={garzon.id} value={garzon.id}>
                          {garzon.nombreCompleto}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {mesa.estado === "Disponible" ? (
                      <div className="acciones-botones">
                        <button
                          className="reservar-button"
                          onClick={() => openReservaModal(mesa.numeroMesa)}
                        >
                          Reservar
                        </button>
                        <button
                          className="eliminar-button"
                          onClick={() => openModal(mesa.numeroMesa)}
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <button
                        className="liberar-button"
                        onClick={() => handleLiberarMesa(mesa.numeroMesa)}
                      >
                        Liberar (Cancela la reserva)
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showReservasList && (
        <div className="reservas-panel open">
          <button className="close-panel" onClick={closeReservasList}>×</button>
          <h3>Lista de Reservas</h3>
          <div>
            <label>Filtrar por Estado: </label>
            <select
              value={filtroReservas}
              onChange={(e) => {
                setFiltroReservas(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="">Todas</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Finalizada">Finalizada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div className="filtros-avanzados">
            <label>
              Nombre del Reservante:
              <input
                type="text"
                value={filtroReservante}
                onChange={(e) => {
                  setFiltroReservante(e.target.value);
                  setPaginaActual(1);
                }}
                placeholder="Ej: Juan"
              />
            </label>
            <label>
              Garzón Asignado:
              <select
                value={filtroGarzonId}
                onChange={(e) => {
                  setFiltroGarzonId(e.target.value);
                  setPaginaActual(1);
                }}
              >
                <option value="">Todos</option>
                <option value="N/A">N/A</option>
                {garzones.map((garzon) => (
                  <option key={garzon.id} value={garzon.id}>
                    {garzon.nombreCompleto}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Fecha Inicio (Rango):
              <input
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => {
                  setFiltroFechaInicio(e.target.value);
                  setPaginaActual(1);
                }}
              />
            </label>
            <label>
              Fecha Fin (Rango):
              <input
                type="date"
                value={filtroFechaFin}
                onChange={(e) => {
                  setFiltroFechaFin(e.target.value);
                  setPaginaActual(1);
                }}
              />
            </label>
          </div>

          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <button
              onClick={() => setShowChart(!showChart)}
              className="generar-grafico-button"
            >
              {showChart ? "Ocultar Gráfico" : "Generar Gráfico"}
            </button>
          </div>

          {showChart && (
            <div className="grafico-container">
              {reservasFiltradas.length > 0 ? (
                <div className="grafico-wrapper" style={{ width: "300px", height: "300px", margin: "0 auto" }}>
                  <Doughnut data={data} options={options} />
                </div>
              ) : (
                <p>No hay reservas para mostrar en el gráfico.</p>
              )}
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>Mesa</th>
                <th>Reservante</th>
                <th>Garzón</th>
                <th>Fecha Inicio</th>
                <th>Fecha Término</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasPaginadas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.mesa.numeroMesa}</td>
                  <td>{reserva.nombreReservante}</td>
                  <td>
                    {reserva.garzonAsignado
                      ? reserva.garzonAsignado.nombreCompleto
                      : "N/A"}
                  </td>
                  <td>
                    {reserva.fechaInicioReserva
                      ? new Date(reserva.fechaInicioReserva).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {reserva.fechaFinReserva
                      ? new Date(reserva.fechaFinReserva).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{reserva.estado}</td>
                  <td>
                    {reserva.estado !== "Finalizada" &&
                      reserva.estado !== "Cancelada" && (
                        <button
                          className="cancelar-button"
                          onClick={() => openCancelarModal(reserva)}
                        >
                          Cancelar
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="paginacion">
            <button onClick={paginaAnterior} disabled={mostrarTotalPaginas < 1 || paginaActual === 1}>
              Anterior
            </button>
            <span>Página {mostrarPaginaActual} de {mostrarTotalPaginas}</span>
            <button onClick={paginaSiguiente} disabled={mostrarTotalPaginas < 1 || paginaActual === mostrarTotalPaginas}>
              Siguiente
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal eliminar-modal">
            <p>¿Estás seguro de que quieres eliminar la mesa {mesaEliminar}?</p>
            <div className="modal-actions">
              <button onClick={handleEliminarMesa} className="confirm-button">
                Sí
              </button>
              <button onClick={closeModal} className="cancel-button">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showReservaModal && (
        <div className="modal-overlay">
          <div className="modal reservar-modal">
            <button className="close-modal-btn" onClick={closeReservaModal}>×</button>
            <h3>Reservar Mesa {mesaReservar}</h3>
            <div className="modal-form">
              <label>
                Fecha y Hora de Inicio:
                <input
                  type="datetime-local"
                  value={reservaDetalles.fechaInicio}
                  onChange={(e) =>
                    setReservaDetalles((prev) => ({ ...prev, fechaInicio: e.target.value }))
                  }
                />
              </label>
              <label>
                Fecha y Hora de Término:
                <input
                  type="datetime-local"
                  value={reservaDetalles.fechaTermino}
                  onChange={(e) =>
                    setReservaDetalles((prev) => ({ ...prev, fechaTermino: e.target.value }))
                  }
                />
              </label>
              <label>
                Nombre del Reservante:
                <input
                  type="text"
                  value={reservaDetalles.nombreReservante}
                  onChange={(e) =>
                    setReservaDetalles((prev) => ({ ...prev, nombreReservante: e.target.value }))
                  }
                />
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={handleReservarMesa} className="confirm-button">
                Confirmar
              </button>
              <button onClick={closeReservaModal} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelarModal && reservaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal cancelar-modal">
            <button className="close-modal-btn" onClick={closeCancelarModal}>×</button>
            <h3>Acciones sobre la Reserva</h3>
            <p>Reserva de la mesa {reservaSeleccionada.mesa.numeroMesa}.</p>
            <p>Solo puedes cancelar la reserva.</p>
            <div className="modal-actions">
              <button
                onClick={handleCancelarReserva}
                className="confirm-button"
              >
                Cancelar Reserva
              </button>
              <button onClick={closeCancelarModal} className="cancel-button">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mesas;
