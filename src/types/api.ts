export type ServiceGroup = 'HOME_PROJECT' | 'INDIVIDUAL_SERVICE';

export interface Category {
  id: number;
  name: string;
  description: string | null;
  serviceGroup: ServiceGroup;
  imageUrl: string | null;
}

export interface ApiErrorBody {
  status?: number;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}
