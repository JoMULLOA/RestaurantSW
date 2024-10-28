import { useNavigate } from 'react-router-dom';
import { register } from '@services/auth.service.js';
import Form from "@components/Form";
import useiRegister from '@hooks/auth/useiRegister.jsx';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/form.css';
import { useState } from 'react';

const IRegister = () => {
    const navigate = useNavigate();
    const { errorTipo, errorCantidad, inputData, errorData, handleInputChange } = useiRegister();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación adicional antes de enviar el formulario
        if (!inputData.tipo || !inputData.cantidad) {
            showErrorAlert('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            const response = await register(inputData);
            if (response.status === 201) {
                showSuccessAlert('Ingrediente registrado exitosamente');
                setTimeout(() => {
                    navigate('/iList');
                }, 3000);
            } else {
                showErrorAlert('Error al registrar el ingrediente');
                errorData(response.data);
            }
        } catch (error) {
            console.error('Error al registrar el ingrediente:', error);
            showErrorAlert('Error al registrar el ingrediente');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container">
            <Form
                title="Registrar Ingrediente"
                fields={[
                    {
                        label: "Tipo de Ingrediente",
                        name: "tipo",
                        placeholder: "Ej. Tomate",
                        fieldType: 'input',
                        type: "text",
                        required: true,
                        minLength: 3,
                        maxLength: 50,
                        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        patternMessage: "Debe contener solo letras y espacios",
                        errorMessageData: errorTipo,
                        onChange: (e) => handleInputChange('tipo', e.target.value)
                    },
                    {
                        label: "Cantidad",
                        name: "cantidad",
                        placeholder: "Ej. 10",
                        fieldType: 'input',
                        type: "number",
                        required: true,
                        min: 1,
                        max: 1000,
                        errorMessageData: errorCantidad,
                        onChange: (e) => handleInputChange('cantidad', e.target.value)
                    },
                ]}
                buttonText="Registrar"
                handleSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </main>
    );
};

export default IRegister;