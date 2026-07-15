# Design-Tokens – The Quiet Workspace

Quelle der implementierten Werte ist `apps/web/src/design-system/tokens/tokens.css`. Komponenten verwenden ausschließlich diese CSS Custom Properties; direkte Werte sind nur für intrinsische Details zulässig.

## Farben

| Token | Wert | Zweck |
| --- | --- | --- |
| `--color-page` | `#f4f7f8` | ruhiger Seitenhintergrund |
| `--color-card` | `#ffffff` | Karten und Overlays |
| `--color-soft` | `#edf4f6` | zurückhaltende Flächen |
| `--color-primary` | `#2f6175` | primäre Aktion und Auswahl |
| `--color-turquoise` | `#3a8b8c` | Akzent und Orientierung |
| `--color-green` | `#4f8069` | positiver Status |
| `--color-beige` | `#f5efe4` | neutraler Hinweis |
| `--color-text` | `#18323d` | Primärtext |
| `--color-text-secondary` | `#4a626b` | Sekundärtext |
| `--color-text-muted` | `#687c83` | Zusatztext |
| `--color-border` | `#cbd8dc` | Linien und Begrenzungen |
| `--color-focus` | `#0b6e99` | Fokusindikator |
| `--color-info` | `#ddecf2` | Information |
| `--color-success` | `#e1f0e7` | Erfolg |
| `--color-warning` | `#f7edcf` | Warnung |
| `--color-error` | `#f8e0df` | technischer Fehler |
| `--color-destructive` | `#9b3f3b` | destruktive Aktion |

Status darf nie nur durch Farbe vermittelt werden; Text und bei Bedarf ein Icon sind verpflichtend.

## Typografie

Systemschrift-Stack über `--font-family`. Größen: `--font-size-xs` 13 px, `sm` 15 px, `md` 16 px, `lg` 20 px, `xl` 26 px, `2xl` 34 px. Zeilenhöhen: `--line-tight` 1,2 und `--line-normal` 1,5. Gewichte: 400, 600 und 700. Fließtext unterschreitet 15 px nicht.

## Abstände

Die Skala `--space-1/2/3/4/6/8/12` bildet 4, 8, 12, 16, 24, 32 und 48 px ab. Komponenten kombinieren ausschließlich diese Stufen.

## Rundungen und Schatten

`--radius-sm` 8 px, `--radius-md` 12 px, `--radius-lg` 16 px und `--radius-round` für Pills. `--shadow-sm` trennt Karten dezent, `--shadow-md` hebt Dialog und Drawer ab. Der Fokus-Ring `--focus-ring` ist kontrastreich und 3 px breit.

## Animation

`--motion-short` 120 ms für unmittelbare Zustände und `--motion-medium` 220 ms für Layoutwechsel. Bei `prefers-reduced-motion: reduce` werden Übergänge und Animationen praktisch deaktiviert.

## Größen und Breakpoints

Bedienelemente sind mindestens 44 px hoch (`--control-min`, `--icon-control-min`). Weitere Maße: Inhaltsbreite 82 rem, Lesebreite 46 rem, Navigation 15,5/4,75 rem, Drawer 25 rem. Der Tablet-Breakpoint liegt bei 64 rem; unter 42 rem greift die Smartphone-Begleitansicht.
