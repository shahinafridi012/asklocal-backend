import { ISettings } from "./generalsettings.interface";
import { Settings } from "./generalsettings.model";

const getSettings = async () => {
  const data = await Settings.findOne();
  return data || {};
};

const updateSettings = async (payload: Partial<ISettings>) => {
  const updated = await Settings.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
  });
  return updated;
};

export const SettingsService = { getSettings, updateSettings };
