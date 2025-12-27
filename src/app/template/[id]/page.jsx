import TemplateDetails from "./TemplateDetailsClient";
import { API_BASE_URL } from "@/lib/api";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE_URL}/templates`);
    if (!res.ok) {
      console.warn(`Static param fetch failed with status ${res.status}. Returning placeholder param.`);
      return [{ id: '1' }];
    }
    const templates = await res.json();
    if (!Array.isArray(templates) || templates.length === 0) {
      console.warn("API response for templates is not an array or is empty. Returning placeholder param.");
      return [{ id: '1' }];
    }
    return templates.map((template) => ({
      id: template.id.toString(),
    }));
  } catch (err) {
    console.error("Error fetching templates for static params:", err);
    return [{ id: '1' }];
  }
}

export default function Page() {
  return <TemplateDetails />;
}
