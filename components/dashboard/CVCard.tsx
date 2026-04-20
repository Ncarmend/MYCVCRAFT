/**
 * CV card shown in the dashboard grid
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  FileDown,
  Eye,
  Target,
} from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <>
      <div className="group relative rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        {/* Color accent header */}
        <div
          className={`h-2 rounded-t-2xl bg-linear-to-r ${getGradient(index)}`}
        />

        <div className="p-5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-gray-900">
                {cv.title || cv.name}
              </h3>
              <p className="mt-0.5 truncate text-sm text-gray-500">
                {cv.jobTitle}
              </p>
            </div>

            {/* Kebab menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
                  onBlur={() => setMenuOpen(false)}
                >
                  {[
                    {
                      icon: Edit,
                      label: "Edit",
                      onClick: () => router.push(`/cv/${cv.id}/edit`),
                    },
                    {
                      icon: Eye,
                      label: "Preview",
                      onClick: () => router.push(`/cv/${cv.id}`),
                    },
                    {
                      icon: FileDown,
                      label: "Download PDF",
                      onClick: handleDownloadPDF,
                    },
                    {
                      icon: Target,
                      label: "ATS Check",
                      onClick: () => router.push(`/cv/${cv.id}/edit?tab=ai`),
                    },
                    {
                      icon: Trash2,
                      label: "Delete",
                      onClick: () => {
                        setMenuOpen(false);
                        setDeleteOpen(true);
                      },
                      danger: true,
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setMenuOpen(false);
                        item.onClick();
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        item.danger
                          ? "text-red-500 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 flex items-center gap-3">
            <Badge variant={statusVariant} size="sm">
              {cv.status}
            </Badge>
            <Badge variant="outline" size="sm">
              {cv.template}
            </Badge>
            {cv.atsScore !== null && cv.atsScore !== undefined && (
              <Badge
                variant={cv.atsScore >= 80 ? "success" : cv.atsScore >= 60 ? "warning" : "danger"}
                size="sm"
              >
                ATS {cv.atsScore}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Updated {formatDate(cv.updatedAt)}
            </span>
            <Link
              href={`/cv/${cv.id}/edit`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
            >
              Edit
            </Link>
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
