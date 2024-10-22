import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useDebounce } from '../../shared/UseDebounce';
import { useController, useFormContext } from 'react-hook-form';

import { toTel } from '../../shared/functions';
import { FuncionariosService } from '../../api/services/FuncionariosService';

type TAutoCompleteOption = {
  id: number;
  label: string;
};

interface IAutoCompleteCategoryProps {
  isExternalLoading?: boolean;
}

export const AutoCompleteFuncionario: React.FC<IAutoCompleteCategoryProps> = ({ isExternalLoading = false }) => {
  const { control } = useFormContext();
  
  const { field: { onChange, value }, fieldState: { error } } = useController({
    name: 'id_funcionario',
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
      FuncionariosService.getAll(1, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            // alert(result.message);
          } else {
            setOpcoes(result.data.map((cliente: any) => ({ id: cliente.id, label: `${cliente.nome} - ${toTel(cliente.telefone)}` })));
          }
        });
    });
  }, [ busca, debounce ]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!value) return null;

    const selectedOption = opcoes.find(opcao => opcao.id === value);
    if (!selectedOption) return null;

    return selectedOption;
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
      onChange={(_, newValue) => { onChange(newValue?.id); setBusca(''); }}
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Colaborador"
          error={!!error}
          helperText={error ? error.message : ''}
        />
      )}
    />
  );
};
