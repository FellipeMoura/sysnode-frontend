import React, { useState } from 'react';
import { Tabs, Tab, Box, useMediaQuery, useTheme, Theme, IconButton, Icon } from '@mui/material';
import { useDrawerContext } from '../../contexts';



interface TabsNavigatorProps {
    steps: { label: string, content: React.ReactNode }[];
}

export const TabsNavigator: React.FC<TabsNavigatorProps> = ({ steps }) => {
    const { toggleDrawerOpen } = useDrawerContext();
    const [activeStep, setActiveStep] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveStep(newValue);
    };

    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    // const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const theme = useTheme();
    return (
        <Box height="100%" display="flex" flexDirection="column" gap={0.1}>
            {/* Botões no topo da página */}
            <Box display='flex' marginX={theme.spacing(1)} >

                {smDown && (
                    <IconButton onClick={toggleDrawerOpen}>
                        <Icon>menu</Icon>
                    </IconButton>
                )}
                <Tabs value={activeStep} onChange={handleChange} variant="fullWidth" >
                    {steps.map((step, index) => (
                        <Tab sx={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipses"
                        }}
                            key={index}
                            label={step.label}
                        />
                    ))}
                </Tabs>
            </Box>
            {/* Conteúdo dos "steps" */}
            <Box mt={1}>
                {steps[activeStep].content}
            </Box>
        </Box>
    );
};
