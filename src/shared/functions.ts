export function toCash(value:number | string | undefined) {
    let retorno;

    if (!value || isNaN(Number(value))) {
        retorno = (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
        retorno = Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return retorno;
}

export function toDate(value: string | undefined) {
    let retorno

    if (!!value && value.length > 9) {
        retorno = (value).substr(0, 10).split('-').reverse().join('/')
    }else{
        retorno = value
    }

    return retorno;
}

export function toDateTime(value: string | undefined) {
    let retorno = ''


    if (!!value && value.length > 15) {
        let data = value.substr(2, 8).split('-').reverse().join('/')
        let hora = value.substr(11, 5)
        retorno = `${data} ${hora}`
    }

    return retorno;
}

export function toTel(telefone: string | undefined | null) {
    let retorno = telefone

    if (telefone?.length === 13) {

        let tel = String(telefone.substr(2, telefone.length - 1).split(/[()-]/))

        retorno = `(${tel.substr(0, 2)}) ${tel.substr(2, tel.length - 6)} ${tel.substr(-4, 4)}`
    }

    return retorno;
}