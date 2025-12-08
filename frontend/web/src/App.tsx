import { PageTransitionProvider } from "./providers/PageTransitionProvider";
import MainContent from "./screens/MainContent";

export default function App() {
  return (
    <PageTransitionProvider>
      <MainContent />
    </PageTransitionProvider>
  );
}
 