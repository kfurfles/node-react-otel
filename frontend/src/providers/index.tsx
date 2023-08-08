import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';


type AppProviderProps = {
    children: ReactNode;
  };

export const AppProvider = ({ children }: AppProviderProps) => {
    return (
        <Suspense
            fallback={<div>Loading ...</div>}
        >
            <ErrorBoundary fallbackRender={(props) => (<div>
                Deu Ruim
                <hr />
                {props.error}
            </div>)}>
            <HelmetProvider>
            <MantineProvider withNormalizeCSS withGlobalStyles>
                <Notifications />
                {children}
            </MantineProvider>
            </HelmetProvider>
            </ErrorBoundary>
        </Suspense>
    )
}