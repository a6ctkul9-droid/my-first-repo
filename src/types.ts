export type GomiTypeId =
  | "burnable"
  | "can"
  | "pet"
  | "plastic"
  | "fluorescent"
  | "glass"
  | "other-bottle"
  | "clear-bottle"
  | "brown-bottle";

export type GomiType = {
  name: string;
  shortName: string;
  color: string;
  icon: string;
  tips: string[];
};

export type ScheduleData = {
  district: string;
  districtLabel: string;
  city: string;
  period: string;
  source: string;
  notifyTime: string;
  deadlineTime: string;
  schedule: Record<string, GomiTypeId[]>;
};

export type CollectionDay = {
  date: Date;
  dateKey: string;
  types: GomiTypeId[];
};
