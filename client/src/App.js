import AppRouter from "components/AppRouter/AppRouter";
import DialogProvider from "contexts/Dialog";
import {ApolloProvider} from "@apollo/client";
import {apolloClient} from "apollo/client";
import ErrorBoundary from "components/ErrorBoundary";

const App = () => (
    <ErrorBoundary>
        <ApolloProvider client={apolloClient}>
            <DialogProvider>
                <AppRouter/>
            </DialogProvider>
        </ApolloProvider>
    </ErrorBoundary>
);
export default App;