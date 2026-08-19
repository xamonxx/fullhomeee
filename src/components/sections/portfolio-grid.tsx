"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { ProjectCardWithSlider } from "@/components/shared/project-card";
import type { Category, Project } from "@/components/shared/portfolio-types";

/** Loaded on demand so framer-motion stays out of the homepage bundle. */
const ProjectModal = dynamic(
  () => import("@/components/shared/project-modal").then((m) => m.ProjectModal),
  { ssr: false }
);

interface Props {
  initialProjects: Project[];
  categories: Category[];
  teaserCount: number;
}

/**
 * Interactive part of the homepage portfolio teaser. The initial six cards come
 * from the server as props and render in the first HTML; fetching only happens
 * once a visitor picks a different category.
 */
export function PortfolioGrid({ initialProjects, categories, teaserCount }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const selectCategory = async (category: string) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);

    if (category === "all") {
      setProjects(initialProjects);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio/projects?category=${category}&page=1`);
      const data = await res.json();
      setProjects((data.projects ?? []).slice(0, teaserCount));
    } catch (err) {
      console.error("Projects fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const pillClass = (active: boolean) =>
    cn(
      "font-sans text-xs md:text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 focus:outline-none",
      active
        ? "bg-primary text-white shadow-sm scale-105"
        : "bg-background text-warm-gray border border-foreground/10 hover:bg-black/5 hover:text-primary"
    );

  return (
    <>
      {/* Category Pill Filters */}
      <div className="reveal flex flex-wrap items-center justify-center gap-2.5 md:gap-3 mt-8 md:mt-12 mb-14">
        <button type="button" onClick={() => selectCategory("all")} className={pillClass(selectedCategory === "all")}>
          Semua Proyek
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => selectCategory(cat.id)}
            className={pillClass(selectedCategory === cat.id)}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Interactive Grid With Card Sliders */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {Array.from({ length: teaserCount }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-2xl bg-black/5 animate-pulse border border-foreground/12"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-sans text-warm-gray text-sm">Tidak ada proyek dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {projects.map((project, idx) => (
            <ProjectCardWithSlider
              key={project.id}
              project={project}
              index={idx}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          key={selectedProject.id}
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
