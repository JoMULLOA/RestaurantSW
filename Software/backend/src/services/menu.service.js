import { AppDataSource } from "../config/configDb.js";
import menu from "../entity/menu.entity.js";

export const getMenus = async () => {
    const menuRepository = AppDataSource.getRepository(menu);
    return await menuRepository.find();
  };
  
  export const addMenu = async (data) => {
      const menuRepository = AppDataSource.getRepository(menu);
      const newMenu = menuRepository.create(data);
      return await menuRepository.save(newMenu);
  };
  
  export const removeMenu = async (id) => {
    const menuRepository = AppDataSource.getRepository(menu);
    const menuToDelete = await menuRepository.findOneBy({ id });
  
    if (!menuToDelete) {
        return null; 
    }
  
    await menuRepository.remove(menuToDelete);
    return menuToDelete; // 
  };