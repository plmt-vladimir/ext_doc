import { AOOKProvider } from "./AOOKContext";
import AOOKCreateContent from "./AOOKCreateContent";

export default function AOOKCreate() {
  return (
    <AOOKProvider>
      <AOOKCreateContent />
    </AOOKProvider>
  );
}
