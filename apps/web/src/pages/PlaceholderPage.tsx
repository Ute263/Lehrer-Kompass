import { PageHeader } from "../design-system/components";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return <div className="placeholder-page"><PageHeader title={title} description={description} /><div className="quiet-placeholder" role="note"><p>Noch keine Fachfunktion aktiv.</p></div></div>;
}
