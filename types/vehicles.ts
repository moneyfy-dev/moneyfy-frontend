export interface VehicleModel {
  id: string;
  name: string;
  models: string[];
}

export interface VehiclesResponse {
  message: string;
  status: number;
  data: {
    vehicles: VehicleModel[];
    tokens: {
      jwtSession: string;
      jwtRefresh: string;
    };
    user: any;
  };
} 