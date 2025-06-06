import { Logging } from 'sequelize';

export interface SQLMetaInterface extends Logging {
    model: string; // The name of the model
    method: string; // The method being called (e.g., 'findAll', 'create', etc.)
}
