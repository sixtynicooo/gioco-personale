

export const getIdRowCol=(riga:number,colonna:number)=>{
    return  `${riga}_${colonna}`
}

export const getIdRowColRadius=(riga:number,colonna:number,radius:number)=>{
    return  `${riga}_${colonna}_${radius}`
}

// id è riga_colonna quindi basta separare
export const getRowColId=(id:string)=>{
    const rigaCol=id.split('_')
    const riga:number=Number(rigaCol[0])
    const colonna:number=Number(rigaCol[1])
    return  {riga,colonna}
}