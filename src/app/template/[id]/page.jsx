
import TemplateDetails from "./TemplateDetailsClient";

export async function generateStaticParams() {
  try {
    const templates = await fetch('https://beyondinviteb.onrender.com/api/templates').then((res) => res.json());
    return templates.map((template) => ({
      id: template.id.toString(),
    }));
  } catch (err) {
    console.error("Error fetching templates for static params:", err);
    return [];
  }
}

export default function Page() {
  return <TemplateDetails />;
}
