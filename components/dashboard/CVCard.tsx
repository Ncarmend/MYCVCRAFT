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
import { formatDate, getGradient } from "@/lib/utils";
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

export function CVCard({ cv, index, isPro }: CVCardProps) {
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
      const win = window.open("", "_blank");
      if (!win) throw new Error("Popup blocked");
      win.document.write(html);
      win.document.close();
      win.onload = () => {
        win.focus();
        win.print();
      };
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

  const iconBtn =
    "flex h-7 w-7 items-center justify-center rounded-lg transition-colors";

  return (
    <>
      <div className="group relative rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        {/* Color accent header */}
        <div className={`h-2 rounded-t-2xl bg-linear-to-r ${getGradient(index)}`} />

        <div className="p-5">
          {/* Title row */}
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-gray-900">
              {cv.title || cv.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-gray-500">{cv.jobTitle}</p>
          </div>

          {/* Badges row */}
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

          {/* Action row */}
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
            <span className="min-w-0 truncate text-xs text-gray-400">
              {formatDate(cv.updatedAt)}
            </span>

            <div className="flex shrink-0 items-center gap-0.5">
              <Link
                href={`/cv/${cv.id}/edit`}
                title="Edit"
                className={`${iconBtn} text-gray-400 hover:bg-gray-100 hover:text-gray-700`}
              >
                <Edit className="h-3.5 w-3.5" />
              </Link>

              <Link
                href={`/cv/${cv.id}`}
                title="Preview"
                className={`${iconBtn} text-gray-400 hover:bg-gray-100 hover:text-gray-700`}
              >
                <Eye className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={handleDownloadPDF}
                title="Download PDF"
                className={`${iconBtn} text-gray-400 hover:bg-gray-100 hover:text-gray-700`}
              >
                <FileDown className="h-3.5 w-3.5" />
              </button>

              <Link
                href={`/cv/${cv.id}/edit?tab=ai`}
                title="ATS Check"
                className={`${iconBtn} text-gray-400 hover:bg-gray-100 hover:text-gray-700`}
              >
                <Target className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={() => setDeleteOpen(true)}
                title="Delete"
                className={`${iconBtn} text-gray-400 hover:bg-red-50 hover:text-red-500`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
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
