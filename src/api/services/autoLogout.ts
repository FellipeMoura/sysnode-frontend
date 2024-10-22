

export default function autoLogout(error: any) {

  if (error.code === 'ERR_BAD_REQUEST') {
 //   localStorage.setItem('APP_ACCESS_TOKEN', '')
  // window.location.reload()
    //return new Error('Login expirado');
  }

  return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
}