import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import * as yup from 'yup';

import { useAuthContext } from '../../contexts';


const loginSchema = yup.object().shape({
  user: yup.string().required(),
  password: yup.string().required().min(5),
});

interface ILoginProps {
  children: React.ReactNode;
}
export const Login: React.FC<ILoginProps> = ({ children }) => {
  const { isAuthenticated, login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');


  const handleSubmit = () => {
    setIsLoading(true);

    loginSchema
      .validate({ user, password }, { abortEarly: false })
      .then(dadosValidados => {
        login(dadosValidados.user, dadosValidados.password)
          .then(() => {
            setIsLoading(false);
          });
      })
      .catch((errors: yup.ValidationError) => {
        setIsLoading(false);

        errors.inner.forEach(error => {
          if (error.path === 'password') {
            setPasswordError(error.message);
          }
        });
      });
  };


  if (isAuthenticated) return (
    <>{children}</>
  );

  return (
    <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>

      <Card>
        <CardContent>
          <Box display='flex' flexDirection='column' gap={2} width={250}>
            <Typography variant='h6' align='center'>Identifique-se</Typography>

            <TextField
              fullWidth
              type='login'
              label='Usuário'
              value={user}
              disabled={isLoading}
              onChange={e => setUser(e.target.value)}
            />

            <TextField
              fullWidth
              label='Senha'
              type='password'
              value={password}
              disabled={isLoading}
              error={!!passwordError}
              helperText={passwordError}
              onKeyDown={() => setPasswordError('')}
              onChange={e => setPassword(e.target.value)}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Box width='100%' display='flex' justifyContent='center'>

            <Button
              variant='contained'
              disabled={isLoading}
              onClick={handleSubmit}
              endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
            >
              Entrar
            </Button>

          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};
