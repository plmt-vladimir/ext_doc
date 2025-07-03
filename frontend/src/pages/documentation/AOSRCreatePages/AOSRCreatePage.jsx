import { AOSRCreateProvider } from "./AOSRCreateContext";
import AOSRCreate from "./AOSRCreate";

export default function AOSRCreatePage() {
  return (
    <AOSRCreateProvider>
      <AOSRCreate />
    </AOSRCreateProvider>
  );
}