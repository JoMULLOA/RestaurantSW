import axios from './root.service.js';

export const prepararPedido = async (datapedido, datamenu) => {
    const response = await axios.post('/chef/prepararpedido', { datapedido, datamenu });
    return response.data;
};


export const CancelarPedido = async (datapedido, datamenu) => {
    const response = await axios.post('/chef/cancelarpedido', { datapedido, datamenu });
    return response.data;
};