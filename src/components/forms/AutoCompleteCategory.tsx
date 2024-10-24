import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

import { ProdutosService } from '../../api/services/ProdutosService';
import { useDebounce } from '../../shared/UseDebounce';
import { useController, useFormContext } from 'react-hook-form';

type TAutoCompleteOption = {
  id: number;
  label: string;
};

interface IAutoCompleteCategoryProps {
  isExternalLoading?: boolean;
  tipo: string;
}

export const AutoCompleteCategory: React.FC<IAutoCompleteCategoryProps> = ({ tipo = '', isExternalLoading = false }) => {
  const { control } = useFormContext();
  
  const { field: { onChange, value }, fieldState: { error } } = useController({
    name: 'categoria',
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
      ProdutosService.getAllCategories(tipo, 1, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            // alert(result.message);
          } else {
            setOpcoes(result.data.map((categoria: any) => ({ id: categoria.id, label: categoria.nome })));
          }
        });
    });
  }, [tipo, busca, debounce]);

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
          label="Categoria"
          error={!!error}
          helperText={error ? error.message : ''}
        />
      )}
    />
  );
};
