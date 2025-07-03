import { ObjectRegistrationProvider } from "./ObjectRegistrationContext";
import ObjectRegistrationContent from "./ObjectRegistrationContent";

export default function ObjectRegistrationPage() {
  return (
    <ObjectRegistrationProvider>
      <ObjectRegistrationContent />
    </ObjectRegistrationProvider>
  );
}






