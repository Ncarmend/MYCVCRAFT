/**
 * CV creation/editing form with all sections
 * Uses react-hook-form + zod for validation
 */
"use client";

import { useState, useCallback } from "react";
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
import { Plus, Trash2, Sparkles, Wand2, Target, FileText, Loader2 } from "lucide-react";
import type { CVFormData } from "@/types";

// --- Zod schema ---
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  template: z.enum(["BASIC", "MODERN", "EXECUTIVE"]),
  name: z.string().min(1, "Name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
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

interface CVFormProps {
  defaultValues?: Partial<CVFormData>;
  onSave: (data: CVFormData) => Promise<void>;
  onChange?: (data: Partial<CVFormData>) => void;
  cvId?: string;
  isPro: boolean;
  saving?: boolean;
}

export function CVForm({
  defaultValues,
  onSave,
  onChange,
  cvId,
  isPro,
  saving = false,
}: CVFormProps) {
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [bulletLoading, setBulletLoading] = useState<number | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [atsResult, setAtsResult] = useState<{
    score: number;
    suggestions: string[];
  } | null>(null);

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

  // Watch all values for live preview
  const watchedValues = watch();
  // Notify parent of changes (debounced via useCallback)
  const notifyChange = useCallback(() => {
    onChange?.(getValues());
  }, [onChange, getValues]);

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({ control, name: "experience" });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: "education" });

  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
  } = useFieldArray({ control, name: "projects" });

  const {
    fields: langFields,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({ control, name: "languages" });

  // --- AI Actions ---

  async function handleAIGenerate() {
    setAiLoading("generate");
    try {
      const values = getValues();
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(await res.text());
      const { content } = await res.json();
      setValue("summary", content);
      notifyChange();
      toast.success("CV content generated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      toast.error(msg.includes("quota") ? "OpenAI quota exceeded — check your billing." : "AI generation failed. Please try again.");
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
        body: JSON.stringify({ cvId, data: getValues() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      setAtsResult({ score: result.score, suggestions: result.suggestions });
      toast.success(`ATS Score: ${result.score}/100`);
    } catch {
      toast.error("ATS check failed. Please try again.");
    } finally {
      setAiLoading(null);
    }
  }

  async function handleGenerateBullets(idx: number) {
    const exp = getValues(`experience.${idx}`);
    if (!exp.role) {
      toast.error("Enter a role title first.");
      return;
    }
    setBulletLoading(idx);
    try {
      const res = await fetch("/api/ai/bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: exp.role, company: exp.company, description: exp.description }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { bullets } = await res.json();
      setValue(`experience.${idx}.achievements`, bullets);
      notifyChange();
      toast.success("Bullet points generated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate bullet points.";
      toast.error(msg.includes("quota") ? "OpenAI quota exceeded — check your billing." : "Failed to generate bullet points.");
    } finally {
      setBulletLoading(null);
    }
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    const current = getValues("skills") || [];
    if (!current.includes(trimmed)) {
      setValue("skills", [...current, trimmed]);
      notifyChange();
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    const current = getValues("skills") || [];
    setValue("skills", current.filter((s) => s !== skill));
    notifyChange();
  }

  const skills = watchedValues.skills || [];

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      onChange={notifyChange}
      className="space-y-6"
    >
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
        </TabsList>

        {/* ─── Personal Tab ─── */}
        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="CV Title (internal)"
              placeholder="e.g. Senior Developer CV"
              error={errors.title?.message}
              {...register("title")}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Template</label>
              <Select
                defaultValue={defaultValues?.template || "BASIC"}
                onValueChange={(v) => {
                  setValue("template", v as "BASIC" | "MODERN" | "EXECUTIVE");
                  notifyChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">Basic (ATS-friendly)</SelectItem>
                  <SelectItem value="MODERN">Modern (Two-column)</SelectItem>
                  <SelectItem value="EXECUTIVE">Executive (Coming soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              placeholder="Jane Smith"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Job Title *"
              placeholder="Software Engineer"
              error={errors.jobTitle?.message}
              {...register("jobTitle")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" placeholder="jane@example.com" {...register("email")} />
            <Input label="Phone" placeholder="+1 555 000 0000" {...register("phone")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" placeholder="San Francisco, CA" {...register("location")} />
            <Input label="Website" placeholder="https://jane.dev" {...register("website")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="LinkedIn" placeholder="linkedin.com/in/jane-smith" {...register("linkedin")} />
            <Input label="GitHub" placeholder="github.com/jane-smith" {...register("github")} />
          </div>
          <Input label="Portfolio" placeholder="https://jane.dev" {...register("portfolio")} />

          <Textarea
            label="Professional Summary"
            placeholder="Write a brief summary or click 'AI Generate' below..."
            rows={5}
            {...register("summary")}
          />

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={handleAIGenerate}
            loading={aiLoading === "generate"}
          >
            <Wand2 className="h-4 w-4" />
            AI Generate Summary
          </Button>
        </TabsContent>

        {/* ─── Experience Tab ─── */}
        <TabsContent value="experience" className="space-y-4">
          {expFields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Position {idx + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeExp(idx)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Company" placeholder="Google" {...register(`experience.${idx}.company`)} />
                <Input label="Role" placeholder="Senior Engineer" {...register(`experience.${idx}.role`)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Date" placeholder="Jan 2022" {...register(`experience.${idx}.startDate`)} />
                <Input label="End Date" placeholder="Present" {...register(`experience.${idx}.endDate`)} />
              </div>
              <Textarea
                label="Description"
                placeholder="Describe your responsibilities..."
                rows={3}
                {...register(`experience.${idx}.description`)}
              />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Achievements (one per line)</label>
                  <button
                    type="button"
                    onClick={() => handleGenerateBullets(idx)}
                    disabled={bulletLoading === idx}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                  >
                    {bulletLoading === idx ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                    AI Generate
                  </button>
                </div>
                <Textarea
                  placeholder="Increased performance by 40%&#10;Led a team of 8 engineers"
                  rows={3}
                  value={watch(`experience.${idx}.achievements`)?.join("\n") ?? ""}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n").filter(Boolean);
                    setValue(`experience.${idx}.achievements`, lines);
                    notifyChange();
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
              appendExp({
                id: crypto.randomUUID(),
                company: "",
                role: "",
                startDate: "",
                endDate: "Present",
                description: "",
                achievements: [],
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add Position
          </Button>
        </TabsContent>

        {/* ─── Education Tab ─── */}
        <TabsContent value="education" className="space-y-4">
          {eduFields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Education {idx + 1}</h4>
                <button type="button" onClick={() => removeEdu(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Institution" placeholder="MIT" {...register(`education.${idx}.institution`)} />
                <Input label="Degree" placeholder="B.Sc." {...register(`education.${idx}.degree`)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Field" placeholder="Computer Science" {...register(`education.${idx}.field`)} />
                <Input label="Start Year" placeholder="2018" {...register(`education.${idx}.startDate`)} />
                <Input label="End Year" placeholder="2022" {...register(`education.${idx}.endDate`)} />
              </div>
              <Input label="Grade / GPA (optional)" placeholder="3.9 GPA" {...register(`education.${idx}.grade`)} />
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() =>
              appendEdu({
                id: crypto.randomUUID(),
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        </TabsContent>

        {/* ─── Skills Tab ─── */}
        <TabsContent value="skills" className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); }}}
              placeholder="Type a skill and press Enter"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="button" onClick={addSkill} size="md" variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[60px] rounded-xl border border-gray-100 bg-gray-50 p-3">
            {skills.length === 0 && (
              <p className="text-sm text-gray-400">No skills added yet</p>
            )}
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
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
          <p className="text-xs text-gray-400">
            Tip: Add 10–15 skills relevant to your target role for best ATS results.
          </p>
        </TabsContent>

        {/* ─── Projects Tab ─── */}
        <TabsContent value="projects" className="space-y-4">
          {projFields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Project {idx + 1}</h4>
                <button type="button" onClick={() => removeProj(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Project Name" placeholder="AI CV Generator" {...register(`projects.${idx}.name`)} />
                <Input label="URL (optional)" placeholder="https://..." {...register(`projects.${idx}.url`)} />
              </div>
              <Textarea
                label="Description"
                placeholder="What did this project do? What was your role?"
                rows={2}
                {...register(`projects.${idx}.description`)}
              />
              <Input
                label="Technologies (comma-separated)"
                placeholder="React, Node.js, PostgreSQL"
                onChange={(e) => {
                  const techs = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                  setValue(`projects.${idx}.technologies`, techs);
                  notifyChange();
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
            onClick={() =>
              appendProj({
                id: crypto.randomUUID(),
                name: "",
                description: "",
                technologies: [],
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </TabsContent>

        {/* ─── Languages Tab ─── */}
        <TabsContent value="languages" className="space-y-4">
          {langFields.map((field, idx) => (
            <div key={field.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Language {idx + 1}</h4>
                <button type="button" onClick={() => removeLang(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Language" placeholder="English" {...register(`languages.${idx}.name`)} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Proficiency</label>
                  <Select
                    defaultValue={field.proficiency}
                    onValueChange={(v) => {
                      setValue(`languages.${idx}.proficiency`, v as "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic");
                      notifyChange();
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Native", "Fluent", "Advanced", "Intermediate", "Basic"].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
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
            Add Language
          </Button>
        </TabsContent>

        {/* ─── AI Tools Tab ─── */}
        <TabsContent value="ai" className="space-y-6">
          {!isPro && (
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 text-sm text-indigo-700">
              <strong>ATS Check is free.</strong> Upgrade to Pro to unlock job matching and cover letter generation.
            </div>
          )}

          {/* ATS Check */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">ATS Optimization Check</h3>
            </div>
            <p className="text-sm text-gray-500">
              Analyze your CV against Applicant Tracking Systems and get a score + improvement suggestions.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={handleATSCheck}
              loading={aiLoading === "ats"}
            >
              <Sparkles className="h-4 w-4" />
              Run ATS Check
            </Button>
            {atsResult && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl font-bold ${
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
          </div>

          {/* Cover Letter */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Cover Letter Generator</h3>
              {!isPro && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Pro</span>}
            </div>
            <p className="text-sm text-gray-500">
              Generate a personalized cover letter for any job application.
            </p>
            {isPro ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => toast.info("Paste the job description in the field below and click generate")}
              >
                <Wand2 className="h-4 w-4" />
                Generate Cover Letter
              </Button>
            ) : (
              <Button type="button" variant="outline" size="sm" disabled className="gap-2">
                <Wand2 className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Save button */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        {Object.keys(errors).length > 0 && (
          <p className="text-sm text-red-500">
            Please fill in the required fields: {Object.keys(errors).join(", ")}
          </p>
        )}
        <Button type="submit" size="lg" loading={saving} className="ml-auto gap-2 px-8">
          Save CV
        </Button>
      </div>
    </form>
  );
}
