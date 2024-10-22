import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Controller, useFormContext } from 'react-hook-form';

type TVTextFieldProps = Omit<NumericFormatProps, 'value'> & Omit<TextFieldProps, 'value'> & {
  name: string;
  onValueChange?: (value: string) => void;
}

/**
 * - Para resgatar o valor numérico no correto use o `onValueChange`
 * - Para eventos normais use o `onChange`
 *
 * Para como customizar a formatação verifique a documentação original do `react-number-format` [nesse link](https://www.npmjs.com/package/react-number-format) ou [nesse link](https://s-yadav.github.io/react-number-format/docs/intro/)
 */
export const VCash: React.FC<TVTextFieldProps> = ({ name, onValueChange, ...rest }) => {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <NumericFormat
          {...rest as any}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            },
          }}
          customInput={TextField}
          value={field.value ? field.value.replace('.', ',') : ''} // Exibe com vírgula para o usuário
          decimalSeparator=","
          thousandSeparator="."
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          // Manipula a formatação ao digitar
          onValueChange={({ value }) => {
            if (value) {
              const numericValue = value.replace(',', '.'); // Substitui ',' por '.' para armazenar internamente
              setValue(name, numericValue); // Atualiza o valor no formulário com ponto
              onValueChange?.(numericValue); // Callback opcional
            }
          }}
        />
      )}
    />
  );
};
