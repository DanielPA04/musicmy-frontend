import { ITipousuario } from "./tipousuario.iterface";

export interface IUsuario {
  id: number;
  nombre: string;
  fecha: string;
  descripcion: string;
  email: string;
  password: string;
  website: string;
  tipousuario: ITipousuario;
  resenyas?: any;
}
