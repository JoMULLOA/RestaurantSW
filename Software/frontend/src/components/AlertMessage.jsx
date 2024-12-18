import '@styles/alertMessage.css';

const AlertMessage = ({ message, type }) => {
    return (
      <div className={`alert alert-${type}`} role="alert">
        {message}
      </div>
    );
  };
  
  export default AlertMessage;