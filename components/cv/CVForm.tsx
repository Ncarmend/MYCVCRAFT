"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/modal";
import { Plus, Trash2, Sparkles, Wand2, Target, FileText, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { TemplateRenderer } from "@/components/cv/CVPreview";
import { PhotoUpload } from "@/components/cv/PhotoUpload";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import type { CVFormData } from "@/types";

// --- Zod schema (validation messages injected at render time via translateError) ---
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  template: z.enum(["BASIC", "MODERN", "EXECUTIVE", "CREATIVE", "MINIMAL", "ELEGANT", "TECH", "CORPORATE", "SLATE", "WARM", "SOFT", "PHOTO", "CLASSIC", "CRISP"]),
  photoUrl: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  email: z.email().optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.url().optional().or(z.literal("")),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
      achievements: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      grade: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      url: z.string().optional(),
    })
  ),
  languages: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      proficiency: z.enum(["Native", "Fluent", "Advanced", "Intermediate", "Basic"]),
    })
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      url: z.string().optional(),
    })
  ),
});

// Template values are fixed product names; only descs are translated
const TEMPLATE_KEYS = [
  { value: "BASIC",     label: "Basic" },
  { value: "MODERN",    label: "Modern" },
  { value: "EXECUTIVE", label: "Executive" },
  { value: "CREATIVE",  label: "Creative" },
  { value: "MINIMAL",   label: "Minimal" },
  { value: "ELEGANT",   label: "Elegant" },
  { value: "TECH",      label: "Tech" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "SLATE",     label: "Slate" },
  { value: "WARM",      label: "Warm" },
  { value: "SOFT",      label: "Soft" },
  { value: "PHOTO",     label: "Photo" },
  { value: "CLASSIC",   label: "Classic" },
  { value: "CRISP",     label: "Crisp" },
];

// Proficiency enum values must stay in English (stored in DB), labels are translated
const PROFICIENCY_VALUES = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"] as const;

const SAMPLE_CV: Partial<CVFormData> = {
  name: "Sophie Laurent",
  jobTitle: "Product Designer",
  email: "sophie@example.com",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  linkedin: "linkedin.com/in/sophie",
  summary: "Creative designer with 5+ years crafting user-centred digital products for global brands.",
  skills: ["Figma", "React", "UX Research", "Prototyping", "CSS"],
  experience: [{
    id: "1", company: "Studio Créatif", role: "Senior Designer",
    startDate: "2021", endDate: "Present",
    description: "Led design for flagship SaaS product.",
    achievements: ["Increased conversion by 35%", "Mentored 3 designers"],
  }, {
    id: "2", company: "Agence Numérique", role: "UI Designer",
    startDate: "2018", endDate: "2021",
    description: "Built design system from scratch.",
    achievements: ["Delivered 12 client projects on time"],
  }],
  education: [{
    id: "1", institution: "École des Beaux-Arts", degree: "Master",
    field: "Design Graphique", startDate: "2015", endDate: "2017",
  }],
  projects: [{ id: "1", name: "DesignKit", description: "Open-source component library", technologies: ["React", "Storybook"], url: "designkit.io" }],
  languages: [{ id: "1", name: "Français", proficiency: "Native" }, { id: "2", name: "English", proficiency: "Fluent" }],
  certifications: [{ id: "1", name: "Google UX Certificate", issuer: "Google", date: "2022" }],
};

function MiniPreview({ templateKey }: { templateKey: string }) {
  const SCALE = 0.196;
  const W = 816;
  return (
    <div style={{ width: "100%", aspectRatio: "0.772", overflow: "hidden", position: "relative", borderRadius: "6px" }}>
      <div style={{ transform: `scale(${SCALE})`, transformOrigin: "top left", width: `${W}px`, pointerEvents: "none", userSelect: "none", position: "absolute", top: 0, left: 0 }}>
        <TemplateRenderer data={{ ...SAMPLE_CV, template: templateKey as CVFormData["template"] }} watermark={false} />
      </div>
    </div>
  );
}

function TemplatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const { lang } = useLanguage();
  const T = translations[lang].cvForm.templates;

  const templates = TEMPLATE_KEYS.map((t, i) => ({ ...t, desc: T.descs[i] }));

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {templates.map((t) => (
          <div key={t.value} className="relative">
            <button
              type="button"
              onClick={() => onChange(t.value)}
              className={`w-full overflow-hidden rounded-lg border-2 transition-all hover:shadow-md ${
                value === t.value ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <MiniPreview templateKey={t.value} />
              <div className={`px-1.5 py-1 text-center ${value === t.value ? "bg-indigo-50" : "bg-white"}`}>
                <p className="text-[11px] font-semibold leading-tight text-gray-800">{t.label}</p>
                <p className="text-[9px] text-gray-400">{t.desc}</p>
              </div>
            </button>
            <button
              type="button"
              title="Preview"
              onClick={() => setPreview(t.value)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 focus:opacity-100"
              style={{ fontSize: "10px" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {preview && (
        <Dialog open={!!preview} onOpenChange={(open) => { if (!open) setPreview(null); }}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <div>
                <DialogTitle className="text-base">
                  {lang === "fr"
                    ? `Modèle ${templates.find((t) => t.value === preview)?.label}`
                    : `${templates.find((t) => t.value === preview)?.label} Template`}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {templates.find((t) => t.value === preview)?.desc}
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={() => { onChange(preview); setPreview(null); }}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                {T.useTemplate}
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
              <div style={{ transform: "scale(0.72)", transformOrigin: "top left", width: "816px", marginBottom: "-28%" }}>
                <TemplateRenderer data={{ ...SAMPLE_CV, template: preview as CVFormData["template"] }} watermark={false} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

interface CVFormProps {
  defaultValues?: Partial<CVFormData>;
  onSave: (data: CVFormData) => Promise<void>;
  onChange?: (data: Partial<CVFormData>) => void;
  cvId?: string;
  isPro: boolean;
  saving?: boolean;
  hideSaveButton?: boolean;
}

export function CVForm({
  defaultValues,
  onSave,
  onChange,
  cvId,
  isPro,
  saving = false,
  hideSaveButton = false,
}: CVFormProps) {
  const { lang } = useLanguage();
  const T = translations[lang].cvForm;

  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [bulletLoading, setBulletLoading] = useState<number | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [atsResult, setAtsResult] = useState<{ score: number; suggestions: string[] } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CVFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      template: "BASIC",
      name: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      portfolio: "",
      summary: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      languages: [],
      certifications: [],
      ...defaultValues,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange?.(values as Partial<CVFormData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const skills = watch("skills") || [];

  const { fields: expFields,  append: appendExp,  remove: removeExp  } = useFieldArray({ control, name: "experience" });
  const { fields: eduFields,  append: appendEdu,  remove: removeEdu  } = useFieldArray({ control, name: "education" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: "projects" });
  const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({ control, name: "languages" });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications" });

  // --- AI Actions ---

  async function handleAIGenerate() {
    setAiLoading("generate");
    try {
      const values = getValues();
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, lang }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { summary } = await res.json();
      setValue("summary", summary);
      toast.success(T.toasts.summaryGenerated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      toast.error(msg.includes("quota") ? T.toasts.quotaExceeded : T.toasts.summaryFailed);
    } finally {
      setAiLoading(null);
    }
  }

  async function handleATSCheck() {
    setAiLoading("ats");
    try {
      const res = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId, data: getValues(), lang }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      setAtsResult({ score: result.score, suggestions: result.suggestions });
      toast.success(`${T.toasts.atsScorePrefix} ${result.score}/100`);
    } catch {
      toast.error(T.toasts.atsFailed);
    } finally {
      setAiLoading(null);
    }
  }

  async function handleGenerateBullets(idx: number) {
    const exp = getValues(`experience.${idx}`);
    if (!exp.role) {
      toast.error(T.toasts.enterRole);
      return;
    }
    setBulletLoading(idx);
    try {
      const res = await fetch("/api/ai/bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: exp.role, company: exp.company, description: exp.description, lang }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { bullets } = await res.json();
      setValue(`experience.${idx}.achievements`, bullets);
      toast.success(T.toasts.bulletsGenerated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      toast.error(msg.includes("quota") ? T.toasts.quotaExceeded : T.toasts.bulletsFailed);
    } finally {
      setBulletLoading(null);
    }
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    const current = getValues("skills") || [];
    if (!current.includes(trimmed)) setValue("skills", [...current, trimmed]);
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    const current = getValues("skills") || [];
    setValue("skills", current.filter((s) => s !== skill));
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-2">
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">{T.tabs.personal}</TabsTrigger>
          <TabsTrigger value="experience">{T.tabs.experience}</TabsTrigger>
          <TabsTrigger value="education">{T.tabs.education}</TabsTrigger>
          <TabsTrigger value="skills">{T.tabs.skills}</TabsTrigger>
          <TabsTrigger value="projects">{T.tabs.projects}</TabsTrigger>
          <TabsTrigger value="languages">{T.tabs.languages}</TabsTrigger>
          <TabsTrigger value="certifications">{T.tabs.certifications}</TabsTrigger>
          <TabsTrigger value="templates">{T.tabs.templates}</TabsTrigger>
          <TabsTrigger value="ai">{T.tabs.aiTools}</TabsTrigger>
        </TabsList>

        {/* ─── Personal ─── */}
        <TabsContent value="personal" className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              label={T.personal.cvTitle}
              placeholder={T.personal.cvTitlePlaceholder}
              error={errors.title ? T.validation.titleRequired : undefined}
              {...register("title")}
            />
            <div className="flex flex-col gap-0.5">
              <label className="text-xs font-medium text-gray-700">{T.personal.template}</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs">
                <span className="font-medium text-gray-800">
                  {TEMPLATE_KEYS.find((t) => t.value === (watch("template") || "BASIC"))?.label ?? "Basic"}
                </span>
                <span className="text-xs text-gray-400">{T.personal.templateHint}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              label={T.personal.fullName}
              placeholder={T.personal.fullNamePlaceholder}
              error={errors.name ? T.validation.nameRequired : undefined}
              {...register("name")}
            />
            <Input
              label={T.personal.jobTitle}
              placeholder={T.personal.jobTitlePlaceholder}
              error={errors.jobTitle ? T.validation.jobTitleRequired : undefined}
              {...register("jobTitle")}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input label={T.personal.email}    type="email" placeholder={T.personal.emailPlaceholder}    {...register("email")} />
            <Input label={T.personal.phone}             placeholder={T.personal.phonePlaceholder}    {...register("phone")} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input label={T.personal.location}  placeholder={T.personal.locationPlaceholder}  {...register("location")} />
            <Input label={T.personal.website}   placeholder={T.personal.websitePlaceholder}   {...register("website")} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input label={T.personal.linkedin}  placeholder={T.personal.linkedinPlaceholder}  {...register("linkedin")} />
            <Input label={T.personal.github}    placeholder={T.personal.githubPlaceholder}    {...register("github")} />
          </div>

          <Input label={T.personal.portfolio} placeholder={T.personal.portfolioPlaceholder} {...register("portfolio")} />

          <PhotoUpload value={watch("photoUrl")} onChange={(url) => setValue("photoUrl", url)} />

          <Textarea
            label={T.personal.summary}
            placeholder={T.personal.summaryPlaceholder}
            rows={5}
            {...register("summary")}
          />

          {isPro ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={handleAIGenerate}
              loading={aiLoading === "generate"}
            >
              <Wand2 className="h-4 w-4" />
              {T.personal.aiGenerateSummary}
            </Button>
          ) : (
            <Link href="/pricing">
              <Button type="button" variant="outline" size="sm" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
                <Lock className="h-4 w-4" />
                {T.personal.aiGenerateSummary}
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700">{T.ai.premiumBadge}</span>
              </Button>
            </Link>
          )}
        </TabsContent>

        {/* ─── Experience ─── */}
        <TabsContent value="experience" className="space-y-3">
          {expFields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">{T.experience.position} {idx + 1}</h4>
                <button type="button" onClick={() => removeExp(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label={T.experience.company} placeholder={T.experience.companyPlaceholder} {...register(`experience.${idx}.company`)} />
                <Input label={T.experience.role}    placeholder={T.experience.rolePlaceholder}    {...register(`experience.${idx}.role`)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label={T.experience.startDate} placeholder={T.experience.startDatePlaceholder} {...register(`experience.${idx}.startDate`)} />
                <Input label={T.experience.endDate}   placeholder={T.experience.endDatePlaceholder}   {...register(`experience.${idx}.endDate`)} />
              </div>
              <Textarea
                label={T.experience.description}
                placeholder={T.experience.descriptionPlaceholder}
                rows={3}
                {...register(`experience.${idx}.description`)}
              />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-700">{T.experience.achievements}</label>
                  {isPro ? (
                    <button
                      type="button"
                      onClick={() => handleGenerateBullets(idx)}
                      disabled={bulletLoading === idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                    >
                      {bulletLoading === idx ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                      {T.experience.aiGenerate}
                    </button>
                  ) : (
                    <Link href="/pricing" className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100">
                      <Lock className="h-3 w-3" />
                      {T.ai.bulletsPremiumLabel}
                    </Link>
                  )}
                </div>
                <Textarea
                  placeholder={T.experience.achievementsPlaceholder}
                  rows={3}
                  value={watch(`experience.${idx}.achievements`)?.join("\n") ?? ""}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n").filter(Boolean);
                    setValue(`experience.${idx}.achievements`, lines);
                  }}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() =>
              appendExp({ id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: T.experience.endDatePlaceholder, description: "", achievements: [] })
            }
          >
            <Plus className="h-4 w-4" />
            {T.experience.addPosition}
          </Button>
        </TabsContent>

        {/* ─── Education ─── */}
        <TabsContent value="education" className="space-y-3">
          {eduFields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">{T.education.education} {idx + 1}</h4>
                <button type="button" onClick={() => removeEdu(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label={T.education.institution} placeholder={T.education.institutionPlaceholder} {...register(`education.${idx}.institution`)} />
                <Input label={T.education.degree}      placeholder={T.education.degreePlaceholder}      {...register(`education.${idx}.degree`)} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input label={T.education.field}     placeholder={T.education.fieldPlaceholder}     {...register(`education.${idx}.field`)} />
                <Input label={T.education.startYear} placeholder={T.education.startYearPlaceholder} {...register(`education.${idx}.startDate`)} />
                <Input label={T.education.endYear}   placeholder={T.education.endYearPlaceholder}   {...register(`education.${idx}.endDate`)} />
              </div>
              <Input label={T.education.grade} placeholder={T.education.gradePlaceholder} {...register(`education.${idx}.grade`)} />
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() =>
              appendEdu({ id: crypto.randomUUID(), institution: "", degree: "", field: "", startDate: "", endDate: "" })
            }
          >
            <Plus className="h-4 w-4" />
            {T.education.addEducation}
          </Button>
        </TabsContent>

        {/* ─── Skills ─── */}
        <TabsContent value="skills" className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); }}}
              placeholder={T.skills.placeholder}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="button" onClick={addSkill} size="md" variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] rounded-xl border border-gray-100 bg-gray-50 p-2">
            {skills.length === 0 && (
              <p className="text-xs text-gray-400">{T.skills.noSkills}</p>
            )}
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-700"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded-full text-indigo-400 hover:text-indigo-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400">{T.skills.tip}</p>
        </TabsContent>

        {/* ─── Projects ─── */}
        <TabsContent value="projects" className="space-y-3">
          {projFields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">{T.projects.project} {idx + 1}</h4>
                <button type="button" onClick={() => removeProj(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label={T.projects.name} placeholder={T.projects.namePlaceholder} {...register(`projects.${idx}.name`)} />
                <Input label={T.projects.url}  placeholder={T.projects.urlPlaceholder}  {...register(`projects.${idx}.url`)} />
              </div>
              <Textarea
                label={T.projects.description}
                placeholder={T.projects.descriptionPlaceholder}
                rows={2}
                {...register(`projects.${idx}.description`)}
              />
              <Input
                label={T.projects.technologies}
                placeholder={T.projects.technologiesPlaceholder}
                onChange={(e) => {
                  const techs = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                  setValue(`projects.${idx}.technologies`, techs);
                }}
                defaultValue={field.technologies?.join(", ")}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => appendProj({ id: crypto.randomUUID(), name: "", description: "", technologies: [] })}
          >
            <Plus className="h-4 w-4" />
            {T.projects.addProject}
          </Button>
        </TabsContent>

        {/* ─── Languages ─── */}
        <TabsContent value="languages" className="space-y-3">
          {langFields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">{T.languages.language} {idx + 1}</h4>
                <button type="button" onClick={() => removeLang(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label={T.languages.language} placeholder={T.languages.languagePlaceholder} {...register(`languages.${idx}.name`)} />
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs font-medium text-gray-700">{T.languages.proficiency}</label>
                  <Select
                    defaultValue={field.proficiency}
                    onValueChange={(v) => {
                      setValue(`languages.${idx}.proficiency`, v as "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic");
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_VALUES.map((p, i) => (
                        <SelectItem key={p} value={p}>{T.languages.proficiencyOptions[i]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => appendLang({ id: crypto.randomUUID(), name: "", proficiency: "Fluent" })}
          >
            <Plus className="h-4 w-4" />
            {T.languages.addLanguage}
          </Button>
        </TabsContent>

        {/* ─── Certifications ─── */}
        <TabsContent value="certifications" className="space-y-3">
          {certFields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">{T.certifications.certification} {idx + 1}</h4>
                <button type="button" onClick={() => removeCert(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label={T.certifications.name}   placeholder={T.certifications.namePlaceholder}   {...register(`certifications.${idx}.name`)} />
                <Input label={T.certifications.issuer} placeholder={T.certifications.issuerPlaceholder} {...register(`certifications.${idx}.issuer`)} />
                <Input label={T.certifications.date}   placeholder={T.certifications.datePlaceholder}   {...register(`certifications.${idx}.date`)} />
                <Input label={T.certifications.url}    placeholder={T.certifications.urlPlaceholder}    {...register(`certifications.${idx}.url`)} />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => appendCert({ id: crypto.randomUUID(), name: "", issuer: "", date: "", url: "" })}
          >
            <Plus className="h-4 w-4" />
            {T.certifications.addCertification}
          </Button>
        </TabsContent>

        {/* ─── Templates ─── */}
        <TabsContent value="templates" className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">{T.templates.chooseTemplate}</h3>
            <p className="text-xs text-gray-500 mb-3">{T.templates.chooseTemplateHint}</p>
            <TemplatePicker
              value={watch("template") || defaultValues?.template || "BASIC"}
              onChange={(v) => setValue("template", v as CVFormData["template"])}
            />
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">{T.templates.aboutTemplates}</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500">
              {T.templates.groups.map((g) => (
                <span key={g.names}>
                  <strong className="text-gray-700">{g.names}</strong> — {g.desc}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ─── AI Tools ─── */}
        <TabsContent value="ai" className="space-y-4">
          {!isPro && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
              {T.ai.upgradeNotice}
            </div>
          )}

          {/* ATS Check */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">{T.ai.atsTitle}</h3>
              {!isPro && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {T.ai.premiumBadge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{T.ai.atsDescription}</p>

            {isPro ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={handleATSCheck}
                  loading={aiLoading === "ats"}
                >
                  <Sparkles className="h-4 w-4" />
                  {T.ai.runAtsCheck}
                </Button>
                {atsResult && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-xl font-bold ${
                          atsResult.score >= 80 ? "text-green-600" : atsResult.score >= 60 ? "text-amber-600" : "text-red-600"
                        }`}
                      >
                        {atsResult.score}/100
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${
                            atsResult.score >= 80 ? "bg-green-500" : atsResult.score >= 60 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${atsResult.score}%` }}
                        />
                      </div>
                    </div>
                    {atsResult.suggestions.length > 0 && (
                      <ul className="space-y-1.5">
                        {atsResult.suggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="mt-1 text-amber-500">→</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="relative rounded-lg overflow-hidden">
                {/* Blurred mock result */}
                <div className="pointer-events-none select-none space-y-2 p-2 blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-bold text-green-600">87/100</div>
                    <div className="flex-1 h-2 rounded-full bg-gray-100">
                      <div className="h-full w-[87%] rounded-full bg-green-500" />
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1 text-amber-500">→</span>
                      {T.ai.atsMockSugg1}
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1 text-amber-500">→</span>
                      {T.ai.atsMockSugg2}
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1 text-amber-500">→</span>
                      {T.ai.atsMockSugg3}
                    </li>
                  </ul>
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-white/75 backdrop-blur-[2px]">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                    <Lock className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="mb-3 text-xs font-semibold text-gray-700">{T.ai.premiumRequired}</p>
                  <Link href="/pricing">
                    <Button type="button" size="sm" className="gap-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      {T.ai.upgradePremium}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">{T.ai.coverLetterTitle}</h3>
              {!isPro && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {T.ai.premiumBadge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{T.ai.coverLetterDescription}</p>
            {isPro ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => toast.info(lang === "fr"
                  ? "Collez la description du poste ci-dessous et cliquez sur Générer"
                  : "Paste the job description in the field below and click generate"
                )}
              >
                <Wand2 className="h-4 w-4" />
                {T.ai.generateCoverLetter}
              </Button>
            ) : (
              <Link href="/pricing">
                <Button type="button" variant="outline" size="sm" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
                  <Lock className="h-4 w-4" />
                  {T.ai.upgradePremium}
                </Button>
              </Link>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {!hideSaveButton && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          {Object.keys(errors).length > 0 && (
            <p className="text-sm text-red-500">
              {T.form.requiredFields} {Object.keys(errors).join(", ")}
            </p>
          )}
          <Button type="submit" size="lg" loading={saving} className="ml-auto gap-2 px-8">
            {T.form.saveCV}
          </Button>
        </div>
      )}
    </form>
  );
}
