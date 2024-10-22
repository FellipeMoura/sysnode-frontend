import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { AutocompleteProps } from '@mui/material/Autocomplete';
import { useDebounce } from '../../shared/UseDebounce';
import { useController, useFormContext } from 'react-hook-form';
import { ProdutosService } from '../../api/services/ProdutosService';

type TAutoCompleteOption = {
  id: number;
  label: string;
  valor: number;
};

interface IAutoCompleteProps {
  isExternalLoading?: boolean;
}

export const AutoCompleteProduto: React.FC<IAutoCompleteProps> = ({ isExternalLoading = false }) => {
  const { control, setValue } = useFormContext();

  const { field: { onChange, value }, fieldState: { error } } = useController({
    name: 'id_produto',
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
      ProdutosService.getAll(1, busca)
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            // alert(result.message);
          } else {
            setOpcoes(result.data.map((element: any) => ({
              id: element.id,
              label: `${element.id}. ${element.nome}`,
              valor: element.valor,
            })));
          }
        });
    });
  }, [busca, debounce]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!value) return null;

    const selectedOption = opcoes.find(opcao => opcao.id === value);
    return selectedOption || null;
  }, [value, opcoes]);

  const autocompleteProps: AutocompleteProps<TAutoCompleteOption, false, false, false> = {
    options: opcoes,
    loading: isLoading || isExternalLoading,
    value: autoCompleteSelectedOption,
    disablePortal: false,
    openText: 'Abrir',
    closeText: 'Fechar',
    noOptionsText: 'Sem opções',
    loadingText: 'Carregando...',
    onInputChange: (_, newValue) => setBusca(newValue),
    onChange: (_, newValue) => {
      onChange(newValue?.id);
      setBusca('');
      if (newValue) {
        setValue('valor', newValue.valor);
        setValue('valor_base', newValue.valor);
      }
    },
    renderInput: (params) => (
      <TextField
        {...params}
        label="Inserir produto"
        error={!!error}
        helperText={error?.message}
      />
    ),
  };

  return (
    <Autocomplete
      {...autocompleteProps}
      popupIcon={isExternalLoading || isLoading ? <CircularProgress size={28} /> : undefined}
    />
  );
};