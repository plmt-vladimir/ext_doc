import { useAOOK } from "./AOOKContext";
import Textarea from "@/components/UI/Textarea";
import Button from "@/components/UI/Button";

export default function AOOKTestingTab() {
  const { state, updateField } = useAOOK();
  const text = state.testing.text || "";

  return (
    <div className="flex flex-col gap-4 text-sm text-[--color-primary]">
      <p className="font-bold mb-4">
        6. Проведены необходимые испытания и обследования
      </p>

      <Textarea
        value={text}
        onChange={e => updateField("testing", { text: e.target.value })}
        placeholder="Введите информацию об испытаниях и обследованиях"
        rows={20}
        className="w-full"
      />

      <div className="flex justify-end gap-2">
        <Button onClick={() => updateField("testing", { text: "" })}>Очистить</Button>
        <Button>Применить</Button>
      </div>
    </div>
  );
}
