
import { IAlbum } from "./album.interface"
import { IArtista } from "./artista.interface"

export interface IGrupoalbumartista {
    id: number
    album: IAlbum
    artista: IArtista
}