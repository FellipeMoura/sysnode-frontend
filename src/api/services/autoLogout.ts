

export default function autoLogout(error: any) {

 

  return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
}