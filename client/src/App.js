import AppRouter from "components/AppRouter/AppRouter";
import DialogProvider from "contexts/Dialog";
import TasksProvider from "contexts/Settings";
import {ApolloProvider} from "@apollo/client";
import {apolloClient} from "apollo/client";
import ErrorBoundary from "components/ErrorBoundary";

const App = () => (
    <ErrorBoundary>
        <ApolloProvider client={apolloClient}>
            <TasksProvider>
                <DialogProvider>
                    <AppRouter/>
                </DialogProvider>
            </TasksProvider>
        </ApolloProvider>
    </ErrorBoundary>
);
export default App;