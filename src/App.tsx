import { AppProviders } from "@/components/providers/app-providers";
import { AppRouter } from "@/routes/AppRouter";

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
