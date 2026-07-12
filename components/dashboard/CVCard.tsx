/**
 * CV card shown in the dashboard grid
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Edit, Trash2, FileDown, Eye, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { CV } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface CVCardProps {
  cv: CV;
  index: number;
  isPro: boolean;
}

export function CVCard({ cv, index: _index, isPro }: CVCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/cv/${cv.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("CV deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete CV");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  async function handleDownloadPDF() {
    if (!isPro) {
      toast.info("Upgrade to Pro for watermark-free PDF export");
    }
    try {
      const res = await fetch(`/api/pdf?cvId=${cv.id}`);
      if (!res.ok) throw new Error("Failed to generate PDF");
      const html = await res.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (!win) throw new Error("Popup blocked");
      win.addEventListener("load", () => {
        win.focus();
        win.print();
        URL.revokeObjectURL(url);
      });
      toast.success("Use 'Save as PDF' in the print dialog.", { duration: 5000 });
    } catch {
      toast.error("Failed to generate PDF");
    }
  }

  const statusVariant = {
    DRAFT: "warning" as const,
    PUBLISHED: "success" as const,
    ARCHIVED: "default" as const,
  }[cv.status];

  const actionBase =
    "flex flex-col items-center gap-1 rounded-lg px-1 py-2 transition-colors";

  const actions = [
    {
      key: "edit",
      icon: <Edit className="h-4 w-4" />,
      label: "Edit",
      as: "link" as const,
      href: `/cv/${cv.id}/edit`,
      className: `${actionBase} text-gray-400 hover:bg-slate-50 hover:text-slate-700`,
    },
    {
      key: "preview",
      icon: <Eye className="h-4 w-4" />,
      label: "Preview",
      as: "link" as const,
      href: `/cv/${cv.id}`,
      className: `${actionBase} text-gray-400 hover:bg-slate-50 hover:text-slate-700`,
    },
    {
      key: "pdf",
      icon: <FileDown className="h-4 w-4" />,
      label: "PDF",
      as: "button" as const,
      onClick: handleDownloadPDF,
      className: `${actionBase} text-gray-400 hover:bg-slate-50 hover:text-slate-700`,
    },
    {
      key: "ats",
      icon: <Target className="h-4 w-4" />,
      label: "ATS",
      as: "link" as const,
      href: `/cv/${cv.id}/edit?tab=ai`,
      className: `${actionBase} text-gray-400 hover:bg-slate-50 hover:text-slate-700`,
    },
    {
      key: "delete",
      icon: <Trash2 className="h-4 w-4" />,
      label: "Delete",
      as: "button" as const,
      onClick: () => setDeleteOpen(true),
      className: `${actionBase} text-gray-400 hover:bg-red-50 hover:text-red-500`,
    },
  ] as const;

  return (
    <>
      <div className="group relative rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        {/* Slate-600 accent bar */}
        <div className="h-1.5 rounded-t-2xl bg-slate-600" />

        <div className="p-6">
          {/* Title */}
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-gray-900">
              {cv.title || cv.name}
            </h3>
             {/*<p className="mt-0.5 truncate text-sm text-gray-500">{cv.jobTitle}</p>*/}
          </div>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant} size="sm">
              {cv.status}
            </Badge>
            <Badge variant="outline" size="sm">
              {cv.template}
            </Badge>
            {cv.atsScore !== null && cv.atsScore !== undefined && (
              <Badge
                variant={
                  cv.atsScore >= 80
                    ? "success"
                    : cv.atsScore >= 60
                    ? "warning"
                    : "danger"
                }
                size="sm"
              >
                ATS {cv.atsScore}
              </Badge>
            )}
          </div>

          {/* Updated date */}
          <p className="mt-4 text-xs text-gray-400">
            Updated {formatDate(cv.updatedAt)}
          </p>

          {/* Action grid — icon + label, 5 equal columns */}
          <div className="mt-2 grid grid-cols-5 gap-1 border-t border-gray-100 pt-3">
            {actions.map((action) =>
              action.as === "link" ? (
                <Link
                  key={action.key}
                  href={action.href}
                  className={action.className}
                >
                  {action.icon}
                  <span className="text-[10px] font-medium leading-none">
                    {action.label}
                  </span>
                </Link>
              ) : (
                <button
                  key={action.key}
                  onClick={action.onClick}
                  className={action.className}
                >
                  {action.icon}
                  <span className="text-[10px] font-medium leading-none">
                    {action.label}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete CV</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{cv.title || cv.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
