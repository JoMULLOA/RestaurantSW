import axios from './root.service.js';

export const prepararPedido = async (datapedido, datamenu) => {
    const response = await axios.post('/chef/prepararpedido', { datapedido, datamenu });
    return response.data;
};


