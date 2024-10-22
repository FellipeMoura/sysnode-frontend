import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { AuthService, TUsuariosComTotalCount } from '../../api/services/AuthService';

export const Dashboard = () => {
    const [teste, setTeste] = useState<TUsuariosComTotalCount>({ data: [], totalCount: 0 }); // Inicializa com um objeto padrão

    useEffect(() => {
        AuthService.getAll()
            .then(resultado => {
                setTeste(resultado);
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }, []);

    return (
        <Button variant='contained'>
            {teste.totalCount}
        </Button>
    );
};
