import { useAOOK } from "./AOOKContext";
import Textarea from "@/components/UI/Textarea";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";

export default function AOOKCommissionTab() {
  const { state, updateField } = useAOOK();
  const { textA, loadPercent, textC, textD } = state.commission;

  const handleChange = (field, value) => {
    updateField("commission", { [field]: value });
  };

  const handleClear = () => {
    updateField("commission", {
      textA: "",
      loadPercent: "",
      textC: "",
      textD: ""
    });
  };

  return (
    <div className="flex flex-col gap-6 text-sm text-[--color-primary]">
      <p className="font-bold">
        9. На основании изложенного:
      </p>

      <div>
        <p className="mb-1">а) разрешается использование конструкций по назначению:</p>
        <Textarea
          value={textA}
          onChange={(e) => handleChange("textA", e.target.value)}
          placeholder="Введите текст..."
        />
      </div>

      <div className="flex items-center gap-2">
        <p>б) разрешается использование конструкций по назначению с нагружением в размере</p>
        <Input
          value={loadPercent}
          onChange={(e) => handleChange("loadPercent", e.target.value)}
          className="w-16"
        />
        <p>% от проектной нагрузки</p>
      </div>

      <div>
        <p className="mb-1">в) разрешается полное нагружение при выполнении следующих условий:</p>
        <Textarea
          value={textC}
          onChange={(e) => handleChange("textC", e.target.value)}
          placeholder="Введите текст..."
        />
      </div>

      <div>
        <p className="mb-1">г) разрешается производство последующих работ:</p>
        <Textarea
          value={textD}
          onChange={(e) => handleChange("textD", e.target.value)}
          placeholder="Введите текст..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button onClick={handleClear}>Очистить</Button>
        <Button>Применить</Button>
      </div>
    </div>
  );
}
