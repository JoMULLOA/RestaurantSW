import { useState, useEffect } from 'react';

// Esto es un hook personalizado que se encarga de manejar los estados y funciones de la página de registro de un ingrediente

const useRegister = () => {
    // estos son los estados que se van a manejar en la página
    const [errorTipo, setErrorTipo] = useState('');
    const [errorCantidad, setErrorCantidad] = useState('');
    const [inputData, setInputData] = useState({ tipo: '', cantidad: '' });

    // este useEffect se encarga de verificar si los campos están vacíos
    useEffect(() => {
        if (inputData.tipo) setErrorTipo('');
        if (inputData.cantidad) setErrorCantidad('');
    }, [inputData.tipo, inputData.cantidad]);

    // esta función se encarga de mostrar los mensajes de error en caso de que los campos estén vacíos
    const errorData = (dataMessage) => {
        if (dataMessage.dataInfo === 'tipo') {
            setErrorTipo(dataMessage.message);
        } else if (dataMessage.dataInfo === 'cantidad') {
            setErrorCantidad(dataMessage.message);
        }
    };

    return {
        errorTipo,
        errorCantidad,
        inputData,
        setInputData,
        errorData,
    };
};

export default useRegister;