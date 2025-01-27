export interface IAlbum {
     id: number
     nombre: string
     fecha: string
     genero: string
     descripcion: string
     discografica: string
     img: Blob 
     grupoalbumartistas?: any
     resenyas?: any
   }