"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

export function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert(
          "Please upload a PDF, JPG, or PNG file. Other file types are not supported."
        );
        return;
      }
      setSelectedFile(file);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed
          px-8 py-12 text-center transition-all cursor-pointer
          ${
            dragOver
              ? "border-[var(--color-gold)] bg-[var(--color-gold-light)]/10"
              : selectedFile
                ? "border-[var(--color-navy)]/30 bg-[var(--color-navy)]/5"
                : "border-border hover:border-[var(--color-navy)]/40 hover:bg-muted/50"
          }
          ${disabled ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleInputChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-navy)]/10">
              <FileText className="h-7 w-7 text-[var(--color-navy)]" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(selectedFile);
                }}
                className="bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)]"
              >
                Analyze Document
              </Button>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
              >
                <X className="mr-1 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
              <Upload className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">
              Upload a declarations page
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag and drop a PDF or image, or click to browse
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Supports PDF, JPG, PNG
            </p>
          </>
        )}
      </div>
    </div>
  );
}
