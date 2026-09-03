import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Temple, TempleFormState } from "@/types/temple";
import type { ReactNode } from "react";

const RELIGION_OPTIONS: { value: Temple["religion"]; label: string }[] = [
  { value: "buddhism", label: "佛教寺庙 (buddhism)" },
  { value: "taoism", label: "道教 (taoism)" },
  { value: "catholic", label: "天主教 (catholic)" },
  { value: "islam", label: "伊斯兰教 (islam)" },
];

const STATUS_OPTIONS: { value: Temple["status"]; label: string }[] = [
  { value: "active", label: "正常开放 (active)" },
  { value: "renovation", label: "修缮中 (renovation)" },
  { value: "ruins", label: "遗址 (ruins)" },
];

const Field = ({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {label}
    </Label>
    {children}
  </div>
);

interface TempleAdminFieldsProps {
  form: TempleFormState;
  onChange: (next: TempleFormState) => void;
  idPrefix: string;
}

export const TempleAdminFields = ({ form, onChange, idPrefix }: TempleAdminFieldsProps) => {
  const set = <K extends keyof TempleFormState>(key: K, value: TempleFormState[K]) => {
    onChange({ ...form, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <Field label="寺庙名称" htmlFor={`${idPrefix}-name`}>
        <Input id={`${idPrefix}-name`} value={form.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <Field label="别名/曾用名" htmlFor={`${idPrefix}-aliases`}>
        <Input id={`${idPrefix}-aliases`} value={form.aliases} onChange={(e) => set("aliases", e.target.value)} />
      </Field>
      <Field label="宗教类型">
        <Select value={form.religion} onValueChange={(value) => set("religion", value as Temple["religion"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RELIGION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="地址" htmlFor={`${idPrefix}-location`}>
        <Input id={`${idPrefix}-location`} value={form.location} onChange={(e) => set("location", e.target.value)} />
      </Field>
      <Field label="经度" htmlFor={`${idPrefix}-lng`}>
        <Input
          id={`${idPrefix}-lng`}
          type="number"
          value={form.lng}
          onChange={(e) => set("lng", Number(e.target.value))}
        />
      </Field>
      <Field label="纬度" htmlFor={`${idPrefix}-lat`}>
        <Input
          id={`${idPrefix}-lat`}
          type="number"
          value={form.lat}
          onChange={(e) => set("lat", Number(e.target.value))}
        />
      </Field>
      <Field label="现状">
        <Select value={form.status} onValueChange={(value) => set("status", value as Temple["status"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="始建年代" htmlFor={`${idPrefix}-year`}>
        <Input
          id={`${idPrefix}-year`}
          type="number"
          value={form.establishedYear}
          onChange={(e) => set("establishedYear", Number(e.target.value))}
        />
      </Field>
      <Field label="简介" htmlFor={`${idPrefix}-description`}>
        <Textarea
          id={`${idPrefix}-description`}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>
      <Field label="核心建筑" htmlFor={`${idPrefix}-core`}>
        <Textarea
          id={`${idPrefix}-core`}
          value={form.coreArchitecture}
          onChange={(e) => set("coreArchitecture", e.target.value)}
        />
      </Field>
      <Field label="开放时间" htmlFor={`${idPrefix}-hours`}>
        <Input
          id={`${idPrefix}-hours`}
          value={form.openingHours}
          onChange={(e) => set("openingHours", e.target.value)}
        />
      </Field>
      <Field label="门票" htmlFor={`${idPrefix}-tickets`}>
        <Input id={`${idPrefix}-tickets`} value={form.tickets} onChange={(e) => set("tickets", e.target.value)} />
      </Field>
      <Field label="固定活动/重大宗教节日" htmlFor={`${idPrefix}-festivals`}>
        <Textarea
          id={`${idPrefix}-festivals`}
          value={form.fixedActivitiesFestivals}
          onChange={(e) => set("fixedActivitiesFestivals", e.target.value)}
        />
      </Field>
      <Field label="相关人物（多个用逗号分隔）" htmlFor={`${idPrefix}-people`}>
        <Textarea
          id={`${idPrefix}-people`}
          value={form.relatedPeopleText}
          onChange={(e) => set("relatedPeopleText", e.target.value)}
        />
      </Field>
      <Field label="宗教活动内容" htmlFor={`${idPrefix}-activities`}>
        <Textarea
          id={`${idPrefix}-activities`}
          value={form.religiousActivities}
          onChange={(e) => set("religiousActivities", e.target.value)}
        />
      </Field>
      <Field label="义工情况" htmlFor={`${idPrefix}-volunteers`}>
        <Textarea
          id={`${idPrefix}-volunteers`}
          value={form.volunteers}
          onChange={(e) => set("volunteers", e.target.value)}
        />
      </Field>
      <Field label="人流/香火情况" htmlFor={`${idPrefix}-flow`}>
        <Textarea
          id={`${idPrefix}-flow`}
          value={form.visitorFlow}
          onChange={(e) => set("visitorFlow", e.target.value)}
        />
      </Field>
      <Field label="寺庙注意事项" htmlFor={`${idPrefix}-notes`}>
        <Textarea
          id={`${idPrefix}-notes`}
          value={form.templeNotes}
          onChange={(e) => set("templeNotes", e.target.value)}
        />
      </Field>
      <Field label="数据来源" htmlFor={`${idPrefix}-source`}>
        <Input
          id={`${idPrefix}-source`}
          value={form.dataSource}
          onChange={(e) => set("dataSource", e.target.value)}
        />
      </Field>
      <Field label="采集人" htmlFor={`${idPrefix}-collector`}>
        <Input
          id={`${idPrefix}-collector`}
          value={form.collector}
          onChange={(e) => set("collector", e.target.value)}
        />
      </Field>
      <Field label="采集日期" htmlFor={`${idPrefix}-collected`}>
        <Input
          id={`${idPrefix}-collected`}
          value={form.collectedDate}
          onChange={(e) => set("collectedDate", e.target.value)}
        />
      </Field>
      <Field label="照片链接" htmlFor={`${idPrefix}-image`}>
        <Input id={`${idPrefix}-image`} value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} />
      </Field>
      <Field label="待核实备注" htmlFor={`${idPrefix}-verify`}>
        <Textarea
          id={`${idPrefix}-verify`}
          value={form.verificationNotes}
          onChange={(e) => set("verificationNotes", e.target.value)}
        />
      </Field>
    </div>
  );
};
