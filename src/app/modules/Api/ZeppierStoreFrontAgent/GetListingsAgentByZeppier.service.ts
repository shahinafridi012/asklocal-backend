import { IZapierData } from "./GetListingsByZeppier.interface";
import { ZapierModel } from "./GetListingsByZeppier.model";

export class ZapierService {
  static async saveData(payload: any): Promise<IZapierData> {
    return await ZapierModel.create({ data: payload });
  }

  static async getAll(): Promise<IZapierData[]> {
    return await ZapierModel.find().sort({ createdAt: -1 });
  }
}
