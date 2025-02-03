import { IAlbum } from "./album.interface"
import { IUsuario } from "./usuario.interface"

export interface IResenya {
    id: number
    nota: number
    descripcion: string
    fecha: string
    website: string
    album: IAlbum
    usuario: IUsuario
  }