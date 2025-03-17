import { ITipousuario } from "./tipousuario.iterface";

export interface IUsuario {
  id: number;
  username: string;
  nombre: string;
  fecha: string;
  descripcion: string;
  email: string;
  password: string;
  website: string;
  img: Blob;
  tipousuario: ITipousuario;
  resenyas?: any;
}
