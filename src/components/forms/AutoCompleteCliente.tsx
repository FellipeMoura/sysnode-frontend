import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useDebounce } from '../../shared/UseDebounce';
import { useController, useFormContext } from 'react-hook-form';
import { ClientesService } from '../../api/services/ClientesService';
import { toTel } from '../../shared/functions';

type TAutoCompleteOption = {
  id: number;
  label: string;
};

interface IAutoCompleteCategoryProps {
  isExternalLoading?: boolean;
}

export const AutoCompleteCliente: React.FC<IAutoCompleteCategoryProps> = ({ isExternalLoading = false }) => {
  const { control } = useFormContext();
  
  const { field: { onChange, value }, fieldState: { error } } = useController({
    name: 'id_cliente',
    control,
    defaultValue: undefined,
  });
  
  const { debounce } = useDebounce();
  
  const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    setIsLoading(true);
    
    debounce(() => {
      ClientesService.getAll(1, busca)
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            // alert(result.message);
          } else {
            setOpcoes(result.data.map((cliente: any) => ({
              id: cliente.id,
              label: `${cliente.nome} - ${toTel(cliente.telefone)}`,
            })));
          }
        });
    })
  }, [busca, debounce]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!value) return null;

    const selectedOption = opcoes.find(opcao => opcao.id === value);
    return selectedOption || null;
  }, [value, opcoes]);

  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'
      disablePortal
      options={opcoes}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => { 
        onChange(newValue?.id); 
        setBusca(''); // Limpa a busca após a seleção
      }}
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cliente"
          error={!!error}
          helperText={error ? error.message : ''}
        />
      )}
    />
  );
};
