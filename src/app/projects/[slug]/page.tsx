import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS } from "@/data/projects";
import ProjectDetail from "@/components/ProjectDetail";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} | Dave Zachary Macarayo`,
    description: project.headline,
    openGraph: {
      title: `${project.title} | Dave Zachary Macarayo`,
      description: project.headline,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();

  return (
    <ProjectDetail
      project={PROJECTS[idx]}
      prev={idx > 0 ? PROJECTS[idx - 1] : null}
      next={idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null}
      projectIndex={idx}
      prevIndex={idx > 0 ? idx - 1 : null}
      nextIndex={idx < PROJECTS.length - 1 ? idx + 1 : null}
    />
  );
}
